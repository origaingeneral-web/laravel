<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Area;
use App\Models\Admin\Master\City;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AreaApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $areas = Area::query()
                ->join('cities', 'areas.city_id', '=', 'cities.id')
                ->select(['areas.*', 'cities.city'])
                ->orderBy('areas.area')
                ->get();

            return $this->success($areas);
        }, 'Failed to fetch areas.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'city_id' => ['required', 'integer', 'exists:cities,id'],
                'area' => ['required', 'string', 'max:255'],
                'zipcode' => ['nullable', 'string', 'max:50'],
            ]);

            $area = Area::query()->create($validated);

            return $this->success($area, 'Area created successfully.', 201);
        }, 'Failed to create area.', 'masters');
    }

    public function update(Request $request, Area $area): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $area) {
            $validated = $request->validate([
                'city_id' => ['required', 'integer', 'exists:cities,id'],
                'area' => ['required', 'string', 'max:255'],
                'zipcode' => ['nullable', 'string', 'max:50'],
            ]);

            $area->update($validated);

            return $this->success($area, 'Area updated successfully.');
        }, 'Failed to update area.', 'masters');
    }

    public function destroy(Area $area): JsonResponse
    {
        return $this->tryCatch(function () use ($area) {
            $area->delete();

            return $this->success(null, 'Area deleted successfully.');
        }, 'Failed to delete area.', 'masters');
    }

    public function import(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $request->validate([
                'rows' => ['required', 'array'],
            ]);

            foreach ($request->input('rows', []) as $row) {
                $cityId = $row['city_id'] ?? null;
                if (! $cityId && ! empty($row['city'])) {
                    $cityId = City::where('city', $row['city'])->value('id');
                }

                if ($cityId && ! empty($row['area'])) {
                    Area::updateOrCreate(
                        ['area' => $row['area'], 'city_id' => $cityId],
                        ['zipcode' => $row['zipcode'] ?? null]
                    );
                }
            }

            return $this->success(null, 'Import successful.');
        }, 'Failed to import areas.', 'masters');
    }
}
