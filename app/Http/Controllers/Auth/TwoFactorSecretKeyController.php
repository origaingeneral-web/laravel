<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class TwoFactorSecretKeyController extends Controller
{
    /**
     * Get the current user's two factor authentication secret key.
     */
    public function show(Request $request): JsonResponse
    {
        if (is_null($request->user()->two_factor_secret)) {
            abort(404, 'Two factor authentication has not been enabled.');
        }

        return response()->json([
            'secretKey' => Crypt::decrypt($request->user()->two_factor_secret),
        ]);
    }
}
