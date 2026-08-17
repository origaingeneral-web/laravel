<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\AppAnnouncement;
use App\Models\Company;
use App\Models\User;
use App\Services\FirebaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function indexFirebase(Request $request): Response
    {
        $perPage = 15;
        $notifications = AppAnnouncement::query()
            ->where('type', 'firebase')
            ->orderByDesc('id')
            ->paginate($perPage);

        return Inertia::render('admin/communication/notifications/firebase/index', [
            'notifications' => $notifications,
        ]);
    }

    public function createFirebase(): Response
    {
        return Inertia::render('admin/communication/notifications/firebase/create', [
            'companies' => Company::select('id', 'company_name as label')->get(),
            'users' => User::select('id', 'name as label', 'email')->get(),
        ]);
    }

    public function storeFirebase(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_type' => 'required|in:all,company,user',
            'target_id' => 'nullable|integer',
        ]);

        $data['type'] = 'firebase';

        $announcement = AppAnnouncement::create($data);

        $firebaseService = new FirebaseService;
        $firebaseService->sendPushNotification(
            $announcement->title,
            $announcement->message,
            $announcement->target_type,
            $announcement->target_id
        );

        return redirect()->route('admin.notifications.firebase.index')
            ->with('success', 'Firebase push notification queued for sending.');
    }

    public function indexPanel(Request $request): Response
    {
        $perPage = 15;
        $notifications = AppAnnouncement::query()
            ->where('type', 'panel')
            ->orderByDesc('id')
            ->paginate($perPage);

        return Inertia::render('admin/communication/notifications/panel/index', [
            'notifications' => $notifications,
        ]);
    }

    public function createPanel(): Response
    {
        return Inertia::render('admin/communication/notifications/panel/create', [
            'companies' => Company::select('id', 'company_name as label')->get(),
            'users' => User::select('id', 'name as label', 'email')->get(),
        ]);
    }

    public function storePanel(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_type' => 'required|in:all,company,user',
            'target_id' => 'nullable|integer',
            'panel_display_style' => 'required|in:banner,bell',
            'expires_at' => 'nullable|date',
        ]);

        $data['type'] = 'panel';

        AppAnnouncement::create($data);

        return redirect()->route('admin.notifications.panel.index')
            ->with('success', 'Panel notification saved successfully.');
    }
}
