import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Save, Mail, MessageSquare, Phone, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function Edit({ group, settings }: any) {
    
    // Group meta data for the header
    const groupMeta: any = {
        email: { title: 'Email Configuration', icon: <Mail className="size-5 text-primary" />, desc: 'Configure SMTP details for sending out emails.' },
        sms: { title: 'SMS Configuration', icon: <MessageSquare className="size-5 text-primary" />, desc: 'Configure your SMS gateway provider (e.g. Twilio, Vonage).' },
        whatsapp: { title: 'WhatsApp Configuration', icon: <Phone className="size-5 text-primary" />, desc: 'Configure WhatsApp Business API integration.' },
        payment: { title: 'Payment Gateway', icon: <CreditCard className="size-5 text-primary" />, desc: 'Configure API keys for Stripe, PayPal, Razorpay, etc.' },
        cron: { title: 'Cron Job Settings', icon: <Clock className="size-5 text-primary" />, desc: 'View server cron setup instructions and configure scheduled task behavior.' },
    };
    
    const meta = groupMeta[group] || { title: 'Configuration', icon: null, desc: '' };

    // Default form data based on group
    const getDefaultData = () => {
        if (group === 'email') return { mail_host: '', mail_port: '', mail_username: '', mail_password: '', mail_encryption: '', mail_from_address: '', ...settings };
        if (group === 'sms') return { sms_provider: '', twilio_sid: '', twilio_token: '', twilio_from: '', ...settings };
        if (group === 'whatsapp') return { whatsapp_api_url: '', whatsapp_token: '', whatsapp_instance_id: '', ...settings };
        if (group === 'payment') return { stripe_key: '', stripe_secret: '', paypal_client_id: '', paypal_secret: '', ...settings };
        if (group === 'cron') return { cron_notification_email: '', ...settings };
        return { ...settings };
    };

    const { data, setData, post, processing } = useForm(getDefaultData());
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setIsNavigating(true));
        const removeFinish = router.on('finish', () => setIsNavigating(false));
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/settings/${group}`);
    };

    return (
        <>
            <Head title={`${meta.title} | Admin`} />

            <Container>
                <Toolbar>
                    <ToolbarHeading title={meta.title} description={meta.desc} />
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            {meta.icon}
                            {meta.title}
                        </CardTitle>
                        <CardDescription>Update your global {group} settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {group === 'cron' && (
                            <div className="mb-6 p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
                                <p className="font-semibold mb-2">Server Setup Instruction:</p>
                                <p className="text-muted-foreground mb-3">To ensure automated tasks run properly, you must add the following Cron entry to your server:</p>
                                <code className="block bg-black text-green-400 p-3 rounded font-mono text-xs">
                                    * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
                                </code>
                            </div>
                        )}

                        {isNavigating ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 flex justify-end border-t mt-6">
                                    <Skeleton className="h-10 w-40" />
                                </div>
                            </div>
                        ) : (
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* --- EMAIL CONFIGURATION --- */}
                            {group === 'email' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_host">SMTP Host</Label>
                                        <Input id="mail_host" value={data.mail_host} onChange={(e) => setData('mail_host', e.target.value)} placeholder="e.g. smtp.mailgun.org" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_port">SMTP Port</Label>
                                        <Input id="mail_port" value={data.mail_port} onChange={(e) => setData('mail_port', e.target.value)} placeholder="e.g. 587" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_username">SMTP Username</Label>
                                        <Input id="mail_username" value={data.mail_username} onChange={(e) => setData('mail_username', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_password">SMTP Password</Label>
                                        <Input id="mail_password" type="password" value={data.mail_password} onChange={(e) => setData('mail_password', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_encryption">Encryption</Label>
                                        <Input id="mail_encryption" value={data.mail_encryption} onChange={(e) => setData('mail_encryption', e.target.value)} placeholder="tls / ssl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mail_from_address">From Address</Label>
                                        <Input id="mail_from_address" value={data.mail_from_address} onChange={(e) => setData('mail_from_address', e.target.value)} placeholder="e.g. no-reply@example.com" />
                                    </div>
                                </div>
                            )}

                            {/* --- SMS CONFIGURATION --- */}
                            {group === 'sms' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="sms_provider">Provider Name</Label>
                                        <Input id="sms_provider" value={data.sms_provider} onChange={(e) => setData('sms_provider', e.target.value)} placeholder="e.g. Twilio" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twilio_sid">Account SID / Key</Label>
                                        <Input id="twilio_sid" value={data.twilio_sid} onChange={(e) => setData('twilio_sid', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twilio_token">Auth Token / Secret</Label>
                                        <Input id="twilio_token" type="password" value={data.twilio_token} onChange={(e) => setData('twilio_token', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="twilio_from">Sender ID / From Number</Label>
                                        <Input id="twilio_from" value={data.twilio_from} onChange={(e) => setData('twilio_from', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* --- WHATSAPP CONFIGURATION --- */}
                            {group === 'whatsapp' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_api_url">API Base URL</Label>
                                        <Input id="whatsapp_api_url" value={data.whatsapp_api_url} onChange={(e) => setData('whatsapp_api_url', e.target.value)} placeholder="https://api.whatsapp.com/..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_instance_id">Instance ID / Phone Number ID</Label>
                                        <Input id="whatsapp_instance_id" value={data.whatsapp_instance_id} onChange={(e) => setData('whatsapp_instance_id', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_token">Access Token</Label>
                                        <Input id="whatsapp_token" type="password" value={data.whatsapp_token} onChange={(e) => setData('whatsapp_token', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* --- PAYMENT GATEWAY --- */}
                            {group === 'payment' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 pb-2 border-b">
                                        <h3 className="font-semibold">Stripe Configuration</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stripe_key">Stripe Public Key</Label>
                                        <Input id="stripe_key" value={data.stripe_key} onChange={(e) => setData('stripe_key', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stripe_secret">Stripe Secret Key</Label>
                                        <Input id="stripe_secret" type="password" value={data.stripe_secret} onChange={(e) => setData('stripe_secret', e.target.value)} />
                                    </div>

                                    <div className="md:col-span-2 pb-2 border-b mt-4">
                                        <h3 className="font-semibold">PayPal Configuration</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
                                        <Input id="paypal_client_id" value={data.paypal_client_id} onChange={(e) => setData('paypal_client_id', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paypal_secret">PayPal Secret Key</Label>
                                        <Input id="paypal_secret" type="password" value={data.paypal_secret} onChange={(e) => setData('paypal_secret', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* --- CRON --- */}
                            {group === 'cron' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cron_notification_email">Send Cron Failure Notifications To (Email)</Label>
                                        <Input id="cron_notification_email" value={data.cron_notification_email} onChange={(e) => setData('cron_notification_email', e.target.value)} placeholder="admin@example.com" />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end border-t mt-6">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    Save Configuration
                                </Button>
                            </div>
                        </form>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
