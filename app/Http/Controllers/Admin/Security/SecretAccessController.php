<?php

namespace App\Http\Controllers\Admin\Security;

use App\Http\Controllers\Controller;
use App\Models\Auth\SuperAdmin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SecretAccessController extends Controller
{
    /**
     * Display the secret password verification challenge screen.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $intended = $request->query('intended', route('admin.settings.edit', 'email'));

        // If already verified in this session, go straight to the destination
        if ($request->session()->get('super_admin_secret_verified') === true) {
            return redirect()->to($intended);
        }

        return Inertia::render('admin/security/secret-access', [
            'intended' => $intended,
        ]);
    }

    /**
     * Verify the entered secret password.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'secret_password' => 'required|string',
            'intended' => 'nullable|string',
        ]);

        /** @var SuperAdmin|null $admin */
        $admin = Auth::guard('super_admin')->user();

        if (! $admin || ! $admin->verifySecretPassword((string) $request->input('secret_password'))) {
            return back()->withErrors([
                'secret_password' => 'The secret password provided is incorrect.',
            ]);
        }

        // Mark session as secret verified
        $request->session()->put('super_admin_secret_verified', true);
        $request->session()->put('super_admin_secret_verified_at', now()->timestamp);

        $intended = (string) $request->input('intended');
        if ($intended === '' || ! str_contains($intended, '/admin/')) {
            $intended = route('admin.settings.edit', 'email');
        }

        return redirect()->to($intended)->with('success', 'Security verification successful. Access granted.');
    }

    /**
     * Lock the session and expire secret verification.
     */
    public function lock(Request $request): RedirectResponse
    {
        $request->session()->forget(['super_admin_secret_verified', 'super_admin_secret_verified_at']);

        return redirect()->route('admin.dashboard')->with('info', 'Security session locked.');
    }
}
