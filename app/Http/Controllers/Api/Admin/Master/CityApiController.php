<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\City;
use App\Models\Admin\Master\State;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $cities = City::query()
                ->join('states', 'cities.state_id', '=', 'states.id')
                ->select(['cities.*', 'states.state'])
                ->orderBy('cities.city')
                ->get();

            return $this->success($cities);
        }, 'Failed to fetch cities.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'state_id' => ['required', 'integer', 'exists:states,id'],
                'city' => ['required', 'string', 'max:255'],
                'is_top_city' => ['sometimes', 'boolean'],
            ]);

            $city = City::query()->create($validated);

            return $this->success($city, 'City created successfully.', 201);
        }, 'Failed to create city.', 'masters');
    }

    public function update(Request $request, City $city): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $city) {
            $validated = $request->validate([
                'state_id' => ['required', 'integer', 'exists:states,id'],
                'city' => ['required', 'string', 'max:255'],
                'is_top_city' => ['sometimes', 'boolean'],
            ]);

            $city->update($validated);

            return $this->success($city, 'City updated successfully.');
        }, 'Failed to update city.', 'masters');
    }

    public function destroy(City $city): JsonResponse
    {
        return $this->tryCatch(function () use ($city) {
            $city->delete();

            return $this->success(null, 'City deleted successfully.');
        }, 'Failed to delete city.', 'masters');
    }

    public function import(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $request->validate([
                'rows' => ['required', 'array'],
            ]);

            foreach ($request->input('rows', []) as $row) {
                $stateId = $row['state_id'] ?? null;
                if (! $stateId && ! empty($row['state'])) {
                    $stateId = State::where('state', $row['state'])->value('id');
                }

                if ($stateId && ! empty($row['city'])) {
                    City::updateOrCreate(
                        ['city' => $row['city'], 'state_id' => $stateId],
                        ['is_top_city' => $row['is_top_city'] ?? false]
                    );
                }
            }

            return $this->success(null, 'Import successful.');
        }, 'Failed to import cities.', 'masters');
    }
}
