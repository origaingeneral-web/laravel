<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $subscriptions = CompanyProduct::query()
            ->with([
                'company:id,company_name,company_code,email',
                'product:id,name',
                'plan:id,plan_name',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('company', function ($q) use ($search) {
                    $q->where('company_name', 'like', "%{$search}%")
                        ->orWhere('company_code', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
