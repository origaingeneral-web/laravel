<?php

namespace App\Http\Controllers\Admin\Company;

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanyRequest;
use App\Http\Requests\Admin\UpdateCompanyRequest;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use App\Models\Product\UserProductAccess;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user('super_admin')?->can('company.view'), 403);

        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $companies = Company::query()
            ->select([
                'id',
                'company_name',
                'company_code',
                'email',
                'mobile',
                'status',
                'created_at',
            ])
            ->with(['companyProducts.plan'])
            ->withCount('companyProducts')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('company_name', 'like', $search.'%')
                        ->orWhere('company_code', 'like', $search.'%')
                        ->orWhere('email', 'like', $search.'%');
                });
            })
            ->when($request->filled('status'), function ($query) use ($request): void {
                $query->where('status', (int) $request->input('status'));
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        $companies->getCollection()->transform(function ($company) {
            $product = $company->companyProducts->first();
            if ($product) {
                $company->plan_name = $product->plan?->plan_name ?? 'N/A';
                $company->expires_at = $product->expires_at ? $product->expires_at->format('Y-m-d') : 'N/A';

                $usage = UserProductAccess::query()
                    ->where('company_id', $company->id)
                    ->where('product_id', $product->product_id)
                    ->where('is_active', true)
                    ->count();

                $company->usage_info = $usage.' / '.($product->staff_limit ?: '∞');
            } else {
                $company->plan_name = 'N/A';
                $company->expires_at = 'N/A';
                $company->usage_info = '0 / 0';
            }
            $company->makeHidden('companyProducts');

            return $company;
        });

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
                'status' => $request->input('status'),
            ],
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user('super_admin')?->can('company.create'), 403);

        return Inertia::render('admin/companies/create', [
            'lookups' => $this->lookups(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $data = $request->safe()->except([
            'create_admin',
            'admin_name',
            'admin_email',
            'admin_password',
            'admin_password_confirmation',
        ]);

        $data['company_code'] = strtoupper(
            $data['company_code'] ?? $this->generateCompanyCode()
        );
        $data['email'] = Str::lower($data['email']);
        $data['status'] = $data['status'] ?? CompanyStatus::Active->value;
        $data['terms_accepted'] = true;
        $data['terms_accepted_at'] = now();

        $company = DB::transaction(function () use ($request, $data) {
            $company = Company::query()->create($data);

            if ($request->boolean('create_admin')) {
                $admin = User::query()->create([
                    'company_id' => $company->id,
                    'user_prefix' => 'ADM'.strtoupper(Str::random(4)),
                    'name' => $request->string('admin_name')->toString(),
                    'email' => Str::lower($request->string('admin_email')->toString()),
                    'password' => $request->string('admin_password')->toString(),
                    'initial_role' => 'admin',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]);

                $admin->assignRole(RoleName::CompanyAdmin->value);
            }

            return $company;
        });

        return redirect()
            ->route('admin.companies.show', $company)
            ->with('success', 'Company created successfully.');
    }

    public function show(Request $request, Company $company): Response
    {
        abort_unless($request->user('super_admin')?->can('company.view'), 403);

        $company->load([
            'companyProducts.product:id,name,code,is_active',
            'companyProducts.plan:id,product_id,plan_name,features',
        ]);

        return Inertia::render('admin/companies/show', [
            'company' => [
                'id' => $company->id,
                'business_category_id' => $company->business_category_id,
                'company_name' => $company->company_name,
                'company_code' => $company->company_code,
                'email' => $company->email,
                'mobile' => $company->mobile,
                'owner_name' => $company->owner_name,
                'owner_mobile' => $company->owner_mobile,
                'country_id' => $company->country_id,
                'state_id' => $company->state_id,
                'city_id' => $company->city_id,
                'area_id' => $company->area_id,
                'landline' => $company->landline,
                'pincode' => $company->pincode,
                'address' => $company->address,
                'status' => $company->status,
                'created_at' => $company->created_at,
                'products' => $company->companyProducts->map(fn (CompanyProduct $subscription) => [
                    'id' => $subscription->product_id,
                    'subscription_id' => $subscription->id,
                    'name' => $subscription->product?->name,
                    'code' => $subscription->product?->code,
                    'status' => $subscription->isExpired() ? 'expired' : $subscription->status,
                    'is_accessible' => $subscription->isAccessible(),
                    'plan_id' => $subscription->plan_id,
                    'plan_name' => $subscription->plan?->plan_name,
                    'features' => $subscription->plan?->features ?? [],
                    'starts_at' => $subscription->starts_at,
                    'expires_at' => $subscription->expires_at,
                    'staff_limit' => $subscription->staff_limit,
                    'usage' => UserProductAccess::query()
                        ->where('company_id', $company->id)
                        ->where('product_id', $subscription->product_id)
                        ->where('is_active', true)
                        ->count(),
                ]),
            ],
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function edit(Request $request, Company $company): Response
    {
        abort_unless($request->user('super_admin')?->can('company.update'), 403);

        return Inertia::render('admin/companies/edit', [
            'company' => $company->only([
                'id',
                'business_category_id',
                'company_name',
                'company_code',
                'email',
                'mobile',
                'owner_name',
                'owner_mobile',
                'country_id',
                'state_id',
                'city_id',
                'area_id',
                'landline',
                'pincode',
                'address',
                'status',
                'disabled_reason',
            ]),
            'lookups' => $this->lookups(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $data = $request->validated();

        if (isset($data['email'])) {
            $data['email'] = Str::lower($data['email']);
        }

        if (isset($data['company_code'])) {
            $data['company_code'] = strtoupper($data['company_code']);
        }

        $company->fill($data);
        $company->save();

        return redirect()
            ->route('admin.companies.show', $company)
            ->with('success', 'Company updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function lookups(): array
    {
        return [
            'businessCategories' => DB::table('business_categories')
                ->orderBy('category')
                ->get(['id', 'category']),
            'countries' => DB::table('countries')
                ->orderBy('country')
                ->get(['id', 'country', 'iso3']),
            'states' => DB::table('states')
                ->orderBy('state')
                ->get(['id', 'country_id', 'state', 'code']),
            'cities' => DB::table('cities')
                ->orderBy('city')
                ->limit(500)
                ->get(['id', 'state_id', 'city']),
        ];
    }

    /**
     * @return list<array{value: int, label: string}>
     */
    private function statusOptions(): array
    {
        return [
            ['value' => CompanyStatus::Active->value, 'label' => 'Active'],
            ['value' => CompanyStatus::Inactive->value, 'label' => 'Inactive'],
            ['value' => CompanyStatus::Disabled->value, 'label' => 'Disabled'],
        ];
    }

    private function generateCompanyCode(): string
    {
        do {
            $code = strtoupper(Str::random(4));
        } while (Company::query()->where('company_code', $code)->exists());

        return $code;
    }
}
