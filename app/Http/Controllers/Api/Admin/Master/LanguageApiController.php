<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Language;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LanguageApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $languages = Language::query()->orderBy('language')->get();

            return $this->success($languages);
        }, 'Failed to fetch languages.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'language' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:5'],
            ]);

            $language = Language::query()->create($validated);

            return $this->success($language, 'Language created successfully.', 201);
        }, 'Failed to create language.', 'masters');
    }

    public function update(Request $request, Language $language): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $language) {
            $validated = $request->validate([
                'language' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:5'],
            ]);

            $language->update($validated);

            return $this->success($language, 'Language updated successfully.');
        }, 'Failed to update language.', 'masters');
    }

    public function destroy(Language $language): JsonResponse
    {
        return $this->tryCatch(function () use ($language) {
            $language->delete();

            return $this->success(null, 'Language deleted successfully.');
        }, 'Failed to delete language.', 'masters');
    }
}
