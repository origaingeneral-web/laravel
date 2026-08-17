<?php

namespace App\Http\Middleware;

use App\Models\Admin\AppAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isSuperAdmin = Auth::guard('super_admin')->check();
        $user = $isSuperAdmin ? Auth::guard('super_admin')->user() : $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
                'guard' => $isSuperAdmin ? 'super_admin' : 'web',
                'roles' => $user && method_exists($user, 'getRoleNames')
                    ? $user->getRoleNames()->values()->all()
                    : [],
                'permissions' => $user && method_exists($user, 'getAllPermissions')
                    ? $user->getAllPermissions()->pluck('name')->values()->all()
                    : [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app_notifications' => fn () => $user ? AppAnnouncement::query()
                ->where('type', 'panel')
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })
                ->where(function ($q) use ($user, $isSuperAdmin) {
                    $q->where('target_type', 'all');
                    if (! $isSuperAdmin && isset($user->company_id)) {
                        $q->orWhere(function ($sq) use ($user) {
                            $sq->where('target_type', 'company')
                                ->where('target_id', $user->company_id);
                        });
                    }
                    $q->orWhere(function ($sq) use ($user) {
                        $sq->where('target_type', 'user')
                            ->where('target_id', $user->id);
                    });
                })
                ->get(['id', 'title', 'message', 'panel_display_style']) : [],
        ];
    }
}
