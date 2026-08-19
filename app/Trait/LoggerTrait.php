<?php

declare(strict_types=1);

namespace App\Trait;

use Illuminate\Support\Facades\Log;
use Psr\Log\LogLevel;
use Throwable;

trait LoggerTrait
{
    /**
     * Allowed PSR-3 log levels.
     */
    private const LOG_LEVELS = [
        LogLevel::EMERGENCY,
        LogLevel::ALERT,
        LogLevel::CRITICAL,
        LogLevel::ERROR,
        LogLevel::WARNING,
        LogLevel::NOTICE,
        LogLevel::INFO,
        LogLevel::DEBUG,
    ];

    protected function logMessage(
        string $level = LogLevel::ERROR,
        string $message = '',
        array $context = [],
        ?string $channel = null
    ): void {
        $level = strtolower($level);

        if (! in_array($level, self::LOG_LEVELS, true)) {
            $level = LogLevel::ERROR;
        }

        $requestContext = [];

        /*
         * request() may not be available when running console commands,
         * queue jobs or scheduled tasks.
         */
        if (app()->runningInConsole() === false && request()) {
            $requestContext = [
                // Avoid fullUrl() because query parameters may contain tokens.
                'url' => request()->url(),
                'method' => request()->method(),
                'ip' => request()->ip(),
                'user_id' => auth()->id(),
                'request_id' => request()->header('X-Request-ID'),
            ];
        }

        $context = array_filter(
            array_merge($requestContext, $context),
            static fn (mixed $value): bool => $value !== null
        );

        try {
            if ($channel !== null && $channel !== '') {
                if (config("logging.channels.{$channel}")) {
                    $logger = Log::channel($channel);
                } else {
                    // Create dynamic daily log channel on demand
                    $cleanChannel = trim(str_replace(['\\', ' '], ['/', '_'], $channel), '/');
                    $filePath = str_contains($cleanChannel, '/')
                        ? storage_path("logs/{$cleanChannel}.log")
                        : storage_path("logs/{$cleanChannel}/{$cleanChannel}.log");

                    $logger = Log::build([
                        'driver' => 'daily',
                        'path' => $filePath,
                        'level' => config('logging.channels.daily.level', env('LOG_LEVEL', 'debug')),
                        'days' => (int) env('LOG_DAILY_DAYS', 14),
                        'replace_placeholders' => true,
                    ]);
                }
            } else {
                $logger = Log::getFacadeRoot();
            }

            $logger->log($level, $message, $context);
        } catch (Throwable $exception) {
            /*
             * Logging should not break the application.
             * Fall back to the default logger.
             */
            Log::error('Failed to write to requested log channel.', [
                'requested_channel' => $channel,
                'original_message' => $message,
                'logging_exception' => $exception->getMessage(),
            ]);
        }
    }
}
