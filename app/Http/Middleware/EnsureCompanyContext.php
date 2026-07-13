<?php

namespace App\Http\Middleware;

use App\Enums\RoleName;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyContext
{
    /**
     * Ensure the authenticated user belongs to an active company tenant.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
                'errors' => null,
            ], 401);
        }

        if (! $user->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Company context is required.',
                'errors' => null,
            ], 403);
        }

        if (! $user->hasAnyRole([
            RoleName::CompanyAdmin->value,
            RoleName::Employee->value,
        ])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized company access.',
                'errors' => null,
            ], 403);
        }

        $company = $user->company;

        if (! $company || ! $company->isAccessible()) {
            return response()->json([
                'success' => false,
                'message' => 'Your company account is inactive or unavailable.',
                'errors' => null,
            ], 403);
        }

        $request->attributes->set('company', $company);

        return $next($request);
    }
}
