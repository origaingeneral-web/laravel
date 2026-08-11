<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CountryApiController extends Controller
{
    public function index(): JsonResponse
    {
        $countries = Country::query()->orderBy('country')->get();

        return response()->json([
            'data' => $countries,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'country' => ['required', 'string', 'max:255'],
            'iso3' => ['nullable', 'string', 'max:3'],
            'phone_code' => ['nullable', 'string', 'max:32'],
        ]);

        $country = Country::query()->create($validated);

        return response()->json([
            'message' => 'Country created successfully.',
            'data' => $country,
        ], 201);
    }

    public function update(Request $request, Country $country): JsonResponse
    {
        $validated = $request->validate([
            'country' => ['required', 'string', 'max:255'],
            'iso3' => ['nullable', 'string', 'max:3'],
            'phone_code' => ['nullable', 'string', 'max:32'],
        ]);

        $country->update($validated);

        return response()->json([
            'message' => 'Country updated successfully.',
            'data' => $country,
        ]);
    }

    public function destroy(Country $country): JsonResponse
    {
        $country->delete();

        return response()->json([
            'message' => 'Country deleted successfully.',
        ]);
    }
}
