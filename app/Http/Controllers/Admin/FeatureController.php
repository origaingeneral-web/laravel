<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Feature;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $features = Feature::query()
            ->with('product:id,name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/features/index', [
            'features' => $features,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/features/create', [
            'products' => Product::query()->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:features',
            'description' => 'nullable|string',
            'is_addon' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $data['code'] = Str::slug($data['code']);

        Feature::create($data);

        return redirect()->route('admin.features.index')->with('success', 'Feature created successfully.');
    }

    public function edit(Feature $feature): Response
    {
        return Inertia::render('admin/features/edit', [
            'feature' => $feature,
            'products' => Product::query()->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Feature $feature): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:features,code,'.$feature->id,
            'description' => 'nullable|string',
            'is_addon' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $data['code'] = Str::slug($data['code']);

        $feature->update($data);

        return redirect()->route('admin.features.index')->with('success', 'Feature updated successfully.');
    }

    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return redirect()->route('admin.features.index')->with('success', 'Feature deleted successfully.');
    }
}
