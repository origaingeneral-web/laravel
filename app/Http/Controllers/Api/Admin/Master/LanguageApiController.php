<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Language;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LanguageApiController extends Controller
{
    public function index(): JsonResponse
    {
        $languages = Language::query()->orderBy('language')->get();

        return response()->json([
            'data' => $languages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:5'],
        ]);

        $language = Language::query()->create($validated);

        return response()->json([
            'message' => 'Language created successfully.',
            'data' => $language,
        ], 201);
    }

    public function update(Request $request, Language $language): JsonResponse
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:5'],
        ]);

        $language->update($validated);

        return response()->json([
            'message' => 'Language updated successfully.',
            'data' => $language,
        ]);
    }

    public function destroy(Language $language): JsonResponse
    {
        $language->delete();

        return response()->json([
            'message' => 'Language deleted successfully.',
        ]);
    }
}
