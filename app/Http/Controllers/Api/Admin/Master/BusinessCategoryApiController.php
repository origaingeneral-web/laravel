<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\BusinessCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessCategoryApiController extends Controller
{
    /**
     * Display a listing of the business categories.
     */
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));

        $categories = BusinessCategory::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('category', 'like', "%{$search}%");
            })
            ->orderBy('category')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Store a newly created business category in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:255', 'unique:business_categories,category'],
        ]);

        $businessCategory = BusinessCategory::query()->create($validated);

        return response()->json([
            'message' => 'Business category created successfully.',
            'data' => $businessCategory,
        ], 201);
    }

    /**
     * Update the specified business category in storage.
     */
    public function update(Request $request, BusinessCategory $businessCategory): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:255', 'unique:business_categories,category,'.$businessCategory->id],
        ]);

        $businessCategory->update($validated);

        return response()->json([
            'message' => 'Business category updated successfully.',
            'data' => $businessCategory,
        ]);
    }

    /**
     * Remove the specified business category from storage.
     */
    public function destroy(BusinessCategory $businessCategory): JsonResponse
    {
        $businessCategory->delete();

        return response()->json([
            'message' => 'Business category deleted successfully.',
        ]);
    }
}
