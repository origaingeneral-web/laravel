<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Country;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CountryApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $countries = Country::query()->orderBy('country')->get();

            return $this->success($countries);
        }, 'Failed to fetch countries.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'country' => ['required', 'string', 'max:255'],
                'iso3' => ['nullable', 'string', 'max:3'],
                'phone_code' => ['nullable', 'string', 'max:32'],
            ]);

            $country = Country::query()->create($validated);

            return $this->success($country, 'Country created successfully.', 201);
        }, 'Failed to create country.', 'masters');
    }

    public function update(Request $request, Country $country): JsonResponse
    {
        return $this->tryCatch(function () use ($request, $country) {
            $validated = $request->validate([
                'country' => ['required', 'string', 'max:255'],
                'iso3' => ['nullable', 'string', 'max:3'],
                'phone_code' => ['nullable', 'string', 'max:32'],
            ]);

            $country->update($validated);

            return $this->success($country, 'Country updated successfully.');
        }, 'Failed to update country.', 'masters');
    }

    public function destroy(Country $country): JsonResponse
    {
        return $this->tryCatch(function () use ($country) {
            $country->delete();

            return $this->success(null, 'Country deleted successfully.');
        }, 'Failed to delete country.', 'masters');
    }
}
