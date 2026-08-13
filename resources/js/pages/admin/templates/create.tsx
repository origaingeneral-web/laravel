import { Link, Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        purpose: 'welcome',
        name: '',
        is_email_active: false,
        email_subject: '',
        email_body: '',
        is_sms_active: false,
        sms_body: '',
        is_whatsapp_active: false,
        whatsapp_body: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/templates');
    };

    return (
        <>
            <Head title="Create Template | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading title="Add Template" description="Create a unified notification template." />
                    <ToolbarActions>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/admin/templates">
                                <ArrowLeft className="size-4" />
                                Back to Templates
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Meta Settings */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle>Template Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="purpose">Purpose</Label>
                                        <Select value={data.purpose} onValueChange={(v) => setData('purpose', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select purpose" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="welcome">Welcome Message</SelectItem>
                                                <SelectItem value="plan_expiring">Plan Expiring Alert</SelectItem>
                                                <SelectItem value="plan_expired">Plan Expired Alert</SelectItem>
                                                <SelectItem value="new_update">New Update / Feature</SelectItem>
                                                <SelectItem value="down_time">Down Time Alert</SelectItem>
                                                <SelectItem value="custom">Custom Notification</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.purpose && <div className="text-sm text-destructive">{errors.purpose}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Template Name (Internal)</Label>
                                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Default Welcome Flow" />
                                        {errors.name && <div className="text-sm text-destructive">{errors.name}</div>}
                                    </div>
                                </div>
                                {errors.channels && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.channels}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Channels Settings */}
                        <Card className="border-border/50 shadow-sm">
                            <CardContent className="pt-6">
                                <Tabs defaultValue="email" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6">
                                        <TabsTrigger value="email" className="gap-2"><Mail className="size-4" /> Email</TabsTrigger>
                                        <TabsTrigger value="sms" className="gap-2"><MessageSquare className="size-4" /> SMS</TabsTrigger>
                                        <TabsTrigger value="whatsapp" className="gap-2"><Phone className="size-4" /> WhatsApp</TabsTrigger>
                                    </TabsList>
                                    
                                    {/* Email Tab */}
                                    <TabsContent value="email" className="space-y-6">
                                        <div className="flex items-center space-x-2 pb-4 border-b">
                                            <Switch id="is_email_active" checked={data.is_email_active} onCheckedChange={(c) => setData('is_email_active', c)} />
                                            <Label htmlFor="is_email_active">Enable Email Notifications</Label>
                                        </div>
                                        {data.is_email_active && (
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email_subject">Email Subject</Label>
                                                    <Input id="email_subject" value={data.email_subject} onChange={(e) => setData('email_subject', e.target.value)} placeholder="Welcome to our platform!" />
                                                    {errors.email_subject && <div className="text-sm text-destructive">{errors.email_subject}</div>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email_body">Email HTML Body</Label>
                                                    <Textarea id="email_body" rows={8} value={data.email_body} onChange={(e) => setData('email_body', e.target.value)} placeholder="Dear {company_name}, ..." />
                                                    {errors.email_body && <div className="text-sm text-destructive">{errors.email_body}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* SMS Tab */}
                                    <TabsContent value="sms" className="space-y-6">
                                        <div className="flex items-center space-x-2 pb-4 border-b">
                                            <Switch id="is_sms_active" checked={data.is_sms_active} onCheckedChange={(c) => setData('is_sms_active', c)} />
                                            <Label htmlFor="is_sms_active">Enable SMS Notifications</Label>
                                        </div>
                                        {data.is_sms_active && (
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sms_body">SMS Text Body</Label>
                                                    <Textarea id="sms_body" rows={5} value={data.sms_body} onChange={(e) => setData('sms_body', e.target.value)} placeholder="Hi {owner_name}, your plan expires in {days_left} days." />
                                                    {errors.sms_body && <div className="text-sm text-destructive">{errors.sms_body}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* WhatsApp Tab */}
                                    <TabsContent value="whatsapp" className="space-y-6">
                                        <div className="flex items-center space-x-2 pb-4 border-b">
                                            <Switch id="is_whatsapp_active" checked={data.is_whatsapp_active} onCheckedChange={(c) => setData('is_whatsapp_active', c)} />
                                            <Label htmlFor="is_whatsapp_active">Enable WhatsApp Notifications</Label>
                                        </div>
                                        {data.is_whatsapp_active && (
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="whatsapp_body">WhatsApp Text Body</Label>
                                                    <Textarea id="whatsapp_body" rows={5} value={data.whatsapp_body} onChange={(e) => setData('whatsapp_body', e.target.value)} placeholder="*Important Alert*\nHello {owner_name}..." />
                                                    {errors.whatsapp_body && <div className="text-sm text-destructive">{errors.whatsapp_body}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>

                                <div className="pt-6 mt-6 border-t flex justify-end">
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Save className="size-4" />
                                        Save Template
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm bg-slate-50 dark:bg-slate-900/50 sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-base">Available Variables</CardTitle>
                                <CardDescription>Use these placeholders in your subject or body.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm">
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{company_name}`}</code> - Name of the company</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{owner_name}`}</code> - Contact person name</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{plan_name}`}</code> - Current subscription plan</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{expiry_date}`}</code> - Plan expiration date</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{days_left}`}</code> - Days until expiration</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{`{app_name}`}</code> - Your application name</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Container>
        </>
    );
}
