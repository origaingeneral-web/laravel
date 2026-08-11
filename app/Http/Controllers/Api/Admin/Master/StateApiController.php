<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StateApiController extends Controller
{
    public function index(): JsonResponse
    {
        $states = State::query()
            ->join('countries', 'states.country_id', '=', 'countries.id')
            ->select(['states.*', 'countries.country'])
            ->orderBy('states.state')
            ->get();

        return response()->json([
            'data' => $states,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'state' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10'],
        ]);

        $state = State::query()->create($validated);

        return response()->json([
            'message' => 'State created successfully.',
            'data' => $state,
        ], 201);
    }

    public function update(Request $request, State $state): JsonResponse
    {
        $validated = $request->validate([
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'state' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10'],
        ]);

        $state->update($validated);

        return response()->json([
            'message' => 'State updated successfully.',
            'data' => $state,
        ]);
    }

    public function destroy(State $state): JsonResponse
    {
        $state->delete();

        return response()->json([
            'message' => 'State deleted successfully.',
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'rows' => ['required', 'array'],
        ]);

        foreach ($request->input('rows', []) as $row) {
            $countryId = $row['country_id'] ?? null;
            if (!$countryId && !empty($row['country'])) {
                $countryId = \App\Models\Admin\Master\Country::where('country', $row['country'])->value('id');
            }

            if ($countryId && !empty($row['state'])) {
                State::updateOrCreate(
                    ['state' => $row['state'], 'country_id' => $countryId],
                    ['code' => $row['code'] ?? null]
                );
            }
        }

        return response()->json(['message' => 'Import successful.']);
    }
}
