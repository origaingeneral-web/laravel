<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Services\TwoFactorAuthenticationProvider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;

class TwoFactorLoginRequest extends FormRequest
{
    protected ?User $challengedUser = null;

    protected ?bool $remember = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string'],
            'recovery_code' => ['nullable', 'string'],
        ];
    }

    /**
     * Determine if the request has a valid two factor code.
     */
    public function hasValidCode(): bool
    {
        return $this->code && tap(app(TwoFactorAuthenticationProvider::class)->verify(
            Crypt::decrypt($this->challengedUser()->two_factor_secret),
            $this->code
        ), function (bool $result): void {
            if ($result) {
                $this->session()->forget('login.id');
            }
        });
    }

    /**
     * Get the valid recovery code if one exists on the request.
     */
    public function validRecoveryCode(): ?string
    {
        if (! $this->recovery_code) {
            return null;
        }

        return tap(collect($this->challengedUser()->recoveryCodes())->first(function (string $code) {
            return hash_equals($code, $this->recovery_code) ? $code : null;
        }), function (?string $code): void {
            if ($code) {
                $this->session()->forget('login.id');
            }
        });
    }

    /**
     * Determine if there is a challenged user in the current session.
     */
    public function hasChallengedUser(): bool
    {
        if ($this->challengedUser) {
            return true;
        }

        return $this->session()->has('login.id')
            && User::query()->find($this->session()->get('login.id'));
    }

    /**
     * Get the user that is attempting the two factor challenge.
     */
    public function challengedUser(): User
    {
        if ($this->challengedUser) {
            return $this->challengedUser;
        }

        if (! $this->session()->has('login.id')
            || ! $user = User::query()->find($this->session()->get('login.id'))) {
            [$key, $message] = $this->filled('recovery_code')
                ? ['recovery_code', __('The provided two factor recovery code was invalid.')]
                : ['code', __('The provided two factor authentication code was invalid.')];

            if ($this->wantsJson()) {
                throw ValidationException::withMessages([
                    $key => [$message],
                ]);
            }

            throw new HttpResponseException(
                redirect()->route('two-factor.login')->withErrors([$key => $message])
            );
        }

        return $this->challengedUser = $user;
    }

    /**
     * Determine if the user wanted to be remembered after login.
     */
    public function remember(): bool
    {
        if (is_null($this->remember)) {
            $this->remember = $this->session()->pull('login.remember', false);
        }

        return $this->remember;
    }
}
