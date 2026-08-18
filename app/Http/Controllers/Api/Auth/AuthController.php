<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\RoleName;
use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Resources\Api\Company\CompanyProductSummaryResource;
use App\Http\Resources\Api\Company\CompanySummaryResource;
use App\Http\Resources\Api\UserResource;
use App\Models\Company\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use RespondsWithJson;

    /**
     * Authenticate a company/employee user and issue a Sanctum token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        /** @var User|null $user */
        $user = User::query()
            ->with([
                'company:id,company_name,company_code,email,mobile,status,profile,deleted_at',
                'roles:id,name,guard_name',
                'permissions:id,name,guard_name',
            ])
            ->where('email', $request->string('email')->lower()->toString())
            ->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => [__('Your account is inactive.')],
            ]);
        }

        $products = collect();

        if ($user->hasAnyRole([RoleName::CompanyAdmin->value, RoleName::Employee->value])) {
            $company = $user->company;

            if (! $company || ! $company->isAccessible()) {
                throw ValidationException::withMessages([
                    'email' => [__('Your company account is inactive or unavailable.')],
                ]);
            }

            $products = $user->accessibleCompanyProducts();

            if ($products->isEmpty()) {
                throw ValidationException::withMessages([
                    'email' => [__('No products are available for your account.')],
                ]);
            }

            if ($products->every(fn ($subscription) => ! $subscription->isAccessible())) {
                throw ValidationException::withMessages([
                    'email' => [__('All product subscriptions for your company are inactive or expired.')],
                ]);
            }
        }

        $user->tokens()->where('name', 'api')->delete();

        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
            'company' => $user->company
                ? new CompanySummaryResource($user->company)
                : null,
            'products' => CompanyProductSummaryResource::collection($products),
        ], 'Authenticated successfully.');
    }

    /**
     * Revoke the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Return the authenticated user with roles, permissions, company, and products.
     */
    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->loadMissing([
            'roles:id,name,guard_name',
            'permissions:id,name,guard_name',
            'company:id,company_name,company_code,email,mobile,status,profile,deleted_at',
        ]);

        $products = $user->company_id
            ? $user->accessibleCompanyProducts()
            : collect();

        return $this->success([
            'user' => new UserResource($user),
            'company' => $user->company
                ? new CompanySummaryResource($user->company)
                : null,
            'products' => CompanyProductSummaryResource::collection($products),
        ]);
    }
}
