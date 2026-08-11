<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityApiController extends Controller
{
    public function index(): JsonResponse
    {
        $cities = City::query()
            ->join('states', 'cities.state_id', '=', 'states.id')
            ->select(['cities.*', 'states.state'])
            ->orderBy('cities.city')
            ->get();

        return response()->json([
            'data' => $cities,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'city' => ['required', 'string', 'max:255'],
            'is_top_city' => ['sometimes', 'boolean'],
        ]);

        $city = City::query()->create($validated);

        return response()->json([
            'message' => 'City created successfully.',
            'data' => $city,
        ], 201);
    }

    public function update(Request $request, City $city): JsonResponse
    {
        $validated = $request->validate([
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'city' => ['required', 'string', 'max:255'],
            'is_top_city' => ['sometimes', 'boolean'],
        ]);

        $city->update($validated);

        return response()->json([
            'message' => 'City updated successfully.',
            'data' => $city,
        ]);
    }

    public function destroy(City $city): JsonResponse
    {
        $city->delete();

        return response()->json([
            'message' => 'City deleted successfully.',
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'rows' => ['required', 'array'],
        ]);

        foreach ($request->input('rows', []) as $row) {
            $stateId = $row['state_id'] ?? null;
            if (!$stateId && !empty($row['state'])) {
                $stateId = \App\Models\Admin\Master\State::where('state', $row['state'])->value('id');
            }

            if ($stateId && !empty($row['city'])) {
                City::updateOrCreate(
                    ['city' => $row['city'], 'state_id' => $stateId],
                    ['is_top_city' => $row['is_top_city'] ?? false]
                );
            }
        }

        return response()->json(['message' => 'Import successful.']);
    }
}
