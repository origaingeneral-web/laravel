<?php

declare(strict_types=1);

namespace App\Trait;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\LostConnectionException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

trait TryCatchHandler
{
    use ApiResponse;
    use LoggerTrait;

    protected function tryCatch(
        callable $callback,
        string $errorMessage = 'Something went wrong.',
        ?string $logChannel = null,
        int $status = 500
    ): mixed {
        try {
            return $callback();
        } catch (ValidationException $exception) {
            $this->logMessage(
                level: 'warning',
                message: 'Request validation failed.',
                context: [
                    'errors' => $exception->errors(),
                    'exception_class' => $exception::class,
                ],
                channel: $logChannel,
            );

            return $this->error(
                message: 'Validation failed.',
                errors: $exception->errors(),
                status: 422,
                errorCode: 'VALIDATION_ERROR',
            );
        } catch (ModelNotFoundException $exception) {
            $this->logMessage(
                level: 'notice',
                message: 'Requested model was not found.',
                context: [
                    'model' => $exception->getModel(),
                    'ids' => $exception->getIds(),
                    'exception_class' => $exception::class,
                ],
                channel: $logChannel,
            );

            return $this->error(
                message: 'Record not found.',
                errors: [],
                status: 404,
                errorCode: 'RESOURCE_NOT_FOUND',
            );
        } catch (LostConnectionException $exception) {
            $this->logException(
                exception: $exception,
                message: 'Database connection was lost.',
                channel: $logChannel,
            );

            return $this->error(
                message: 'The database service is temporarily unavailable.',
                errors: [],
                status: 503,
                notification: true,
                errorCode: 'DATABASE_UNAVAILABLE',
            );
        } catch (QueryException $exception) {
            $this->logMessage(
                level: 'error',
                message: 'Database query failed.',
                context: [
                    'exception' => $exception,
                    'connection' => $exception->getConnectionName(),
                    'sql' => config('app.debug') ? $exception->getSql() : null,
                ],
                channel: $logChannel,
            );

            return $this->error(
                message: 'A database operation failed.',
                errors: $this->debugErrors($exception),
                status: 500,
                errorCode: 'DATABASE_QUERY_ERROR',
            );
        } catch (HttpExceptionInterface $exception) {
            $httpStatus = $exception->getStatusCode();

            $this->logException(
                exception: $exception,
                message: 'HTTP exception occurred.',
                channel: $logChannel,
                level: $httpStatus >= 500 ? 'error' : 'warning',
            );

            return $this->error(
                message: $httpStatus >= 500
                    ? $errorMessage
                    : ($exception->getMessage() ?: 'Request could not be completed.'),
                errors: $this->debugErrors($exception),
                status: $httpStatus,
                errorCode: 'HTTP_ERROR',
            );
        } catch (Throwable $exception) {
            $this->logException(
                exception: $exception,
                message: 'Unhandled callback exception.',
                channel: $logChannel,
            );

            return $this->error(
                message: $errorMessage,
                errors: $this->debugErrors($exception),
                status: $status,
                errorCode: 'INTERNAL_SERVER_ERROR',
            );
        }
    }

    private function logException(
        Throwable $exception,
        string $message,
        ?string $channel = null,
        string $level = 'error'
    ): void {
        $this->logMessage(
            level: $level,
            message: $message,
            context: [
                'exception' => $exception,
                'exception_class' => $exception::class,
            ],
            channel: $channel,
        );
    }

    private function debugErrors(Throwable $exception): array
    {
        if (! config('app.debug')) {
            return [];
        }

        return [
            [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ],
        ];
    }
}
