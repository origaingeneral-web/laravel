<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\BusinessCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessCategoryController extends Controller
{
    /**
     * Display a listing of the business categories.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $categories = BusinessCategory::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('category', 'like', "%{$search}%");
            })
            ->orderBy('category')
            ->get();

        return Inertia::render('admin/masters/business-categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created business category in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:255', 'unique:business_categories,category'],
        ]);

        BusinessCategory::query()->create($validated);

        return redirect()->route('admin.master.business-categories.index')
            ->with('success', 'Business category created successfully.');
    }

    /**
     * Update the specified business category in storage.
     */
    public function update(Request $request, BusinessCategory $businessCategory): RedirectResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:255', 'unique:business_categories,category,'.$businessCategory->id],
        ]);

        $businessCategory->update($validated);

        return redirect()->route('admin.master.business-categories.index')
            ->with('success', 'Business category updated successfully.');
    }

    /**
     * Remove the specified business category from storage.
     */
    public function destroy(BusinessCategory $businessCategory): RedirectResponse
    {
        $businessCategory->delete();

        return redirect()->route('admin.master.business-categories.index')
            ->with('success', 'Business category deleted successfully.');
    }
}
