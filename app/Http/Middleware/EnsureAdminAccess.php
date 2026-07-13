<?php

namespace App\Http\Middleware;

use App\Enums\PermissionName;
use App\Enums\RoleName;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    /**
     * Ensure the authenticated Super Admin may access the admin panel.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = Auth::guard('super_admin')->user();

        if (! $admin) {
            return redirect()->guest(route('admin.login'));
        }

        if (! $admin->hasRole(RoleName::SuperAdmin->value)
            && ! $admin->can(PermissionName::AdminAccess->value)) {
            abort(Response::HTTP_FORBIDDEN, 'Unauthorized admin access.');
        }

        return $next($request);
    }
}
