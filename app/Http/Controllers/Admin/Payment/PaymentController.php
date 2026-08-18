<?php

namespace App\Http\Controllers\Admin\Payment;

use App\Http\Controllers\Controller;
use App\Models\Admin\Payment\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $payments = Payment::query()
            ->with([
                'company:id,company_name,company_code,email',
                'companyProduct.product:id,name',
                'companyProduct.plan:id,plan_name',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('company', function ($q) use ($search) {
                    $q->where('company_name', 'like', "%{$search}%")
                        ->orWhere('company_code', 'like', "%{$search}%");
                })->orWhere('transaction_id', 'like', "%{$search}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
