import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Bell, Megaphone, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PanelIndexProps {
    notifications: any;
    companies?: Array<{ id: number; label: string }>;
    users?: Array<{ id: number; label: string; email?: string }>;
}

export default function PanelIndex({ notifications, companies = [], users = [] }: PanelIndexProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        message: '',
        target_type: 'all',
        target_id: '',
        panel_display_style: 'banner',
        expires_at: '',
    });

    const handleOpenModal = () => {
        reset();
        clearErrors();
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        reset();
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/communication/notifications/panel', {
            onSuccess: () => {
                handleCloseModal();
            },
        });
    };

    const columns = [
        { key: 'id', header: '#', sortable: true, cell: (_: any, idx: number) => idx + 1 },
        { key: 'title', header: 'Title', sortable: true },
        { 
            key: 'target_type', 
            header: 'Target',
            cell: (item: any) => (
                <span className="capitalize px-2 py-1 bg-secondary rounded text-xs">{item.target_type}</span>
            )
        },
        { 
            key: 'panel_display_style', 
            header: 'Style',
            cell: (item: any) => (
                <span className="capitalize font-medium text-xs px-2 py-0.5 border rounded-md">
                    {item.panel_display_style}
                </span>
            )
        },
        { 
            key: 'expires_at', 
            header: 'Expires At', 
            sortable: true, 
            cell: (item: any) => item.expires_at ? new Date(item.expires_at).toLocaleString() : 'Never' 
        },
        { key: 'created_at', header: 'Created At', sortable: true, cell: (item: any) => new Date(item.created_at).toLocaleString() },
    ];

    return (
        <>
            <Head title="Panel Notifications | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Panel Announcements"
                        description="View and manage in-app panel notifications."
                    />
                    <ToolbarActions>
                        <Button onClick={handleOpenModal} className="gap-2">
                            <Plus className="size-4" />
                            Create Notice
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={notifications?.data || []}
                    columns={columns}
                    searchPlaceholder="Search panel notifications..."
                />
            </Container>

            {/* Compose Panel Notice Modal */}
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto sm:max-w-xl [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                    <DialogHeader className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-white shrink-0">
                            <Megaphone className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-white leading-tight">
                                Create In-App Announcement
                            </DialogTitle>
                            <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                                Create an announcement banner or notification bell broadcast inside the panel.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Announcement Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Scheduled Maintenance Downtime"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Announcement Body <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="message"
                                    rows={4}
                                    placeholder="Write full announcement details..."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Display Style <span className="text-destructive">*</span>
                                </Label>
                                <RadioGroup
                                    value={data.panel_display_style}
                                    onValueChange={(val) => setData('panel_display_style', val)}
                                    className="grid grid-cols-2 gap-3 mt-1.5"
                                >
                                    <div className={`flex items-center space-x-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${data.panel_display_style === 'banner' ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-muted/40'}`}>
                                        <RadioGroupItem value="banner" id="style-banner" />
                                        <Label htmlFor="style-banner" className="cursor-pointer font-medium text-sm flex flex-col">
                                            <span>Top Banner</span>
                                            <span className="text-xs font-normal text-muted-foreground">Persistent alert banner</span>
                                        </Label>
                                    </div>
                                    <div className={`flex items-center space-x-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${data.panel_display_style === 'bell' ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-muted/40'}`}>
                                        <RadioGroupItem value="bell" id="style-bell" />
                                        <Label htmlFor="style-bell" className="cursor-pointer font-medium text-sm flex flex-col">
                                            <span>Notification Bell</span>
                                            <span className="text-xs font-normal text-muted-foreground">Appears in bell popover</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expires_at" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Expiration Date (Optional)
                                </Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    The notification will automatically disappear after this date/time.
                                </p>
                                {errors.expires_at && <p className="text-destructive text-xs">{errors.expires_at}</p>}
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Target Audience <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.target_type}
                                    onValueChange={(val) => {
                                        setData((prev) => ({ ...prev, target_type: val, target_id: '' }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select target..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Everyone</SelectItem>
                                        <SelectItem value="company">Specific Company</SelectItem>
                                        <SelectItem value="user">Specific User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.target_type === 'company' && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Select Target Company <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.target_id}
                                        onValueChange={(v) => setData('target_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose company..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.target_id && <p className="text-destructive text-xs">{errors.target_id}</p>}
                                </div>
                            )}

                            {data.target_type === 'user' && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Select Target User <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.target_id}
                                        onValueChange={(v) => setData('target_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose user..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.label} {u.email ? `(${u.email})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.target_id && <p className="text-destructive text-xs">{errors.target_id}</p>}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-2 border-t border-border/50">
                            <Button type="button" variant="outline" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                                <Save className="size-4" />
                                {processing ? 'Saving...' : 'Save Announcement'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

