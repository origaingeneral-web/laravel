<?php

namespace App\Concerns;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @mixin FormRequest
 */
trait InteractsWithTwoFactorState
{
    /**
     * Ensure the two-factor authentication state is valid and handle transitions.
     */
    public function ensureStateIsValid(): void
    {
        $currentTime = time();

        if (! $this->user()->hasEnabledTwoFactorAuthentication()) {
            $this->session()->put('two_factor_empty_at', $currentTime);
        }

        if ($this->hasJustBegunConfirmingTwoFactorAuthentication()) {
            $this->session()->put('two_factor_confirming_at', $currentTime);
        }

        if ($this->neverFinishedConfirmingTwoFactorAuthentication($currentTime)) {
            $this->user()->disableTwoFactorAuthentication();

            $this->session()->put('two_factor_empty_at', $currentTime);
            $this->session()->remove('two_factor_confirming_at');
        }
    }

    /**
     * Determine if two-factor authentication is just now being confirmed.
     */
    protected function hasJustBegunConfirmingTwoFactorAuthentication(): bool
    {
        return ! is_null($this->user()->two_factor_secret)
            && is_null($this->user()->two_factor_confirmed_at)
            && $this->session()->has('two_factor_empty_at')
            && is_null($this->session()->get('two_factor_confirming_at'));
    }

    /**
     * Determine if two-factor authentication was never totally confirmed.
     */
    protected function neverFinishedConfirmingTwoFactorAuthentication(int $currentTime): bool
    {
        return ! $this->session()->hasOldInput('code')
            && is_null($this->user()->two_factor_confirmed_at)
            && $this->session()->get('two_factor_confirming_at', 0) != $currentTime;
    }
}
