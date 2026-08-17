import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CreatePanel({ companies, users }: any) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        target_type: 'all',
        target_id: '',
        panel_display_style: 'banner',
        expires_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/communication/notifications/panel');
    };

    return (
        <>
            <Head title="Create Panel Notice | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading title="In-App Panel Announcement" description="Create an announcement that displays inside the application panel." />
                    <ToolbarActions>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/communication/notifications/panel">
                                <ArrowLeft className="size-4" />
                                Cancel
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="max-w-2xl mx-auto border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Announcement Title</Label>
                                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="message">Announcement Body</Label>
                                    <Textarea id="message" value={data.message} onChange={e => setData('message', e.target.value)} rows={4} required />
                                    {errors.message && <p className="text-destructive text-sm">{errors.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Display Style</Label>
                                    <RadioGroup value={data.panel_display_style} onValueChange={(val) => setData('panel_display_style', val)} className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="banner" id="r1" />
                                            <Label htmlFor="r1" className="cursor-pointer font-normal">Top Banner</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="bell" id="r2" />
                                            <Label htmlFor="r2" className="cursor-pointer font-normal">Notification Bell Dropdown</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                                    <Input id="expires_at" type="datetime-local" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">The notification will disappear after this date.</p>
                                    {errors.expires_at && <p className="text-destructive text-sm">{errors.expires_at}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2 border-t pt-4">
                                    <Label>Target Audience</Label>
                                    <Select value={data.target_type} onValueChange={(val) => {
                                        setData(prev => ({ ...prev, target_type: val, target_id: '' }));
                                    }}>
                                        <SelectTrigger className="w-full md:w-1/2">
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
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Select Company</Label>
                                        <Select value={data.target_id} onValueChange={v => setData('target_id', v)}>
                                            <SelectTrigger className="w-full md:w-1/2">
                                                <SelectValue placeholder="Choose company..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((c: any) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {data.target_type === 'user' && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Select User</Label>
                                        <Select value={data.target_id} onValueChange={v => setData('target_id', v)}>
                                            <SelectTrigger className="w-full md:w-1/2">
                                                <SelectValue placeholder="Choose user..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u: any) => (
                                                    <SelectItem key={u.id} value={String(u.id)}>{u.label} ({u.email})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end border-t mt-6">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    Save Announcement
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
