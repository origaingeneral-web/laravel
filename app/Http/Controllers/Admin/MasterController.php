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
     * Bulk import master records.
     */
    public function import(Request $request, string $entity): RedirectResponse
    {
        $this->assertValidEntity($entity);

        $request->validate([
            'rows' => ['required', 'array', 'min:1'],
        ]);

        $rows = $request->input('rows');
        $insertData = [];

        $countries = DB::table('countries')->pluck('id', 'country')->toArray();
        $states = DB::table('states')->pluck('id', 'state')->toArray();
        $cities = DB::table('cities')->pluck('id', 'city')->toArray();

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            $record = null;

            switch ($entity) {
                case 'states':
                    $countryId = $row['country_id'] ?? null;
                    if (! $countryId && ! empty($row['country'])) {
                        $countryName = trim($row['country']);
                        $countryId = $countries[$countryName] ?? null;
                    }
                    if ($countryId && ! empty($row['state'])) {
                        $record = [
                            'country_id' => (int) $countryId,
                            'state' => trim($row['state']),
                            'code' => ! empty($row['code']) ? trim($row['code']) : null,
                        ];
                    }
                    break;

                case 'cities':
                    $stateId = $row['state_id'] ?? null;
                    if (! $stateId && ! empty($row['state'])) {
                        $stateName = trim($row['state']);
                        $stateId = $states[$stateName] ?? null;
                    }
                    if ($stateId && ! empty($row['city'])) {
                        $record = [
                            'state_id' => (int) $stateId,
                            'city' => trim($row['city']),
                            'is_top_city' => filter_var($row['is_top_city'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        ];
                    }
                    break;

                case 'areas':
                    $cityId = $row['city_id'] ?? null;
                    if (! $cityId && ! empty($row['city'])) {
                        $cityName = trim($row['city']);
                        $cityId = $cities[$cityName] ?? null;
                    }
                    if ($cityId && ! empty($row['area'])) {
                        $record = [
                            'city_id' => (int) $cityId,
                            'area' => trim($row['area']),
                            'zipcode' => ! empty($row['zipcode']) ? trim($row['zipcode']) : null,
                        ];
                    }
                    break;

                case 'languages':
                    if (! empty($row['language'])) {
                        $record = [
                            'language' => trim($row['language']),
                            'code' => ! empty($row['code']) ? trim($row['code']) : null,
                        ];
                    }
                    break;

                case 'countries':
                    if (! empty($row['country'])) {
                        $record = [
                            'country' => trim($row['country']),
                            'iso3' => ! empty($row['iso3']) ? trim($row['iso3']) : null,
                            'phone_code' => ! empty($row['phone_code']) ? trim($row['phone_code']) : null,
                        ];
                    }
                    break;

                case 'plans':
                    if (! empty($row['plan_name'])) {
                        $record = [
                            'plan_name' => trim($row['plan_name']),
                            'price' => (float) ($row['price'] ?? 0),
                            'duration_in_days' => (int) ($row['duration_in_days'] ?? 30),
                            'staff_limit' => (int) ($row['staff_limit'] ?? 10),
                            'tracking_duration' => (int) ($row['tracking_duration'] ?? 90),
                            'remarks' => ! empty($row['remarks']) ? trim($row['remarks']) : null,
                        ];
                    }
                    break;

                case 'business-categories':
                    if (! empty($row['category'])) {
                        $record = [
                            'category' => trim($row['category']),
                        ];
                    }
                    break;
            }

            if ($record !== null) {
                $insertData[] = $record;
            }
        }

        if (! empty($insertData)) {
            DB::table($this->tableFor($entity))->insert($insertData);
        }

        return redirect()->route('admin.master.index', ['entity' => $entity])
            ->with('success', count($insertData).' '.$this->entityTitle($entity).' record(s) imported successfully.');
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
                ->select(['states.id', 'states.state', 'states.code', 'states.country_id', 'countries.country as country'])
                ->join('countries', 'states.country_id', '=', 'countries.id')
                ->orderBy('states.state')
                ->get(),
            'cities' => DB::table('cities')
                ->select(['cities.id', 'cities.city', 'cities.is_top_city', 'cities.state_id', 'states.state as state'])
                ->join('states', 'cities.state_id', '=', 'states.id')
                ->orderBy('cities.city')
                ->get(),
            'areas' => DB::table('areas')
                ->select(['areas.id', 'areas.area', 'areas.zipcode', 'areas.city_id', 'cities.city as city'])
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
