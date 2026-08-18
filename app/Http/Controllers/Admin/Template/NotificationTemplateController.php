<?php

namespace App\Http\Controllers\Admin\Template;

use App\Http\Controllers\Controller;
use App\Models\Admin\Template\NotificationTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NotificationTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

        $templates = NotificationTemplate::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('purpose', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/templates/index', [
            'templates' => $templates,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/templates/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTemplate($request);

        NotificationTemplate::create($validated);

        return redirect()->route('admin.templates.index')->with('success', 'Template created successfully.');
    }

    public function edit(NotificationTemplate $template): Response
    {
        return Inertia::render('admin/templates/edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, NotificationTemplate $template): RedirectResponse
    {
        $validated = $this->validateTemplate($request, $template->id);

        $template->update($validated);

        return redirect()->route('admin.templates.index')->with('success', 'Template updated successfully.');
    }

    public function destroy(NotificationTemplate $template): RedirectResponse
    {
        $template->delete();

        return redirect()->route('admin.templates.index')->with('success', 'Template deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateTemplate(Request $request, ?int $ignoreId = null): array
    {
        $uniquePurpose = 'unique:notification_templates,purpose';
        if ($ignoreId !== null) {
            $uniquePurpose .= ','.$ignoreId;
        }

        $validated = $request->validate([
            'purpose' => ['required', 'string', 'max:255', $uniquePurpose],
            'name' => ['required', 'string', 'max:255'],

            'is_email_active' => ['boolean'],
            'email_subject' => ['nullable', 'string', 'max:255', 'required_if:is_email_active,true'],
            'email_body' => ['nullable', 'string', 'required_if:is_email_active,true'],

            'is_sms_active' => ['boolean'],
            'sms_body' => ['nullable', 'string', 'required_if:is_sms_active,true'],

            'is_whatsapp_active' => ['boolean'],
            'whatsapp_body' => ['nullable', 'string', 'required_if:is_whatsapp_active,true'],
        ]);

        if (
            empty($validated['is_email_active']) &&
            empty($validated['is_sms_active']) &&
            empty($validated['is_whatsapp_active'])
        ) {
            throw ValidationException::withMessages([
                'channels' => 'At least one channel (Email, SMS, or WhatsApp) must be active.',
            ]);
        }

        return $validated;
    }
}
