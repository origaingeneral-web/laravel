<?php

namespace App\Http\Controllers\Admin\Feature;

use App\Http\Controllers\Controller;
use App\Models\Admin\Feature\Feature;
use App\Models\Product\Product;
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
            ->with(['product:id,name', 'permissions:id,feature_id,name,guard_name'])
            ->withCount('permissions')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/features/index', [
            'features' => $features,
            'products' => Product::query()->where('is_active', true)->get(['id', 'name']),
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
            'description' => 'nullable|string',
            'is_addon' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $isAddon = (bool) ($data['is_addon'] ?? false);
        $data['price'] = $isAddon ? (float) ($data['price'] ?? 0.00) : 0.00;

        // Auto-generate unique code slug from name
        $baseSlug = Str::slug($data['name'], '_');
        if ($baseSlug === '') {
            $baseSlug = 'feature';
        }
        $code = $baseSlug;
        $counter = 1;
        while (Feature::where('code', $code)->where('product_id', $data['product_id'])->exists()) {
            $code = "{$baseSlug}_{$counter}";
            $counter++;
        }
        $data['code'] = $code;

        Feature::create($data);

        return redirect()->route('admin.features.index')->with('success', 'Feature created successfully.');
    }

    public function edit(Feature $feature): Response
    {
        $feature->load(['permissions:id,feature_id,name,guard_name']);

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
            'description' => 'nullable|string',
            'is_addon' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        if (! isset($data['sort_order'])) {
            unset($data['sort_order']);
        }
        $isAddon = (bool) ($data['is_addon'] ?? false);
        $data['price'] = $isAddon ? (float) ($data['price'] ?? 0.00) : 0.00;

        // If name changed, generate clean slug
        if ($feature->name !== $data['name']) {
            $baseSlug = Str::slug($data['name'], '_');
            if ($baseSlug === '') {
                $baseSlug = 'feature';
            }
            $code = $baseSlug;
            $counter = 1;
            while (Feature::where('code', $code)->where('product_id', $data['product_id'])->where('id', '!=', $feature->id)->exists()) {
                $code = "{$baseSlug}_{$counter}";
                $counter++;
            }
            $data['code'] = $code;
        }

        $feature->update($data);

        return redirect()->route('admin.features.index')->with('success', 'Feature updated successfully.');
    }

    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return redirect()->route('admin.features.index')->with('success', 'Feature deleted successfully.');
    }
}
