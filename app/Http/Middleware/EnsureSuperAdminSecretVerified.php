<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdminSecretVerified
{
    /**
     * Handle an incoming request for protected settings and system pages.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->get('super_admin_secret_verified') !== true) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Super admin secret password verification required.',
                    'requires_secret_verification' => true,
                ], 403);
            }

            $intended = '/'.$request->path();
            if ($request->getQueryString()) {
                $intended .= '?'.$request->getQueryString();
            }

            return redirect()->route('admin.secret-access.show', [
                'intended' => $intended,
            ]);
        }

        return $next($request);
    }
}
