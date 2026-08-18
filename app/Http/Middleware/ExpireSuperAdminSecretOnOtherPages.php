<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExpireSuperAdminSecretOnOtherPages
{
    /**
     * Expire the super admin secret verification whenever navigating outside Settings and System pages.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $path = trim($request->path(), '/');

        // Check if the current request is within the allowed secret sessions zone
        $isProtectedArea = str_starts_with($path, 'admin/settings')
            || str_starts_with($path, 'admin/system')
            || str_starts_with($path, 'admin/secret-access');

        if (! $isProtectedArea && $request->session()->has('super_admin_secret_verified')) {
            $request->session()->forget([
                'super_admin_secret_verified',
                'super_admin_secret_verified_at',
            ]);
        }

        return $next($request);
    }
}
