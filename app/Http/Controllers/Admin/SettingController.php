<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        // Handle file removals
        if ($request->input('upi_qr_image_remove') === '1') {
            $old = Setting::where('group', $group)->where('key', 'upi_qr_image')->first();
            if ($old && $old->value) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $old->value));
                $old->update(['value' => null]);
            }
            unset($data['upi_qr_image_remove'], $data['upi_qr_image']);
        }

        if ($request->input('bank_image_remove') === '1') {
            $old = Setting::where('group', $group)->where('key', 'bank_image')->first();
            if ($old && $old->value) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $old->value));
                $old->update(['value' => null]);
            }
            unset($data['bank_image_remove'], $data['bank_image']);
        }

        // Handle file uploads
        foreach ($request->allFiles() as $key => $file) {
            if ($file->isValid()) {
                $oldSetting = Setting::where('group', $group)->where('key', $key)->first();
                if ($oldSetting && $oldSetting->value) {
                    $relativePath = str_replace('/storage/', '', $oldSetting->value);
                    if (Storage::disk('public')->exists($relativePath)) {
                        Storage::disk('public')->delete($relativePath);
                    }
                }

                $path = $file->store('settings/'.$group, 'public');
                $data[$key] = '/storage/'.$path;
            }
        }

        foreach ($data as $key => $value) {
            if (is_bool($value)) {
                $value = $value ? '1' : '0';
            }

            // Don't overwrite image path with null if no new file uploaded
            if ($value === null && in_array($key, ['upi_qr_image', 'bank_image'], true)) {
                continue;
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['group' => $group, 'value' => $value]
            );
        }

        return back()->with('success', ucfirst($group).' settings updated successfully.');
    }
}
