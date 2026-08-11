<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanApiController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = Plan::query()->orderBy('plan_name')->get();

        return response()->json([
            'data' => $plans,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_in_days' => ['required', 'integer', 'min:0'],
            'staff_limit' => ['required', 'integer', 'min:0'],
            'tracking_duration' => ['required', 'integer', 'min:0'],
            'remarks' => ['nullable', 'string', 'max:1024'],
        ]);

        $plan = Plan::query()->create($validated);

        return response()->json([
            'message' => 'Plan created successfully.',
            'data' => $plan,
        ], 201);
    }

    public function update(Request $request, Plan $plan): JsonResponse
    {
        $validated = $request->validate([
            'plan_name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_in_days' => ['required', 'integer', 'min:0'],
            'staff_limit' => ['required', 'integer', 'min:0'],
            'tracking_duration' => ['required', 'integer', 'min:0'],
            'remarks' => ['nullable', 'string', 'max:1024'],
        ]);

        $plan->update($validated);

        return response()->json([
            'message' => 'Plan updated successfully.',
            'data' => $plan,
        ]);
    }

    public function destroy(Plan $plan): JsonResponse
    {
        $plan->delete();

        return response()->json([
            'message' => 'Plan deleted successfully.',
        ]);
    }
}
