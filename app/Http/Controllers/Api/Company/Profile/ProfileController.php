<?php

namespace App\Http\Controllers\Api\Company\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\UpdateCompanyProfileRequest;
use App\Http\Resources\Api\Company\CompanyResource;
use App\Models\Company\Company;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    use TryCatchHandler;

    public function show(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var Company $company */
            $company = $request->attributes->get('company');

            $this->authorize('view', $company);

            return $this->success([
                'company' => new CompanyResource($company),
            ]);
        }, 'Failed to fetch company profile.', 'company');
    }

    public function update(UpdateCompanyProfileRequest $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var Company $company */
            $company = $request->attributes->get('company');

            $this->authorize('update', $company);

            $data = $request->safe()->except(['logo']);

            if ($request->hasFile('logo')) {
                if ($company->profile) {
                    Storage::disk('public')->delete($company->profile);
                }

                $data['profile'] = $request->file('logo')->store('company-logos', 'public');
            }

            $company->fill($data);
            $company->save();

            return $this->success([
                'company' => new CompanyResource($company->fresh()),
            ], 'Company profile updated.');
        }, 'Failed to update company profile.', 'company');
    }
}
