<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        [, $plainTextToken] = $this->createToken($user, 'register');

        return response()->json([
            'message' => 'Register successful.',
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email'))->first();

        if (! $user || ! Hash::check($request->string('password'), $user->password)) {
            return response()->json([
                'message' => 'Email or password is invalid.',
            ], 422);
        }

        [, $plainTextToken] = $this->createToken(
            $user,
            $request->string('device_name')->toString() ?: 'api-client',
        );

        return response()->json([
            'message' => 'Login successful.',
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = request()->attributes->get('auth_user');

        return response()->json([
            'user' => $user,
        ]);
    }

    public function logout(): JsonResponse
    {
        /** @var ApiToken $token */
        $token = request()->attributes->get('auth_token');

        $token->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    /**
     * @return array{0: ApiToken, 1: string}
     */
    private function createToken(User $user, string $tokenName): array
    {
        $plainTextToken = Str::random(64);

        $token = $user->apiTokens()->create([
            'name' => $tokenName,
            'token' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addDays(30),
        ]);

        return [$token, $plainTextToken];
    }
}
