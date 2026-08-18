<?php

namespace App\Http\Controllers\Admin\Communication;

use App\Http\Controllers\Controller;
use App\Models\Admin\Communication\CommunicationLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $type = $request->string('type');
        $status = $request->string('status');
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $logs = CommunicationLog::query()
            ->with('company')
            ->when($type->toString() !== '', function ($query) use ($type): void {
                $query->where('type', $type);
            })
            ->when($status->toString() !== '', function ($query) use ($status): void {
                $query->where('status', $status);
            })
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('recipient', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhereHas('company', function ($companyQuery) use ($search): void {
                            $companyQuery->where('company_name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/communication/logs', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'type' => $type->toString(),
                'status' => $status->toString(),
            ],
        ]);
    }
}
