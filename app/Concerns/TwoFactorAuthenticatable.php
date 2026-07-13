<?php

namespace App\Concerns;

use App\Services\TwoFactorAuthenticationProvider;
use App\Support\RecoveryCode;
use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Crypt;

trait TwoFactorAuthenticatable
{
    /**
     * Determine if two-factor authentication has been enabled and confirmed.
     */
    public function hasEnabledTwoFactorAuthentication(): bool
    {
        return ! is_null($this->two_factor_secret)
            && ! is_null($this->two_factor_confirmed_at);
    }

    /**
     * Get the user's two factor authentication recovery codes.
     *
     * @return array<int, string>
     */
    public function recoveryCodes(): array
    {
        return json_decode(Crypt::decrypt($this->two_factor_recovery_codes), true);
    }

    /**
     * Replace the given recovery code with a new one.
     */
    public function replaceRecoveryCode(string $code): void
    {
        $this->forceFill([
            'two_factor_recovery_codes' => Crypt::encrypt(str_replace(
                $code,
                RecoveryCode::generate(),
                Crypt::decrypt($this->two_factor_recovery_codes)
            )),
        ])->save();
    }

    /**
     * Enable two-factor authentication for the user.
     */
    public function enableTwoFactorAuthentication(bool $force = false): void
    {
        if (empty($this->two_factor_secret) || $force) {
            $this->forceFill([
                'two_factor_secret' => Crypt::encrypt(app(TwoFactorAuthenticationProvider::class)->generateSecretKey()),
                'two_factor_recovery_codes' => Crypt::encrypt(json_encode(Collection::times(8, fn () => RecoveryCode::generate())->all())),
                'two_factor_confirmed_at' => null,
            ])->save();
        }
    }

    /**
     * Confirm two-factor authentication for the user.
     */
    public function confirmTwoFactorAuthentication(): void
    {
        $this->forceFill([
            'two_factor_confirmed_at' => now(),
        ])->save();
    }

    /**
     * Disable two-factor authentication for the user.
     */
    public function disableTwoFactorAuthentication(): void
    {
        if (! is_null($this->two_factor_secret)
            || ! is_null($this->two_factor_recovery_codes)
            || ! is_null($this->two_factor_confirmed_at)) {
            $this->forceFill([
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ])->save();
        }
    }

    /**
     * Generate a fresh set of two factor authentication recovery codes.
     */
    public function generateNewRecoveryCodes(): void
    {
        $this->forceFill([
            'two_factor_recovery_codes' => Crypt::encrypt(json_encode(Collection::times(8, fn () => RecoveryCode::generate())->all())),
        ])->save();
    }

    /**
     * Get the QR code SVG of the user's two factor authentication QR code URL.
     */
    public function twoFactorQrCodeSvg(): string
    {
        $svg = (new Writer(
            new ImageRenderer(
                new RendererStyle(192, 0, null, null, Fill::uniformColor(new Rgb(255, 255, 255), new Rgb(45, 55, 72))),
                new SvgImageBackEnd
            )
        ))->writeString($this->twoFactorQrCodeUrl());

        return trim(substr($svg, strpos($svg, "\n") + 1));
    }

    /**
     * Get the two factor authentication QR code URL.
     */
    public function twoFactorQrCodeUrl(): string
    {
        return app(TwoFactorAuthenticationProvider::class)->qrCodeUrl(
            config('app.name'),
            $this->email,
            Crypt::decrypt($this->two_factor_secret)
        );
    }
}
