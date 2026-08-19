<?php

declare(strict_types=1);

namespace App\Trait;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * @param  array<string, mixed>|object|null  $data
     * @param  array<string, mixed>  $meta
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        bool $notification = true,
        array $meta = []
    ): JsonResponse {
        // Support flexible order if ($message, $data) is passed
        if (is_string($data) && ! is_string($message) && $message !== 'Success') {
            $temp = $data;
            $data = $message;
            $message = $temp;
        }

        $response = [
            'success' => true,
            'message' => $message,
            'notification' => $notification,
            'data' => $data,
        ];

        if ($meta !== []) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $status);
    }

    /**
     * @param  array<string, mixed>|null  $errors
     */
    protected function error(
        string $message = 'Something went wrong.',
        ?array $errors = null,
        int $status = 500,
        bool $notification = true,
        ?string $errorCode = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
            'notification' => $notification,
            'errors' => $errors ?? [],
        ];

        if ($errorCode !== null) {
            $response['error_code'] = $errorCode;
        }

        return response()->json($response, $status);
    }
}
