<?php

namespace App\Http\Controllers\Admin\Communication;

use App\Http\Controllers\Controller;
use App\Models\Admin\Communication\CommunicationLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationLogController extends Controller
{
    public function index(Request $request, ?string $type = null): Response
    {
        $search = trim((string) $request->string('search'));
        $type = $type ?? $request->string('type')->toString();
        $status = $request->string('status');
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $logs = CommunicationLog::query()
            ->when($type !== '', function ($query) use ($type): void {
                $query->where('channel', $type);
            })
            ->when($status->toString() !== '', function ($query) use ($status): void {
                $query->where('status', $status);
            })
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('recipient', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhere('template_purpose', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/communication/logs', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status->toString(),
            ],
        ]);
    }
}
