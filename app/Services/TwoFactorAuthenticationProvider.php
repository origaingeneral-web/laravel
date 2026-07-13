<?php

namespace App\Services;

use Illuminate\Contracts\Cache\Repository;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthenticationProvider
{
    public function __construct(
        protected Google2FA $engine,
        protected ?Repository $cache = null,
    ) {}

    /**
     * Generate a new secret key.
     */
    public function generateSecretKey(int $secretLength = 16): string
    {
        return $this->engine->generateSecretKey($secretLength);
    }

    /**
     * Get the two factor authentication QR code URL.
     */
    public function qrCodeUrl(string $companyName, string $companyEmail, string $secret): string
    {
        return $this->engine->getQRCodeUrl($companyName, $companyEmail, $secret);
    }

    /**
     * Verify the given code.
     */
    public function verify(string $secret, string $code): bool
    {
        $timestamp = $this->engine->verifyKeyNewer(
            $secret,
            $code,
            $this->cache?->get($key = 'auth.2fa_codes.'.md5($code))
        );

        if ($timestamp !== false) {
            if ($timestamp === true) {
                $timestamp = $this->engine->getTimestamp();
            }

            $this->cache?->put($key, $timestamp, ($this->engine->getWindow() ?: 1) * 60);

            return true;
        }

        return false;
    }
}
