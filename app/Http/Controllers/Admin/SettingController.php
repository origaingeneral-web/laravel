<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(string $group): Response
    {
        $validGroups = ['email', 'sms', 'whatsapp', 'payment', 'cron', 'firebase'];

        if (! in_array($group, $validGroups, true)) {
            abort(404);
        }

        $settings = Setting::where('group', $group)->pluck('value', 'key')->toArray();

        return Inertia::render('admin/settings/edit', [
            'group' => $group,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, string $group): RedirectResponse
    {
        $validGroups = ['email', 'sms', 'whatsapp', 'payment', 'cron', 'firebase'];

        if (! in_array($group, $validGroups, true)) {
            abort(404);
        }

        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['group' => $group, 'key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', ucfirst($group).' settings updated successfully.');
    }
}
