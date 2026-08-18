<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Company\Employee\EmployeeController;
use App\Http\Controllers\Api\Company\Product\ProductAddonFeatureRequestController;
use App\Http\Controllers\Api\Company\Product\ProductController;
use App\Http\Controllers\Api\Company\Product\ProductCreditController;
use App\Http\Controllers\Api\Company\Product\ProductFeatureController;
use App\Http\Controllers\Api\Company\Product\ProductPlanController;
use App\Http\Controllers\Api\Company\Product\ProductRenewalRequestController;
use App\Http\Controllers\Api\Company\Profile\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:login')
    ->name('api.login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('me', [AuthController::class, 'me'])->name('api.me');

    Route::prefix('v1/company')
        ->middleware(['throttle:company-api', 'company.context', 'role:company_admin|employee'])
        ->name('api.v1.company.')
        ->group(function () {
            Route::get('profile', [ProfileController::class, 'show'])
                ->middleware('permission:company.profile.view')
                ->name('profile.show');

            Route::put('profile', [ProfileController::class, 'update'])
                ->middleware('permission:company.profile.update')
                ->name('profile.update');

            Route::get('employees', [EmployeeController::class, 'index'])
                ->middleware('permission:company.employees.view')
                ->name('employees.index');

            Route::post('employees', [EmployeeController::class, 'store'])
                ->middleware('permission:company.employees.manage')
                ->name('employees.store');

            Route::get('employees/{employee}', [EmployeeController::class, 'show'])
                ->whereNumber('employee')
                ->middleware('permission:company.employees.view')
                ->name('employees.show');

            Route::put('employees/{employee}', [EmployeeController::class, 'update'])
                ->whereNumber('employee')
                ->middleware('permission:company.employees.manage')
                ->name('employees.update');

            Route::patch('employees/{employee}/status', [EmployeeController::class, 'updateStatus'])
                ->whereNumber('employee')
                ->middleware('permission:company.employees.manage')
                ->name('employees.status');

            Route::post('employees/{employee}/reset-password', [EmployeeController::class, 'resetPassword'])
                ->whereNumber('employee')
                ->middleware('permission:company.employees.manage')
                ->name('employees.reset-password');

            Route::put('employees/{employee}/products', [EmployeeController::class, 'syncProducts'])
                ->whereNumber('employee')
                ->middleware('permission:company.employees.manage')
                ->name('employees.products');

            Route::get('products', [ProductController::class, 'index'])
                ->middleware('permission:company.products.view')
                ->name('products.index');

            Route::middleware('product.access')->prefix('products/{product}')->whereNumber('product')->group(function () {
                Route::get('/', [ProductController::class, 'show'])
                    ->middleware('permission:company.products.view')
                    ->name('products.show');

                Route::get('plan', [ProductPlanController::class, 'show'])
                    ->middleware('permission:company.plan.view')
                    ->name('products.plan');

                Route::get('features', [ProductFeatureController::class, 'index'])
                    ->middleware('permission:company.features.view')
                    ->name('products.features');

                Route::get('credits', [ProductCreditController::class, 'show'])
                    ->middleware('permission:company.credits.view')
                    ->name('products.credits');

                Route::get('credits/logs', [ProductCreditController::class, 'logs'])
                    ->middleware('permission:company.credits.view')
                    ->name('products.credits.logs');

                Route::post('renewal-requests', [ProductRenewalRequestController::class, 'store'])
                    ->middleware('permission:company.plan.view')
                    ->name('products.renewal-requests');

                Route::post('addon-feature-requests', [ProductAddonFeatureRequestController::class, 'store'])
                    ->middleware('permission:company.features.view')
                    ->name('products.addon-feature-requests');
            });
        });
});

include __DIR__.'/admin/master.php';
