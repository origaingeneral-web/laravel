<?php

declare(strict_types=1);

namespace App\Trait\File;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

trait FileUploadTrait
{
    /**
     * Upload a file and return its metadata.
     *
     * @return array{
     *     disk: string,
     *     path: string,
     *     directory: string,
     *     filename: string,
     *     original_name: string,
     *     extension: string|null,
     *     mime_type: string|null,
     *     size: int,
     *     url: string|null
     * }
     */
    protected function uploadFile(
        UploadedFile $file,
        string $directory,
        string $disk = 'public',
        ?string $filename = null,
        string $visibility = 'private'
    ): array {
        $this->validateUploadedFile($file);

        $directory = $this->sanitizeDirectory($directory);

        $extension = strtolower($file->getClientOriginalExtension());

        $filename = $filename
            ? $this->sanitizeFilename($filename, $extension)
            : $this->generateUniqueFilename($extension);

        try {
            $path = $file->storeAs(
                $directory,
                $filename,
                [
                    'disk' => $disk,
                    'visibility' => $visibility,
                ]
            );

            if ($path === false) {
                throw new RuntimeException('Unable to store uploaded file.');
            }

            return [
                'disk' => $disk,
                'path' => $path,
                'directory' => $directory,
                'filename' => basename($path),
                'original_name' => $file->getClientOriginalName(),
                'extension' => $extension !== '' ? $extension : null,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'url' => $this->getFileUrl($path, $disk),
            ];
        } catch (Throwable $exception) {
            report($exception);

            throw new RuntimeException(
                'File upload failed.',
                previous: $exception
            );
        }
    }

    /**
     * Replace an existing file.
     */
    protected function replaceFile(
        UploadedFile $newFile,
        ?string $oldPath,
        string $directory,
        string $disk = 'public',
        ?string $filename = null,
        string $visibility = 'private'
    ): array {
        $uploadedFile = $this->uploadFile(
            file: $newFile,
            directory: $directory,
            disk: $disk,
            filename: $filename,
            visibility: $visibility
        );

        try {
            if ($oldPath && $oldPath !== $uploadedFile['path']) {
                $this->deleteFile($oldPath, $disk);
            }

            return $uploadedFile;
        } catch (Throwable $exception) {
            /*
             * Delete the newly uploaded file if old-file cleanup fails.
             */
            $this->deleteFile($uploadedFile['path'], $disk);

            throw $exception;
        }
    }

    protected function deleteFile(
        ?string $path,
        string $disk = 'public'
    ): bool {
        if (! $path) {
            return true;
        }

        $path = $this->sanitizeStoredPath($path);

        if (! Storage::disk($disk)->exists($path)) {
            return true;
        }

        return Storage::disk($disk)->delete($path);
    }

    /**
     * Delete multiple files.
     *
     * @param  array<int, string>  $paths
     */
    protected function deleteFiles(
        array $paths,
        string $disk = 'public'
    ): bool {
        $paths = array_values(
            array_filter(
                array_map(
                    fn (string $path): string => $this->sanitizeStoredPath($path),
                    $paths
                )
            )
        );

        if ($paths === []) {
            return true;
        }

        return Storage::disk($disk)->delete($paths);
    }

    protected function fileExists(
        ?string $path,
        string $disk = 'public'
    ): bool {
        if (! $path) {
            return false;
        }

        return Storage::disk($disk)->exists(
            $this->sanitizeStoredPath($path)
        );
    }

    protected function getFileUrl(
        ?string $path,
        string $disk = 'public'
    ): ?string {
        if (! $path) {
            return null;
        }

        try {
            return Storage::disk($disk)->url(
                $this->sanitizeStoredPath($path)
            );
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Generate a temporary private URL where supported, such as S3.
     */
    protected function getTemporaryFileUrl(
        string $path,
        string $disk = 's3',
        int $expiryMinutes = 10
    ): string {
        return Storage::disk($disk)->temporaryUrl(
            $this->sanitizeStoredPath($path),
            now()->addMinutes($expiryMinutes)
        );
    }

    protected function generateUniqueFilename(
        ?string $extension = null
    ): string {
        $filename = now()->format('Ymd_His')
            .'_'
            .Str::uuid()->toString();

        return $extension
            ? "{$filename}.{$extension}"
            : $filename;
    }

    protected function sanitizeDirectory(string $directory): string
    {
        $directory = str_replace('\\', '/', trim($directory));

        $segments = array_filter(
            explode('/', $directory),
            static fn (string $segment): bool => $segment !== ''
                && $segment !== '.'
                && $segment !== '..'
        );

        $directory = implode('/', $segments);

        if ($directory === '') {
            throw new InvalidArgumentException(
                'A valid upload directory is required.'
            );
        }

        return $directory;
    }

    protected function sanitizeFilename(
        string $filename,
        ?string $extension = null
    ): string {
        $filename = pathinfo($filename, PATHINFO_FILENAME);

        $filename = Str::slug($filename);

        if ($filename === '') {
            $filename = Str::uuid()->toString();
        }

        return $extension
            ? "{$filename}.{$extension}"
            : $filename;
    }

    protected function sanitizeStoredPath(string $path): string
    {
        $path = str_replace('\\', '/', trim($path));

        if (
            str_contains($path, '../')
            || str_starts_with($path, '/')
        ) {
            throw new InvalidArgumentException('Invalid file path.');
        }

        return ltrim($path, '/');
    }

    protected function validateUploadedFile(UploadedFile $file): void
    {
        if (! $file->isValid()) {
            throw new InvalidArgumentException(
                'The uploaded file is invalid.'
            );
        }
    }
}
