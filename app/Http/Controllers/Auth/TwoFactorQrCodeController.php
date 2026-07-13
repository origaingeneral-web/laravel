<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorQrCodeController extends Controller
{
    /**
     * Get the SVG QR code for the user's two factor authentication.
     */
    public function show(Request $request): JsonResponse|array
    {
        if (is_null($request->user()->two_factor_secret)) {
            return [];
        }

        return response()->json([
            'svg' => $request->user()->twoFactorQrCodeSvg(),
            'url' => $request->user()->twoFactorQrCodeUrl(),
        ]);
    }
}
