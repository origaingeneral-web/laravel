<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfirmedPasswordStatusController extends Controller
{
    /**
     * Get the password confirmation status.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'confirmed' => (time() - $request->session()->get('auth.password_confirmed_at', 0)) < $request->input('seconds', config('auth.password_timeout', 10800)),
        ]);
    }
}
