<?php

namespace App\Services;

use App\Models\Admin\Setting\Setting;
use App\Models\Company\Company;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    /**
     * Send a Push Notification using Firebase Cloud Messaging.
     */
    public function sendPushNotification(string $title, string $body, string $targetType, ?int $targetId = null): bool
    {
        // 1. Get Settings
        $settings = Setting::where('group', 'firebase')->pluck('value', 'key');
        $apiKey = $settings->get('firebase_api_key');
        $projectId = $settings->get('firebase_project_id');

        if (! $apiKey || ! $projectId) {
            Log::warning('Firebase is not configured in settings. Cannot send push notification.');

            return false;
        }

        // 2. Determine target FCM Tokens based on targetType and targetId
        // This is a placeholder. You would normally fetch the device tokens from the User or Company models.
        $deviceTokens = [];

        if ($targetType === 'user') {
            // $deviceTokens = User::find($targetId)?->fcm_tokens()->pluck('token')->toArray() ?? [];
        } elseif ($targetType === 'company') {
            // $deviceTokens = User::where('company_id', $targetId)->get()->flatMap->fcm_tokens()->pluck('token')->toArray();
        } else {
            // send to a topic like "all_users"
            $topic = 'all';
        }

        // 3. Send via FCM HTTP v1 API or Legacy API
        // This example assumes using the legacy server key for simplicity.
        // For HTTP v1, you would need to generate an OAuth2 token using the service account JSON.

        try {
            $payload = [
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'sound' => 'default',
                ],
            ];

            if (isset($topic)) {
                $payload['to'] = '/topics/'.$topic;
            } else {
                if (empty($deviceTokens)) {
                    return false;
                }
                $payload['registration_ids'] = $deviceTokens;
            }

            $response = Http::withHeaders([
                'Authorization' => 'key='.$apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', $payload);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error('FCM Send Error: '.$e->getMessage());

            return false;
        }
    }
}
