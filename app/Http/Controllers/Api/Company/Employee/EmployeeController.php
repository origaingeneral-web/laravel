<?php

namespace App\Http\Controllers\Api\Company\Employee;

use App\Enums\RoleName;
use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\ResetEmployeePasswordRequest;
use App\Http\Requests\Api\Company\StoreEmployeeRequest;
use App\Http\Requests\Api\Company\SyncEmployeeProductsRequest;
use App\Http\Requests\Api\Company\UpdateEmployeeRequest;
use App\Http\Requests\Api\Company\UpdateEmployeeStatusRequest;
use App\Http\Resources\Api\Company\EmployeeResource;
use App\Models\Product\UserProductAccess;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    use RespondsWithJson;

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $companyId = (int) $request->user()->company_id;
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);
        $search = trim(Str::limit($request->string('search')->toString(), 100, ''));

        $employees = User::query()
            ->select([
                'id',
                'company_id',
                'user_prefix',
                'name',
                'email',
                'is_active',
                'initial_role',
                'email_verified_at',
                'created_at',
                'updated_at',
            ])
            ->where('company_id', $companyId)
            ->with([
                'roles:id,name,guard_name',
                'productAccess:id,user_id,company_id,product_id,is_active',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                // Prefer sargable prefix matches; avoid leading-wildcard when possible.
                if (str_contains($search, '@')) {
                    $query->where('email', 'like', $search.'%');

                    return;
                }

                $query->where(function ($inner) use ($search): void {
                    $inner->where('name', 'like', $search.'%')
                        ->orWhere('email', 'like', $search.'%')
                        ->orWhere('user_prefix', 'like', $search.'%');
                });
            })
            ->when($request->has('is_active'), function ($query) use ($request): void {
                $query->where('is_active', $request->boolean('is_active'));
            })
            ->orderByDesc('id')
            ->paginate($perPage);

        return $this->success([
            'employees' => EmployeeResource::collection($employees->items()),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
        ]);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $companyId = (int) $request->user()->company_id;
        $prefix = $request->string('user_prefix')->toString()
            ?: strtoupper(Str::random(3)).$companyId;

        $employee = User::query()->create([
            'company_id' => $companyId,
            'user_prefix' => $prefix,
            'name' => $request->string('name')->toString(),
            'email' => Str::lower($request->string('email')->toString()),
            'password' => $request->string('password')->toString(),
            'initial_role' => 'user',
            'is_active' => $request->boolean('is_active', true),
            'email_verified_at' => now(),
        ]);

        $employee->assignRole(RoleName::Employee->value);

        if ($request->filled('product_ids')) {
            $this->syncProductAccess($employee, $companyId, $request->input('product_ids', []));
        }

        return $this->success([
            'employee' => new EmployeeResource($employee->load(['roles', 'productAccess'])),
        ], 'Employee created.', 201);
    }

    public function show(Request $request, int $employee): JsonResponse
    {
        $model = $this->findCompanyEmployee($request, $employee);
        $this->authorize('view', $model);

        return $this->success([
            'employee' => new EmployeeResource($model->load(['roles', 'productAccess'])),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, int $employee): JsonResponse
    {
        $model = $this->findCompanyEmployee($request, $employee);
        $this->authorize('update', $model);

        $data = $request->safe()->except(['password', 'product_ids']);

        if ($request->filled('email')) {
            $data['email'] = Str::lower($request->string('email')->toString());
        }

        if ($request->filled('password')) {
            $data['password'] = $request->string('password')->toString();
        }

        $model->fill($data);
        $model->save();

        if ($request->exists('product_ids')) {
            $this->syncProductAccess($model, (int) $request->user()->company_id, $request->input('product_ids', []));
        }

        return $this->success([
            'employee' => new EmployeeResource($model->fresh()->load(['roles', 'productAccess'])),
        ], 'Employee updated.');
    }

    public function updateStatus(UpdateEmployeeStatusRequest $request, int $employee): JsonResponse
    {
        $model = $this->findCompanyEmployee($request, $employee);
        $this->authorize('updateStatus', $model);

        $model->update([
            'is_active' => $request->boolean('is_active'),
        ]);

        if (! $model->is_active) {
            $model->tokens()->delete();
        }

        return $this->success([
            'employee' => new EmployeeResource($model->fresh()->load(['roles', 'productAccess'])),
        ], 'Employee status updated.');
    }

    public function resetPassword(ResetEmployeePasswordRequest $request, int $employee): JsonResponse
    {
        $model = $this->findCompanyEmployee($request, $employee);
        $this->authorize('resetPassword', $model);

        $model->update([
            'password' => $request->string('password')->toString(),
        ]);

        $model->tokens()->delete();

        return $this->success(null, 'Employee password reset.');
    }

    public function syncProducts(SyncEmployeeProductsRequest $request, int $employee): JsonResponse
    {
        $model = $this->findCompanyEmployee($request, $employee);
        $this->authorize('update', $model);

        $this->syncProductAccess(
            $model,
            (int) $request->user()->company_id,
            $request->input('product_ids', []),
        );

        return $this->success([
            'employee' => new EmployeeResource($model->fresh()->load(['roles', 'productAccess'])),
        ], 'Employee product access updated.');
    }

    /**
     * @param  list<int|string>  $productIds
     */
    private function syncProductAccess(User $employee, int $companyId, array $productIds): void
    {
        $productIds = collect($productIds)->map(fn ($id) => (int) $id)->unique()->values();
        $now = now();

        UserProductAccess::query()
            ->where('user_id', $employee->id)
            ->where('company_id', $companyId)
            ->when(
                $productIds->isNotEmpty(),
                fn ($query) => $query->whereNotIn('product_id', $productIds->all()),
                fn ($query) => $query
            )
            ->delete();

        if ($productIds->isEmpty()) {
            return;
        }

        $rows = $productIds->map(fn (int $productId): array => [
            'user_id' => $employee->id,
            'company_id' => $companyId,
            'product_id' => $productId,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        UserProductAccess::query()->upsert(
            $rows,
            ['user_id', 'product_id'],
            ['company_id', 'is_active', 'updated_at']
        );
    }

    private function findCompanyEmployee(Request $request, int $employeeId): User
    {
        return User::query()
            ->where('company_id', (int) $request->user()->company_id)
            ->whereKey($employeeId)
            ->firstOrFail();
    }
}
