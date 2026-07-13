<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TwoFactorLoginRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorAuthenticatedSessionController extends Controller
{
    /**
     * Show the two factor authentication challenge view.
     */
    public function create(TwoFactorLoginRequest $request): Response
    {
        if (! $request->hasChallengedUser()) {
            throw new HttpResponseException(redirect()->route('login'));
        }

        return Inertia::render('auth/two-factor-challenge');
    }

    /**
     * Attempt to authenticate using a two factor code.
     */
    public function store(TwoFactorLoginRequest $request): RedirectResponse
    {
        $user = $request->challengedUser();

        if ($code = $request->validRecoveryCode()) {
            $user->replaceRecoveryCode($code);
        } elseif (! $request->hasValidCode()) {
            [$key, $message] = $request->filled('recovery_code')
                ? ['recovery_code', __('The provided two factor recovery code was invalid.')]
                : ['code', __('The provided two factor authentication code was invalid.')];

            throw ValidationException::withMessages([
                $key => [$message],
            ]);
        }

        Auth::login($user, $request->remember());

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
