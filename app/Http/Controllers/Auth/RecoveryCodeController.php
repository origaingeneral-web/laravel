<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RecoveryCodeController extends Controller
{
    /**
     * Get the two factor authentication recovery codes.
     */
    public function index(Request $request): JsonResponse|array
    {
        if (! $request->user()->two_factor_secret
            || ! $request->user()->two_factor_recovery_codes) {
            return [];
        }

        return response()->json(json_decode(Crypt::decrypt(
            $request->user()->two_factor_recovery_codes
        ), true));
    }

    /**
     * Generate a fresh set of two factor authentication recovery codes.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->user()->generateNewRecoveryCodes();

        return back()->with('status', 'recovery-codes-generated');
    }
}
