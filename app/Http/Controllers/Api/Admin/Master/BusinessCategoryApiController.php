<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\BusinessCategory;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessCategoryApiController extends Controller
{
    use TryCatchHandler;

    /**
     * Display a listing of the business categories.
     */
    public function index(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $search = trim((string) $request->string('search'));

            $categories = BusinessCategory::query()
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where('category', 'like', "%{$search}%");
                })
                ->orderBy('category')
                ->get();

            return $this->success($categories);
        }, 'Failed to fetch business categories.', 'masters');
    }

    /**
     * Store a newly created business category in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'category' => ['required', 'string', 'max:255', 'unique:business_categories,category'],
            ]);

            $businessCategory = BusinessCategory::query()->create($validated);

            return $this->success($businessCategory, 'Business category created successfully.', 201);
        }, 'Failed to create business category.', 'masters');
    }

    /**
     * Update the specified business category in storage.
     */
    public function update(Request $request, BusinessCategory $businessCategory): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $businessCategory) {
            $validated = $request->validate([
                'category' => ['required', 'string', 'max:255', 'unique:business_categories,category,'.$businessCategory->id],
            ]);

            $businessCategory->update($validated);

            return $this->success($businessCategory, 'Business category updated successfully.');
        }, 'Failed to update business category.', 'masters');
    }

    /**
     * Remove the specified business category from storage.
     */
    public function destroy(BusinessCategory $businessCategory): JsonResponse
    {
        return $this->tryCatch(function () use ($businessCategory) {
            $businessCategory->delete();

            return $this->success(null, 'Business category deleted successfully.');
        }, 'Failed to delete business category.', 'masters');
    }
}
