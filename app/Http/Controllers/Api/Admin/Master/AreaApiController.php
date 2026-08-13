<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Area;
use App\Models\Admin\Master\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AreaApiController extends Controller
{
    public function index(): JsonResponse
    {
        $areas = Area::query()
            ->join('cities', 'areas.city_id', '=', 'cities.id')
            ->select(['areas.*', 'cities.city'])
            ->orderBy('areas.area')
            ->get();

        return response()->json([
            'data' => $areas,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'area' => ['required', 'string', 'max:255'],
            'zipcode' => ['nullable', 'string', 'max:50'],
        ]);

        $area = Area::query()->create($validated);

        return response()->json([
            'message' => 'Area created successfully.',
            'data' => $area,
        ], 201);
    }

    public function update(Request $request, Area $area): JsonResponse
    {
        $validated = $request->validate([
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'area' => ['required', 'string', 'max:255'],
            'zipcode' => ['nullable', 'string', 'max:50'],
        ]);

        $area->update($validated);

        return response()->json([
            'message' => 'Area updated successfully.',
            'data' => $area,
        ]);
    }

    public function destroy(Area $area): JsonResponse
    {
        $area->delete();

        return response()->json([
            'message' => 'Area deleted successfully.',
        ]);
    }

    public function import(Request $request): JsonResponse
    {
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

        return response()->json(['message' => 'Import successful.']);
    }
}
