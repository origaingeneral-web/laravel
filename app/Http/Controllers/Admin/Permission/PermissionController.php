<?php

namespace App\Http\Controllers\Admin\Permission;

use App\Http\Controllers\Controller;
use App\Models\Admin\Feature\Feature;
use App\Models\Auth\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $featureId = $request->input('feature_id');
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $permissions = Permission::query()
            ->with(['feature.product:id,name'])
            ->when($featureId, function ($query) use ($featureId): void {
                $query->where('feature_id', $featureId);
            })
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('feature', function ($q) use ($search): void {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        $features = Feature::query()
            ->with('product:id,name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'product_id']);

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'features' => $features,
            'filters' => [
                'search' => $search,
                'feature_id' => $featureId,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $features = Feature::query()
            ->with('product:id,name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'product_id']);

        return Inertia::render('admin/permissions/create', [
            'features' => $features,
            'selected_feature_id' => $request->query('feature_id', ''),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'feature_id' => 'required|exists:features,id',
            'name' => 'required|string|max:255',
            'guards' => 'nullable|array',
            'guards.*' => 'string|in:web,super_admin',
        ]);

        $feature = Feature::findOrFail($data['feature_id']);

        // Auto-generate clean permission name (e.g. "Job Opening" or "job_opening" -> "recruitment.job_opening")
        $raw = trim($data['name']);
        $slug = Str::slug(str_replace('.', ' ', $raw), '_');
        $permissionName = str_contains($raw, '.') ? $raw : "{$feature->code}.{$slug}";

        $guards = ! empty($data['guards']) ? $data['guards'] : ['web', 'super_admin'];

        foreach ($guards as $guard) {
            $permission = Permission::firstOrCreate(
                ['name' => $permissionName, 'guard_name' => $guard],
                ['feature_id' => $feature->id]
            );

            if ($permission->feature_id !== $feature->id) {
                $permission->update(['feature_id' => $feature->id]);
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->route('admin.permissions.index')->with('success', 'Permission created successfully.');
    }

    public function edit(Permission $permission): Response
    {
        $permission->load('feature.product');

        $features = Feature::query()
            ->with('product:id,name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'product_id']);

        return Inertia::render('admin/permissions/edit', [
            'permission' => $permission,
            'features' => $features,
        ]);
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $data = $request->validate([
            'feature_id' => 'required|exists:features,id',
            'name' => 'required|string|max:255',
        ]);

        $feature = Feature::findOrFail($data['feature_id']);

        $raw = trim($data['name']);
        $slug = Str::slug(str_replace('.', ' ', $raw), '_');
        $permissionName = str_contains($raw, '.') ? $raw : "{$feature->code}.{$slug}";

        $permission->update([
            'name' => $permissionName,
            'feature_id' => $feature->id,
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->route('admin.permissions.index')->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->route('admin.permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
