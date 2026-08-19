<?php

use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

test('tryCatch executes successfully and logs errors with dynamic channel creation', function () {
    $controller = new class
    {
        use TryCatchHandler;

        public function successAction(): JsonResponse
        {
            return $this->tryCatch(function () {
                return $this->success(['id' => 123], 'Action executed.');
            }, 'Failed action.', 'dynamic_test_channel');
        }

        public function failingAction(): JsonResponse
        {
            return $this->tryCatch(function () {
                throw new RuntimeException('Dynamic channel exception.');
            }, 'Failed action.', 'dynamic_custom_logs');
        }
    };

    $successResponse = $controller->successAction();
    expect($successResponse->getStatusCode())->toBe(200);
    $data = $successResponse->getData(true);
    expect($data['success'])->toBeTrue()
        ->and($data['message'])->toBe('Action executed.')
        ->and($data['data']['id'])->toBe(123);

    $failResponse = $controller->failingAction();
    expect($failResponse->getStatusCode())->toBe(500);
    $failData = $failResponse->getData(true);
    expect($failData['success'])->toBeFalse()
        ->and($failData['message'])->toBe('Failed action.');

    // Verify dynamic log file directory/file was created
    $expectedPath = storage_path('logs/dynamic_custom_logs');
    expect(File::isDirectory($expectedPath) || File::exists($expectedPath.'.log'))->toBeTrue();
});
