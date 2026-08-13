import { Head, useForm } from '@inertiajs/react';
import { Flame, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateFirebase({ companies, users }: any) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        target_type: 'all',
        target_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/communication/notifications/firebase');
    };

    return (
        <>
            <Head title="Send Firebase Push | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading title="Firebase Push Notification" description="Send a push notification to devices via Firebase Cloud Messaging." />
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="max-w-3xl border-orange-500/20 shadow-sm shadow-orange-500/5">
                    <CardHeader className="bg-orange-500/5 border-b border-orange-500/10">
                        <CardTitle className="flex items-center gap-2 text-xl text-orange-600 dark:text-orange-400">
                            <Flame className="size-5" />
                            Compose Push Notification
                        </CardTitle>
                        <CardDescription>This will be delivered instantly to the target devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Notification Title</Label>
                                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="message">Message Body</Label>
                                    <Textarea id="message" value={data.message} onChange={e => setData('message', e.target.value)} rows={4} required />
                                    {errors.message && <p className="text-destructive text-sm">{errors.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select value={data.target_type} onValueChange={(val) => {
                                        setData(prev => ({ ...prev, target_type: val, target_id: '' }));
                                    }}>
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
                                        <Label>Select Company</Label>
                                        <Select value={data.target_id} onValueChange={v => setData('target_id', v)}>
                                            <SelectTrigger>
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
                                    <div className="space-y-2">
                                        <Label>Select User</Label>
                                        <Select value={data.target_id} onValueChange={v => setData('target_id', v)}>
                                            <SelectTrigger>
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
                                <Button type="submit" disabled={processing} className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
                                    <Send className="size-4" />
                                    Send Push Notification
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
