<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MasterController extends Controller
{
    /**
     * Show a master data list page.
     */
    public function index(Request $request, string $entity): Response
    {
        $this->assertValidEntity($entity);

        $items = $this->fetchRows($entity);

        return Inertia::render('admin/masters/index', [
            'entity' => $entity,
            'items' => $items,
            'lookups' => [
                'countries' => DB::table('countries')
                    ->select(['id', 'country'])
                    ->orderBy('country')
                    ->get(),
                'states' => DB::table('states')
                    ->select(['id', 'state', 'country_id'])
                    ->orderBy('state')
                    ->get(),
                'cities' => DB::table('cities')
                    ->select(['id', 'city', 'state_id'])
                    ->orderBy('city')
                    ->get(),
            ],
        ]);
    }

    /**
     * Store a new master record.
     */
    public function store(Request $request, string $entity): RedirectResponse
    {
        $this->assertValidEntity($entity);

        $data = $this->validateData($request, $entity);

        if ($entity === 'cities') {
            $data['is_top_city'] = $request->boolean('is_top_city');
        }

        DB::table($this->tableFor($entity))->insert($data);

        return redirect()->route('admin.master.index', ['entity' => $entity])
            ->with('success', $this->entityTitle($entity).' created successfully.');
    }

    /**
     * Update an existing master record.
     */
    public function update(Request $request, string $entity, int $id): RedirectResponse
    {
        $this->assertValidEntity($entity);

        $data = $this->validateData($request, $entity);

        if ($entity === 'cities') {
            $data['is_top_city'] = $request->boolean('is_top_city');
        }

        DB::table($this->tableFor($entity))
            ->where('id', $id)
            ->update($data);

        return redirect()->route('admin.master.index', ['entity' => $entity])
            ->with('success', $this->entityTitle($entity).' updated successfully.');
    }

    /**
     * Delete a master record.
     */
    public function destroy(string $entity, int $id): RedirectResponse
    {
        $this->assertValidEntity($entity);

        DB::table($this->tableFor($entity))
            ->where('id', $id)
            ->delete();

        return redirect()->route('admin.master.index', ['entity' => $entity])
            ->with('success', $this->entityTitle($entity).' deleted successfully.');
    }

    private function assertValidEntity(string $entity): void
    {
        $validEntities = [
            'business-categories',
            'languages',
            'countries',
            'states',
            'cities',
            'areas',
            'plans',
        ];

        if (! in_array($entity, $validEntities, true)) {
            abort(404);
        }
    }

    private function tableFor(string $entity): string
    {
        return match ($entity) {
            'business-categories' => 'business_categories',
            'languages' => 'languages',
            'countries' => 'countries',
            'states' => 'states',
            'cities' => 'cities',
            'areas' => 'areas',
            'plans' => 'plans',
            default => throw new \InvalidArgumentException('Invalid master entity.'),
        };
    }

    private function fetchRows(string $entity)
    {
        return match ($entity) {
            'business-categories' => DB::table('business_categories')
                ->select(['id', 'category'])
                ->orderBy('category')
                ->get(),
            'languages' => DB::table('languages')
                ->select(['id', 'language', 'code'])
                ->orderBy('language')
                ->get(),
            'countries' => DB::table('countries')
                ->select(['id', 'country', 'iso3', 'phone_code'])
                ->orderBy('country')
                ->get(),
            'states' => DB::table('states')
                ->select(['states.id', 'states.state', 'states.code', 'countries.country as country'])
                ->join('countries', 'states.country_id', '=', 'countries.id')
                ->orderBy('states.state')
                ->get(),
            'cities' => DB::table('cities')
                ->select(['cities.id', 'cities.city', 'cities.is_top_city', 'states.state as state'])
                ->join('states', 'cities.state_id', '=', 'states.id')
                ->orderBy('cities.city')
                ->get(),
            'areas' => DB::table('areas')
                ->select(['areas.id', 'areas.area', 'areas.zipcode', 'cities.city as city'])
                ->join('cities', 'areas.city_id', '=', 'cities.id')
                ->orderBy('areas.area')
                ->get(),
            'plans' => DB::table('plans')
                ->select(['id', 'plan_name', 'price', 'duration_in_days', 'staff_limit', 'tracking_duration', 'remarks'])
                ->orderBy('plan_name')
                ->get(),
            default => collect(),
        };
    }

    private function validateData(Request $request, string $entity): array
    {
        $rules = match ($entity) {
            'business-categories' => [
                'category' => ['required', 'string', 'max:255'],
            ],
            'languages' => [
                'language' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:5'],
            ],
            'countries' => [
                'country' => ['required', 'string', 'max:255'],
                'iso3' => ['nullable', 'string', 'max:3'],
                'phone_code' => ['nullable', 'string', 'max:32'],
            ],
            'states' => [
                'country_id' => ['required', 'integer', 'exists:countries,id'],
                'state' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:10'],
            ],
            'cities' => [
                'state_id' => ['required', 'integer', 'exists:states,id'],
                'city' => ['required', 'string', 'max:255'],
                'is_top_city' => ['sometimes', 'boolean'],
            ],
            'areas' => [
                'city_id' => ['required', 'integer', 'exists:cities,id'],
                'area' => ['required', 'string', 'max:255'],
                'zipcode' => ['nullable', 'string', 'max:50'],
            ],
            'plans' => [
                'plan_name' => ['required', 'string', 'max:255'],
                'price' => ['required', 'numeric', 'min:0'],
                'duration_in_days' => ['required', 'integer', 'min:0'],
                'staff_limit' => ['required', 'integer', 'min:0'],
                'tracking_duration' => ['required', 'integer', 'min:0'],
                'remarks' => ['nullable', 'string', 'max:1024'],
            ],
            default => [],
        };

        return $request->validate($rules);
    }

    private function entityTitle(string $entity): string
    {
        return match ($entity) {
            'business-categories' => 'Business category',
            'languages' => 'Language',
            'countries' => 'Country',
            'states' => 'State',
            'cities' => 'City',
            'areas' => 'Area',
            'plans' => 'Plan',
            default => 'Record',
        };
    }
}
