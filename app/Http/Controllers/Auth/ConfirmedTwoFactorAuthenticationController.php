<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorAuthenticationProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;

class ConfirmedTwoFactorAuthenticationController extends Controller
{
    /**
     * Confirm two factor authentication for the user.
     */
    public function store(Request $request, TwoFactorAuthenticationProvider $provider): RedirectResponse
    {
        $user = $request->user();
        $code = $request->input('code');

        if (empty($user->two_factor_secret)
            || empty($code)
            || ! $provider->verify(Crypt::decrypt($user->two_factor_secret), $code)) {
            throw ValidationException::withMessages([
                'code' => [__('The provided two factor authentication code was invalid.')],
            ])->errorBag('confirmTwoFactorAuthentication');
        }

        $user->confirmTwoFactorAuthentication();

        return back()->with('status', 'two-factor-authentication-confirmed');
    }
}
