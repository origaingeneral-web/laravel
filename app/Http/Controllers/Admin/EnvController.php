<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class EnvController extends Controller
{
    /**
     * Display the environment configuration page.
     */
    public function index(): Response
    {
        $envPath = base_path('.env');
        $envExists = File::exists($envPath);
        $isWritable = $envExists && is_writable($envPath);

        $envData = [
            'app_name' => env('APP_NAME', config('app.name', 'Laravel')),
            'app_env' => env('APP_ENV', config('app.env', 'production')),
            'app_debug' => (bool) env('APP_DEBUG', config('app.debug', false)),
            'app_url' => env('APP_URL', config('app.url', 'http://localhost')),
            'app_timezone' => env('APP_TIMEZONE', config('app.timezone', 'UTC')),
            'app_locale' => env('APP_LOCALE', config('app.locale', 'en')),
            'app_fallback_locale' => env('APP_FALLBACK_LOCALE', config('app.fallback_locale', 'en')),
            'log_level' => env('LOG_LEVEL', config('logging.channels.stack.level', 'debug')),
            'session_lifetime' => (int) env('SESSION_LIFETIME', config('session.lifetime', 120)),
            'session_driver' => env('SESSION_DRIVER', config('session.driver', 'file')),
            'cache_store' => env('CACHE_STORE', config('cache.default', 'file')),
            'queue_connection' => env('QUEUE_CONNECTION', config('queue.default', 'sync')),
        ];

        return Inertia::render('admin/system/env', [
            'envData' => $envData,
            'envMeta' => [
                'path' => $envPath,
                'exists' => $envExists,
                'is_writable' => $isWritable,
                'last_modified' => $envExists ? date('Y-m-d H:i:s', File::lastModified($envPath)) : null,
                'size' => $envExists ? File::size($envPath) : 0,
            ],
            'timezones' => \DateTimeZone::listIdentifiers(),
        ]);
    }

    /**
     * Update the .env file with new configuration.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'app_name' => ['required', 'string', 'max:100'],
            'app_env' => ['required', 'string', 'in:production,local,staging,testing'],
            'app_debug' => ['required'],
            'app_url' => ['required', 'string', 'max:255'],
            'app_timezone' => ['required', 'string'],
            'app_locale' => ['required', 'string', 'max:20'],
            'log_level' => ['required', 'string', 'in:debug,info,notice,warning,error,critical,alert,emergency'],
            'session_lifetime' => ['required', 'numeric', 'min:1', 'max:525600'],
            'session_driver' => ['nullable', 'string'],
            'cache_store' => ['nullable', 'string'],
            'queue_connection' => ['nullable', 'string'],
        ]);

        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            return back()->with('error', '.env file does not exist.');
        }

        if (! is_writable($envPath)) {
            return back()->with('error', '.env file is not writable. Please check file permissions.');
        }

        $content = File::get($envPath);

        // Normalize debug boolean
        $debugValue = filter_var($request->input('app_debug'), FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';

        $keysToUpdate = [
            'APP_NAME' => $request->input('app_name'),
            'APP_ENV' => $request->input('app_env'),
            'APP_DEBUG' => $debugValue,
            'APP_URL' => rtrim($request->input('app_url'), '/'),
            'APP_TIMEZONE' => $request->input('app_timezone'),
            'APP_LOCALE' => $request->input('app_locale'),
            'LOG_LEVEL' => $request->input('log_level'),
            'SESSION_LIFETIME' => (string) $request->input('session_lifetime'),
            'SESSION_DRIVER' => $request->input('session_driver', 'file'),
            'CACHE_STORE' => $request->input('cache_store', 'file'),
            'QUEUE_CONNECTION' => $request->input('queue_connection', 'sync'),
        ];

        foreach ($keysToUpdate as $key => $val) {
            $this->setEnvVariable($content, $key, (string) $val);
        }

        File::put($envPath, $content);

        // Clear config and optimization caches
        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
        } catch (\Throwable $e) {
            // Ignore cache clear error if running in restricted environments
        }

        return back()->with('success', 'Environment configuration (.env) updated successfully.');
    }

    /**
     * Safely update or append an environment variable in .env content.
     */
    protected function setEnvVariable(string &$content, string $key, string $value): void
    {
        // Format value: quote if contains spaces, special characters or hash
        $formattedValue = (str_contains($value, ' ') || str_contains($value, '#') || str_contains($value, '$'))
            ? '"'.str_replace('"', '\"', $value).'"'
            : $value;

        $pattern = "/^{$key}=.*/m";

        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, "{$key}={$formattedValue}", $content);
        } else {
            $content = rtrim($content)."\n{$key}={$formattedValue}\n";
        }
    }
}
