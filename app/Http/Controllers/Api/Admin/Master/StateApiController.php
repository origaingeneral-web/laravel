<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Country;
use App\Models\Admin\Master\State;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StateApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $states = State::query()
                ->join('countries', 'states.country_id', '=', 'countries.id')
                ->select(['states.*', 'countries.country'])
                ->orderBy('states.state')
                ->get();

            return $this->success($states);
        }, 'Failed to fetch states.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'country_id' => ['required', 'integer', 'exists:countries,id'],
                'state' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:10'],
            ]);

            $state = State::query()->create($validated);

            return $this->success($state, 'State created successfully.', 201);
        }, 'Failed to create state.', 'masters');
    }

    public function update(Request $request, State $state): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $state) {
            $validated = $request->validate([
                'country_id' => ['required', 'integer', 'exists:countries,id'],
                'state' => ['required', 'string', 'max:255'],
                'code' => ['nullable', 'string', 'max:10'],
            ]);

            $state->update($validated);

            return $this->success($state, 'State updated successfully.');
        }, 'Failed to update state.', 'masters');
    }

    public function destroy(State $state): JsonResponse
    {
        return $this->tryCatch(function () use ($state) {
            $state->delete();

            return $this->success(null, 'State deleted successfully.');
        }, 'Failed to delete state.', 'masters');
    }

    public function import(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $request->validate([
                'rows' => ['required', 'array'],
            ]);

            foreach ($request->input('rows', []) as $row) {
                $countryId = $row['country_id'] ?? null;
                if (! $countryId && ! empty($row['country'])) {
                    $countryId = Country::where('country', $row['country'])->value('id');
                }

                if ($countryId && ! empty($row['state'])) {
                    State::updateOrCreate(
                        ['state' => $row['state'], 'country_id' => $countryId],
                        ['code' => $row['code'] ?? null]
                    );
                }
            }

            return $this->success(null, 'Import successful.');
        }, 'Failed to import states.', 'masters');
    }
}
