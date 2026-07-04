<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * RegisterRequest — Validation rules for user registration.
 *
 * SRP: This class has ONE reason to change — the registration
 * validation rules evolve. Zero business logic, zero HTTP handling.
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'role' => ['required', Rule::enum(UserRole::class)->only([
                UserRole::CLINIC,
                UserRole::HEALTHCARE_PROFESSIONAL,
            ])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role.Illuminate\Validation\Rules\Enum' => 'Role must be either clinic or healthcare_professional.',
        ];
    }
}
