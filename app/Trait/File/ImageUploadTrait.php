<?php

declare(strict_types=1);

namespace App\Trait\File;

use Illuminate\Http\UploadedFile;
use InvalidArgumentException;

trait ImageUploadTrait
{
    use FileUploadTrait;

    /**
     * @param  array<int, string>  $allowedMimeTypes
     */
    protected function uploadImage(
        UploadedFile $image,
        string $directory,
        string $disk = 'public',
        ?string $filename = null,
        string $visibility = 'public',
        int $maxSizeKilobytes = 5120,
        array $allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ],
        ?int $minimumWidth = null,
        ?int $minimumHeight = null,
        ?int $maximumWidth = null,
        ?int $maximumHeight = null
    ): array {
        $this->validateImage(
            image: $image,
            maxSizeKilobytes: $maxSizeKilobytes,
            allowedMimeTypes: $allowedMimeTypes,
            minimumWidth: $minimumWidth,
            minimumHeight: $minimumHeight,
            maximumWidth: $maximumWidth,
            maximumHeight: $maximumHeight
        );

        $metadata = $this->uploadFile(
            file: $image,
            directory: $directory,
            disk: $disk,
            filename: $filename,
            visibility: $visibility
        );

        [$width, $height] = $this->getImageDimensions($image);

        return [
            ...$metadata,
            'width' => $width,
            'height' => $height,
        ];
    }

    protected function replaceImage(
        UploadedFile $newImage,
        ?string $oldPath,
        string $directory,
        string $disk = 'public',
        ?string $filename = null,
        string $visibility = 'public',
        int $maxSizeKilobytes = 5120
    ): array {
        $this->validateImage(
            image: $newImage,
            maxSizeKilobytes: $maxSizeKilobytes
        );

        $uploadedImage = $this->uploadImage(
            image: $newImage,
            directory: $directory,
            disk: $disk,
            filename: $filename,
            visibility: $visibility,
            maxSizeKilobytes: $maxSizeKilobytes
        );

        if ($oldPath && $oldPath !== $uploadedImage['path']) {
            $this->deleteFile($oldPath, $disk);
        }

        return $uploadedImage;
    }

    protected function uploadAvatar(
        UploadedFile $image,
        string|int $identifier,
        string $directory = 'avatars',
        string $disk = 'public'
    ): array {
        return $this->uploadImage(
            image: $image,
            directory: $directory,
            disk: $disk,
            filename: "avatar-{$identifier}",
            visibility: 'public',
            maxSizeKilobytes: 2048,
            allowedMimeTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
            ],
            minimumWidth: 150,
            minimumHeight: 150,
            maximumWidth: 5000,
            maximumHeight: 5000
        );
    }

    /**
     * @param  array<int, string>  $allowedMimeTypes
     */
    protected function validateImage(
        UploadedFile $image,
        int $maxSizeKilobytes = 5120,
        array $allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ],
        ?int $minimumWidth = null,
        ?int $minimumHeight = null,
        ?int $maximumWidth = null,
        ?int $maximumHeight = null
    ): void {
        $this->validateUploadedFile($image);

        $mimeType = $image->getMimeType();

        if (! in_array($mimeType, $allowedMimeTypes, true)) {
            throw new InvalidArgumentException(
                "Unsupported image type: {$mimeType}"
            );
        }

        if ($image->getSize() > ($maxSizeKilobytes * 1024)) {
            throw new InvalidArgumentException(
                "Image size must not exceed {$maxSizeKilobytes} KB."
            );
        }

        [$width, $height] = $this->getImageDimensions($image);

        if ($minimumWidth !== null && $width < $minimumWidth) {
            throw new InvalidArgumentException(
                "Image width must be at least {$minimumWidth}px."
            );
        }

        if ($minimumHeight !== null && $height < $minimumHeight) {
            throw new InvalidArgumentException(
                "Image height must be at least {$minimumHeight}px."
            );
        }

        if ($maximumWidth !== null && $width > $maximumWidth) {
            throw new InvalidArgumentException(
                "Image width must not exceed {$maximumWidth}px."
            );
        }

        if ($maximumHeight !== null && $height > $maximumHeight) {
            throw new InvalidArgumentException(
                "Image height must not exceed {$maximumHeight}px."
            );
        }
    }

    /**
     * @return array{0: int, 1: int}
     */
    protected function getImageDimensions(
        UploadedFile $image
    ): array {
        $dimensions = @getimagesize($image->getRealPath());

        if ($dimensions === false) {
            throw new InvalidArgumentException(
                'Unable to determine image dimensions.'
            );
        }

        return [
            (int) $dimensions[0],
            (int) $dimensions[1],
        ];
    }
}
