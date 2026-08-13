<?php

use App\Http\Controllers\Api\Admin\Master\AreaApiController;
use App\Http\Controllers\Api\Admin\Master\BusinessCategoryApiController;
use App\Http\Controllers\Api\Admin\Master\CityApiController;
use App\Http\Controllers\Api\Admin\Master\CountryApiController;
use App\Http\Controllers\Api\Admin\Master\LanguageApiController;
use App\Http\Controllers\Api\Admin\Master\PlanApiController;
use App\Http\Controllers\Api\Admin\Master\StateApiController;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth:sanctum')->group(function () {
Route::prefix('v1/admin')
    ->middleware(['throttle:company-api']) // You might want different middleware here later
    ->name('api.v1.admin.')
    ->group(function () {
        Route::prefix('master')->name('master.')->group(function () {
            Route::post('states/import', [StateApiController::class, 'import'])->name('states.import');
            Route::post('cities/import', [CityApiController::class, 'import'])->name('cities.import');
            Route::post('areas/import', [AreaApiController::class, 'import'])->name('areas.import');

            Route::apiResource('business-categories', BusinessCategoryApiController::class);
            Route::apiResource('languages', LanguageApiController::class);
            Route::apiResource('countries', CountryApiController::class);
            Route::apiResource('states', StateApiController::class);
            Route::apiResource('cities', CityApiController::class);
            Route::apiResource('areas', AreaApiController::class);
            Route::apiResource('plans', PlanApiController::class);
        });
    });
// });
