<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Enable two factor authentication for the user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->user()->enableTwoFactorAuthentication($request->boolean('force', false));

        return back()->with('status', 'two-factor-authentication-enabled');
    }

    /**
     * Disable two factor authentication for the user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->disableTwoFactorAuthentication();

        return back()->with('status', 'two-factor-authentication-disabled');
    }
}
