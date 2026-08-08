<?php

namespace App\Http\Controllers\Auth;

use App\Enums\PermissionName;
use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\SuperAdmin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoginController extends Controller
{
    /**
     * Show the Super Admin login page.
     */
    public function index(): Response|RedirectResponse
    {
        if (Auth::guard('super_admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('admin-login');
    }

    /**
     * Authenticate a Super Admin via session.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        if (Auth::guard('super_admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        $throttleKey = Str::lower($request->string('email')->toString()).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        if (! Auth::guard('super_admin')->attempt(
            $request->only('email', 'password'),
            $request->boolean('remember')
        )) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        /** @var SuperAdmin $admin */
        $admin = Auth::guard('super_admin')->user();

        if (! $admin->hasRole(RoleName::SuperAdmin->value)
            && ! $admin->can(PermissionName::AdminAccess->value)) {
            Auth::guard('super_admin')->logout();

            throw ValidationException::withMessages([
                'email' => __('You are not authorized to access the admin panel.'),
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $admin->update([
            'last_login' => now(),
        ]);

        return redirect()->route('admin.dashboard');
    }

    /**
     * Log the Super Admin out.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('super_admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
