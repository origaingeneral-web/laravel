import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { BellRing, Flame, Plus, Send } from 'lucide-react';
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

interface FirebaseIndexProps {
    notifications: any;
    companies?: Array<{ id: number; label: string }>;
    users?: Array<{ id: number; label: string; email?: string }>;
}

export default function FirebaseIndex({ notifications, companies = [], users = [] }: FirebaseIndexProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        message: '',
        target_type: 'all',
        target_id: '',
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
        post('/admin/communication/notifications/firebase', {
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
        { key: 'created_at', header: 'Sent At', sortable: true, cell: (item: any) => new Date(item.created_at).toLocaleString() },
    ];

    return (
        <>
            <Head title="Firebase Push Notifications | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Firebase Push Notifications"
                        description="View and manage push notifications sent to devices."
                    />
                    <ToolbarActions>
                        <Button onClick={handleOpenModal} className="gap-2">
                            <Plus className="size-4" />
                            Send Push Notification
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={notifications?.data || []}
                    columns={columns}
                    searchPlaceholder="Search push notifications..."
                />
            </Container>

            {/* Compose Push Notification Modal */}
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto sm:max-w-xl [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                    <DialogHeader className="p-5 bg-gradient-to-r from-orange-500 via-amber-600 to-primary text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-white shrink-0">
                            <Flame className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-white leading-tight">
                                Send Push Notification
                            </DialogTitle>
                            <DialogDescription className="text-xs text-orange-100/90 leading-normal">
                                Send an instant Firebase push notification to target mobile & web devices.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Notification Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Important System Update"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Message Body <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="message"
                                    rows={4}
                                    placeholder="Write your push notification message here..."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                            </div>

                            <div className="space-y-2">
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
                                        <SelectItem value="all">Everyone (All Devices)</SelectItem>
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
                            <Button type="submit" disabled={processing} className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                                <Send className="size-4" />
                                {processing ? 'Sending...' : 'Send Push Notification'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

