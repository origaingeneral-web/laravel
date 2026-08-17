import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Save,
    Mail,
    MessageSquare,
    Phone,
    CreditCard,
    Clock,
    Flame,
    QrCode,
    Building2,
    ShieldCheck,
    Globe,
    CheckCircle2,
    Lock,
    Eye,
    EyeOff,
    Sliders,
    Layers,
    Banknote,
    Zap,
    Upload,
    Image as ImageIcon,
    Trash2,
    X,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function Edit({ group, settings }: any) {
    // Group meta data for the header
    const groupMeta: any = {
        email: { title: 'Email Configuration', icon: <Mail className="size-5 text-primary" />, desc: 'Configure SMTP details for sending out emails.' },
        sms: { title: 'SMS Configuration', icon: <MessageSquare className="size-5 text-primary" />, desc: 'Configure your SMS gateway provider (e.g. Twilio, Vonage).' },
        whatsapp: { title: 'WhatsApp Configuration', icon: <Phone className="size-5 text-primary" />, desc: 'Configure WhatsApp Business API integration.' },
        payment: { title: 'Payment Gateways & Methods', icon: <CreditCard className="size-5 text-primary" />, desc: 'Configure Top 6 payment gateways, UPI QR Code, Bank wire transfer, image uploads & verification rules.' },
        cron: { title: 'Cron Job Settings', icon: <Clock className="size-5 text-primary" />, desc: 'View server cron setup instructions and configure scheduled task behavior.' },
        firebase: { title: 'Firebase Configuration', icon: <Flame className="size-5 text-primary" />, desc: 'Configure Firebase Web API keys and project settings.' },
    };

    const meta = groupMeta[group] || { title: 'Configuration', icon: null, desc: '' };

    // Default form data based on group
    const getDefaultData = () => {
        if (group === 'email') return { mail_host: '', mail_port: '', mail_username: '', mail_password: '', mail_encryption: '', mail_from_address: '', ...settings };
        if (group === 'sms') return { sms_provider: '', twilio_sid: '', twilio_token: '', twilio_from: '', ...settings };
        if (group === 'whatsapp') return { whatsapp_api_url: '', whatsapp_token: '', whatsapp_instance_id: '', ...settings };
        if (group === 'payment') {
            return {
                // Global Settings
                payment_currency: 'USD',
                payment_currency_symbol: '$',
                is_verification_required: '0',

                // 1. Stripe
                stripe_enabled: '1',
                stripe_mode: 'test',
                stripe_key: '',
                stripe_secret: '',
                stripe_webhook_secret: '',
                stripe_is_verification_required: '0',

                // 2. PayPal
                paypal_enabled: '0',
                paypal_mode: 'sandbox',
                paypal_client_id: '',
                paypal_secret: '',
                paypal_app_id: '',
                paypal_is_verification_required: '0',

                // 3. Razorpay
                razorpay_enabled: '0',
                razorpay_mode: 'test',
                razorpay_key_id: '',
                razorpay_key_secret: '',
                razorpay_webhook_secret: '',
                razorpay_is_verification_required: '0',

                // 4. Paystack
                paystack_enabled: '0',
                paystack_mode: 'test',
                paystack_public_key: '',
                paystack_secret_key: '',
                paystack_merchant_email: '',
                paystack_is_verification_required: '0',

                // 5. Flutterwave
                flutterwave_enabled: '0',
                flutterwave_mode: 'test',
                flutterwave_public_key: '',
                flutterwave_secret_key: '',
                flutterwave_encryption_key: '',
                flutterwave_is_verification_required: '0',

                // 6. Authorize.Net
                authorizenet_enabled: '0',
                authorizenet_mode: 'sandbox',
                authorizenet_api_login_id: '',
                authorizenet_transaction_key: '',
                authorizenet_signature_key: '',
                authorizenet_is_verification_required: '0',

                // Custom Method 1: UPI
                upi_enabled: '0',
                upi_title: 'UPI / QR Code Transfer (GPay, PhonePe, Paytm)',
                upi_id: '',
                upi_payee_name: '',
                upi_qr_code_url: '',
                upi_qr_image: null as File | null,
                upi_qr_image_remove: '0',
                upi_instructions: 'Scan the QR code or pay to the UPI ID. After completing payment, enter your 12-digit UTR/Transaction Reference Number and upload a screenshot for verification.',
                upi_is_verification_required: '1',

                // Custom Method 2: Bank Transfer
                bank_transfer_enabled: '0',
                bank_title: 'Direct Bank Wire Transfer / NEFT / IMPS',
                bank_name: '',
                bank_account_name: '',
                bank_account_number: '',
                bank_ifsc_swift: '',
                bank_branch: '',
                bank_image: null as File | null,
                bank_image_url: '',
                bank_image_remove: '0',
                bank_instructions: 'Please transfer the exact amount to our bank account. Use your Order ID as payment reference and upload payment proof/receipt for admin verification.',
                bank_is_verification_required: '1',

                ...settings,
            };
        }
        if (group === 'cron') return { cron_notification_email: '', ...settings };
        if (group === 'firebase') return { firebase_api_key: '', firebase_auth_domain: '', firebase_project_id: '', firebase_storage_bucket: '', firebase_messaging_sender_id: '', firebase_app_id: '', firebase_measurement_id: '', ...settings };
        return { ...settings };
    };

    const { data, setData, post, processing } = useForm(getDefaultData());
    const [isNavigating, setIsNavigating] = useState(false);
    const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

    // Local image previews
    const [upiPreview, setUpiPreview] = useState<string | null>(settings?.upi_qr_image || settings?.upi_qr_code_url || null);
    const [bankPreview, setBankPreview] = useState<string | null>(settings?.bank_image || settings?.bank_image_url || null);

    const upiFileInputRef = useRef<HTMLInputElement>(null);
    const bankFileInputRef = useRef<HTMLInputElement>(null);

    const toggleSecret = (key: string) => {
        setVisibleSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleUpiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev: any) => ({ ...prev, upi_qr_image: file, upi_qr_image_remove: '0' }));
            setUpiPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveUpiImage = () => {
        setData((prev: any) => ({ ...prev, upi_qr_image: null, upi_qr_image_remove: '1', upi_qr_code_url: '' }));
        setUpiPreview(null);
        if (upiFileInputRef.current) upiFileInputRef.current.value = '';
    };

    const handleBankImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev: any) => ({ ...prev, bank_image: file, bank_image_remove: '0' }));
            setBankPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveBankImage = () => {
        setData((prev: any) => ({ ...prev, bank_image: null, bank_image_remove: '1', bank_image_url: '' }));
        setBankPreview(null);
        if (bankFileInputRef.current) bankFileInputRef.current.value = '';
    };

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
        post(`/admin/settings/${group}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`${meta.title} | Admin`} />

            <Container>
                <Toolbar>
                    <ToolbarHeading title={meta.title} description={meta.desc} />
                </Toolbar>
            </Container>

            <Container className="pb-12">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/40 pb-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
                                    {meta.icon}
                                    {meta.title}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Configure and manage your global {group} settings.
                                </CardDescription>
                            </div>
                            {group === 'payment' && (
                                <Badge variant="outline" className="px-3 py-1 gap-1.5 font-medium">
                                    <ShieldCheck className="size-3.5 text-emerald-500" />
                                    <span>8 Total Payment Options & QR Support</span>
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {group === 'cron' && (
                            <div className="mb-6 p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
                                <p className="font-semibold mb-2">Server Setup Instruction:</p>
                                <p className="text-muted-foreground mb-3">To ensure automated tasks run properly, you must add the following Cron entry to your server:</p>
                                <code className="block bg-black text-green-400 p-3 rounded font-mono text-xs">
                                    * * * * * cd /path-to-your-project && php artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1
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
                            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                {/* ==================== EMAIL CONFIGURATION ==================== */}
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

                                {/* ==================== SMS CONFIGURATION ==================== */}
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

                                {/* ==================== WHATSAPP CONFIGURATION ==================== */}
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

                                {/* ==================== PAYMENT GATEWAYS & CUSTOM METHODS ==================== */}
                                {group === 'payment' && (
                                    <Tabs defaultValue="custom" className="w-full space-y-6">
                                        <TabsList className="grid w-full grid-cols-3 max-w-xl h-11 p-1 bg-muted/60 rounded-xl">
                                            <TabsTrigger value="gateways" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                                                <CreditCard className="size-4" />
                                                Top 6 Gateways
                                            </TabsTrigger>
                                            <TabsTrigger value="custom" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                                                <QrCode className="size-4" />
                                                UPI & Bank (Img Upload)
                                            </TabsTrigger>
                                            <TabsTrigger value="general" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                                                <Sliders className="size-4" />
                                                Global & Verification
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* ---------- TAB 1: TOP 6 GATEWAYS ---------- */}
                                        <TabsContent value="gateways" className="space-y-6 pt-2">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                                {/* 1. Stripe */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.stripe_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF] font-black text-sm">
                                                                S
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">1. Stripe Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">Credit/Debit Cards, Apple Pay, Google Pay</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.stripe_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.stripe_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.stripe_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('stripe_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.stripe_mode || 'test'}
                                                                    onValueChange={(val) => setData('stripe_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="test">Test / Sandbox</SelectItem>
                                                                        <SelectItem value="live">Live / Production</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.stripe_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('stripe_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="stripe_key" className="text-xs">Publishable Key</Label>
                                                            <Input
                                                                id="stripe_key"
                                                                value={data.stripe_key}
                                                                onChange={(e) => setData('stripe_key', e.target.value)}
                                                                placeholder="pk_test_..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="stripe_secret" className="text-xs">Secret Key</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="stripe_secret"
                                                                    type={visibleSecrets.stripe_secret ? 'text' : 'password'}
                                                                    value={data.stripe_secret}
                                                                    onChange={(e) => setData('stripe_secret', e.target.value)}
                                                                    placeholder="sk_test_..."
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('stripe_secret')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.stripe_secret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="stripe_webhook_secret" className="text-xs">Webhook Signing Secret</Label>
                                                            <Input
                                                                id="stripe_webhook_secret"
                                                                value={data.stripe_webhook_secret}
                                                                onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                                                                placeholder="whsec_..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. PayPal */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.paypal_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#003087]/10 flex items-center justify-center text-[#003087] font-black text-sm">
                                                                P
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">2. PayPal Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">PayPal Wallet, Express Checkout & Smart Buttons</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.paypal_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.paypal_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.paypal_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('paypal_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.paypal_mode || 'sandbox'}
                                                                    onValueChange={(val) => setData('paypal_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="sandbox">Sandbox / Test</SelectItem>
                                                                        <SelectItem value="live">Live / Production</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.paypal_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('paypal_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paypal_client_id" className="text-xs">Client ID</Label>
                                                            <Input
                                                                id="paypal_client_id"
                                                                value={data.paypal_client_id}
                                                                onChange={(e) => setData('paypal_client_id', e.target.value)}
                                                                placeholder="Enter PayPal Client ID"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paypal_secret" className="text-xs">Client Secret</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="paypal_secret"
                                                                    type={visibleSecrets.paypal_secret ? 'text' : 'password'}
                                                                    value={data.paypal_secret}
                                                                    onChange={(e) => setData('paypal_secret', e.target.value)}
                                                                    placeholder="Enter PayPal Secret"
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('paypal_secret')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.paypal_secret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paypal_app_id" className="text-xs">App ID / Webhook ID (Optional)</Label>
                                                            <Input
                                                                id="paypal_app_id"
                                                                value={data.paypal_app_id}
                                                                onChange={(e) => setData('paypal_app_id', e.target.value)}
                                                                placeholder="APP-80W284485P519543T"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. Razorpay */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.razorpay_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#0C2340]/10 flex items-center justify-center text-[#0C2340] dark:text-blue-400 font-black text-sm">
                                                                R
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">3. Razorpay Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">UPI, Cards, NetBanking, Wallets & International</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.razorpay_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.razorpay_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.razorpay_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('razorpay_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.razorpay_mode || 'test'}
                                                                    onValueChange={(val) => setData('razorpay_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="test">Test Mode</SelectItem>
                                                                        <SelectItem value="live">Live Mode</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.razorpay_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('razorpay_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="razorpay_key_id" className="text-xs">Key ID</Label>
                                                            <Input
                                                                id="razorpay_key_id"
                                                                value={data.razorpay_key_id}
                                                                onChange={(e) => setData('razorpay_key_id', e.target.value)}
                                                                placeholder="rzp_test_..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="razorpay_key_secret" className="text-xs">Key Secret</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="razorpay_key_secret"
                                                                    type={visibleSecrets.razorpay_key_secret ? 'text' : 'password'}
                                                                    value={data.razorpay_key_secret}
                                                                    onChange={(e) => setData('razorpay_key_secret', e.target.value)}
                                                                    placeholder="Enter Razorpay Secret"
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('razorpay_key_secret')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.razorpay_key_secret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="razorpay_webhook_secret" className="text-xs">Webhook Secret (Optional)</Label>
                                                            <Input
                                                                id="razorpay_webhook_secret"
                                                                value={data.razorpay_webhook_secret}
                                                                onChange={(e) => setData('razorpay_webhook_secret', e.target.value)}
                                                                placeholder="Webhook secret key"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 4. Paystack */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.paystack_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#00C3F7]/10 flex items-center justify-center text-[#00C3F7] font-black text-sm">
                                                                P
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">4. Paystack Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">Cards, Bank Accounts, Mobile Money & USSD</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.paystack_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.paystack_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.paystack_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('paystack_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.paystack_mode || 'test'}
                                                                    onValueChange={(val) => setData('paystack_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="test">Test Mode</SelectItem>
                                                                        <SelectItem value="live">Live Mode</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.paystack_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('paystack_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paystack_public_key" className="text-xs">Public Key</Label>
                                                            <Input
                                                                id="paystack_public_key"
                                                                value={data.paystack_public_key}
                                                                onChange={(e) => setData('paystack_public_key', e.target.value)}
                                                                placeholder="pk_test_..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paystack_secret_key" className="text-xs">Secret Key</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="paystack_secret_key"
                                                                    type={visibleSecrets.paystack_secret_key ? 'text' : 'password'}
                                                                    value={data.paystack_secret_key}
                                                                    onChange={(e) => setData('paystack_secret_key', e.target.value)}
                                                                    placeholder="sk_test_..."
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('paystack_secret_key')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.paystack_secret_key ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="paystack_merchant_email" className="text-xs">Merchant Email</Label>
                                                            <Input
                                                                id="paystack_merchant_email"
                                                                value={data.paystack_merchant_email}
                                                                onChange={(e) => setData('paystack_merchant_email', e.target.value)}
                                                                placeholder="billing@example.com"
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 5. Flutterwave */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.flutterwave_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#FB9129]/10 flex items-center justify-center text-[#FB9129] font-black text-sm">
                                                                F
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">5. Flutterwave Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">Multi-currency Global & African Payments</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.flutterwave_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.flutterwave_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.flutterwave_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('flutterwave_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.flutterwave_mode || 'test'}
                                                                    onValueChange={(val) => setData('flutterwave_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="test">Test Mode</SelectItem>
                                                                        <SelectItem value="live">Live Mode</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.flutterwave_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('flutterwave_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="flutterwave_public_key" className="text-xs">Public Key</Label>
                                                            <Input
                                                                id="flutterwave_public_key"
                                                                value={data.flutterwave_public_key}
                                                                onChange={(e) => setData('flutterwave_public_key', e.target.value)}
                                                                placeholder="FLWPUBK_TEST-..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="flutterwave_secret_key" className="text-xs">Secret Key</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="flutterwave_secret_key"
                                                                    type={visibleSecrets.flutterwave_secret_key ? 'text' : 'password'}
                                                                    value={data.flutterwave_secret_key}
                                                                    onChange={(e) => setData('flutterwave_secret_key', e.target.value)}
                                                                    placeholder="FLWSECK_TEST-..."
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('flutterwave_secret_key')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.flutterwave_secret_key ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="flutterwave_encryption_key" className="text-xs">Encryption Key (Optional)</Label>
                                                            <Input
                                                                id="flutterwave_encryption_key"
                                                                value={data.flutterwave_encryption_key}
                                                                onChange={(e) => setData('flutterwave_encryption_key', e.target.value)}
                                                                placeholder="FLWSECK_TEST_ENCR-..."
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 6. Authorize.Net */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.authorizenet_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 rounded-lg bg-[#0070BA]/10 flex items-center justify-center text-[#0070BA] font-black text-sm">
                                                                A
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">6. Authorize.Net Gateway</h4>
                                                                <p className="text-[11px] text-muted-foreground">Visa, Mastercard, eCheck, ACH Payments</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.authorizenet_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.authorizenet_enabled === '1' ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.authorizenet_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('authorizenet_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Environment Mode</Label>
                                                                <Select
                                                                    value={data.authorizenet_mode || 'sandbox'}
                                                                    onValueChange={(val) => setData('authorizenet_mode', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-xs">
                                                                        <SelectValue placeholder="Select mode" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="sandbox">Sandbox / Test</SelectItem>
                                                                        <SelectItem value="live">Live / Production</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Verification Required</Label>
                                                                <div className="flex items-center justify-between h-9 px-3 border border-input rounded-md bg-background">
                                                                    <span className="text-[11px] text-muted-foreground">Require Approval</span>
                                                                    <Switch
                                                                        size="sm"
                                                                        checked={data.authorizenet_is_verification_required === '1'}
                                                                        onCheckedChange={(c) => setData('authorizenet_is_verification_required', c ? '1' : '0')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="authorizenet_api_login_id" className="text-xs">API Login ID</Label>
                                                            <Input
                                                                id="authorizenet_api_login_id"
                                                                value={data.authorizenet_api_login_id}
                                                                onChange={(e) => setData('authorizenet_api_login_id', e.target.value)}
                                                                placeholder="Enter API Login ID"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="authorizenet_transaction_key" className="text-xs">Transaction Key</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="authorizenet_transaction_key"
                                                                    type={visibleSecrets.authorizenet_transaction_key ? 'text' : 'password'}
                                                                    value={data.authorizenet_transaction_key}
                                                                    onChange={(e) => setData('authorizenet_transaction_key', e.target.value)}
                                                                    placeholder="Enter Transaction Key"
                                                                    className="h-9 text-xs font-mono pe-9"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSecret('authorizenet_transaction_key')}
                                                                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {visibleSecrets.authorizenet_transaction_key ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="authorizenet_signature_key" className="text-xs">Signature Key (Optional)</Label>
                                                            <Input
                                                                id="authorizenet_signature_key"
                                                                value={data.authorizenet_signature_key}
                                                                onChange={(e) => setData('authorizenet_signature_key', e.target.value)}
                                                                placeholder="Enter Signature Key"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </TabsContent>

                                        {/* ---------- TAB 2: 2 CUSTOM PAYMENT METHODS (UPI & BANK) WITH IMAGE UPLOADS ---------- */}
                                        <TabsContent value="custom" className="space-y-6 pt-2">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                                {/* Custom Method 1: UPI / QR Code */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.upi_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                                <QrCode className="size-5" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-bold text-sm text-foreground">Custom 1: UPI / QR Code</h4>
                                                                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                                        QR Upload Supported
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-[11px] text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM UPI & QR</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.upi_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.upi_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.upi_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('upi_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Verification Required Banner */}
                                                        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                                                            <div className="flex items-start gap-2">
                                                                <ShieldCheck className="size-4 text-amber-500 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="text-xs font-bold text-foreground">Verification Required (is_verification_required)</span>
                                                                    <p className="text-[11px] text-muted-foreground">Require Admin to manually verify UTR / Transaction Screenshot before fulfilling.</p>
                                                                </div>
                                                            </div>
                                                            <Switch
                                                                checked={data.upi_is_verification_required === '1'}
                                                                onCheckedChange={(checked) => setData('upi_is_verification_required', checked ? '1' : '0')}
                                                            />
                                                        </div>

                                                        {/* UPI QR Code Image Upload Box */}
                                                        <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                                                                    <ImageIcon className="size-3.5 text-emerald-600" />
                                                                    UPI QR Code Image
                                                                </Label>
                                                                {upiPreview && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleRemoveUpiImage}
                                                                        className="h-6 text-[11px] text-destructive hover:bg-destructive/10 px-2 gap-1"
                                                                    >
                                                                        <Trash2 className="size-3" />
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                {upiPreview ? (
                                                                    <div className="relative group size-20 rounded-lg overflow-hidden border border-border bg-white shadow-xs shrink-0 flex items-center justify-center p-1">
                                                                        <img
                                                                            src={upiPreview}
                                                                            alt="UPI QR Code Preview"
                                                                            className="size-full object-contain"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="size-20 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground shrink-0 bg-background/50">
                                                                        <QrCode className="size-6 text-muted-foreground/60" />
                                                                        <span className="text-[9px] mt-1">No QR</span>
                                                                    </div>
                                                                )}

                                                                <div className="grow space-y-1.5">
                                                                    <input
                                                                        type="file"
                                                                        ref={upiFileInputRef}
                                                                        onChange={handleUpiImageChange}
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        id="upi_qr_file_input"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => upiFileInputRef.current?.click()}
                                                                        className="h-8 text-xs gap-1.5 w-full justify-center"
                                                                    >
                                                                        <Upload className="size-3.5" />
                                                                        {upiPreview ? 'Change QR Image' : 'Upload QR Code Image'}
                                                                    </Button>
                                                                    <p className="text-[10px] text-muted-foreground">
                                                                        Supports JPG, PNG, WEBP, SVG (Max: 5MB)
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="upi_title" className="text-xs font-semibold">Display Title</Label>
                                                            <Input
                                                                id="upi_title"
                                                                value={data.upi_title}
                                                                onChange={(e) => setData('upi_title', e.target.value)}
                                                                placeholder="e.g. UPI / Google Pay / PhonePe / Paytm"
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="upi_id" className="text-xs font-semibold">UPI ID / VPA</Label>
                                                                <Input
                                                                    id="upi_id"
                                                                    value={data.upi_id}
                                                                    onChange={(e) => setData('upi_id', e.target.value)}
                                                                    placeholder="e.g. merchant@upi or yourname@okhdfcbank"
                                                                    className="h-9 text-xs font-mono"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="upi_payee_name" className="text-xs font-semibold">Payee / Merchant Name</Label>
                                                                <Input
                                                                    id="upi_payee_name"
                                                                    value={data.upi_payee_name}
                                                                    onChange={(e) => setData('upi_payee_name', e.target.value)}
                                                                    placeholder="e.g. Acme Corporation Pvt Ltd"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="upi_qr_code_url" className="text-xs font-semibold">QR Code Image URL (Alternative)</Label>
                                                            <Input
                                                                id="upi_qr_code_url"
                                                                value={data.upi_qr_code_url}
                                                                onChange={(e) => {
                                                                    setData('upi_qr_code_url', e.target.value);
                                                                    if (e.target.value && !data.upi_qr_image) setUpiPreview(e.target.value);
                                                                }}
                                                                placeholder="https://yourdomain.com/uploads/qr-code.png"
                                                                className="h-9 text-xs font-mono"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="upi_instructions" className="text-xs font-semibold">Payment Instructions for Customer</Label>
                                                            <Textarea
                                                                id="upi_instructions"
                                                                rows={3}
                                                                value={data.upi_instructions}
                                                                onChange={(e) => setData('upi_instructions', e.target.value)}
                                                                placeholder="Instructions displayed to the customer during checkout..."
                                                                className="text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Custom Method 2: Direct Bank Wire Transfer */}
                                                <div className={`p-5 rounded-xl border transition-all ${data.bank_transfer_enabled === '1' ? 'border-primary/50 bg-primary/2 shadow-xs' : 'border-border/60 bg-card'}`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                                <Building2 className="size-5" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-bold text-sm text-foreground">Custom 2: Bank Account Transfer</h4>
                                                                    <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20">
                                                                        Image Upload Supported
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-[11px] text-muted-foreground">Bank Account Wire, NEFT, RTGS, IMPS & IBAN</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={data.bank_transfer_enabled === '1' ? 'primary' : 'outline'} className="text-[10px]">
                                                                {data.bank_transfer_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </Badge>
                                                            <Switch
                                                                checked={data.bank_transfer_enabled === '1'}
                                                                onCheckedChange={(checked) => setData('bank_transfer_enabled', checked ? '1' : '0')}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Verification Required Banner */}
                                                        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                                                            <div className="flex items-start gap-2">
                                                                <ShieldCheck className="size-4 text-amber-500 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="text-xs font-bold text-foreground">Verification Required (is_verification_required)</span>
                                                                    <p className="text-[11px] text-muted-foreground">Require Admin to check bank statement/receipt proof before activating order.</p>
                                                                </div>
                                                            </div>
                                                            <Switch
                                                                checked={data.bank_is_verification_required === '1'}
                                                                onCheckedChange={(checked) => setData('bank_is_verification_required', checked ? '1' : '0')}
                                                            />
                                                        </div>

                                                        {/* Bank QR Code / Account Detail Image Upload Box */}
                                                        <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-blue-500/40 bg-blue-500/5">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                                                                    <ImageIcon className="size-3.5 text-blue-600" />
                                                                    Bank QR / Account Detail Image / Logo
                                                                </Label>
                                                                {bankPreview && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleRemoveBankImage}
                                                                        className="h-6 text-[11px] text-destructive hover:bg-destructive/10 px-2 gap-1"
                                                                    >
                                                                        <Trash2 className="size-3" />
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                {bankPreview ? (
                                                                    <div className="relative group size-20 rounded-lg overflow-hidden border border-border bg-white shadow-xs shrink-0 flex items-center justify-center p-1">
                                                                        <img
                                                                            src={bankPreview}
                                                                            alt="Bank Detail Preview"
                                                                            className="size-full object-contain"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="size-20 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground shrink-0 bg-background/50">
                                                                        <Building2 className="size-6 text-muted-foreground/60" />
                                                                        <span className="text-[9px] mt-1">No Image</span>
                                                                    </div>
                                                                )}

                                                                <div className="grow space-y-1.5">
                                                                    <input
                                                                        type="file"
                                                                        ref={bankFileInputRef}
                                                                        onChange={handleBankImageChange}
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        id="bank_file_input"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => bankFileInputRef.current?.click()}
                                                                        className="h-8 text-xs gap-1.5 w-full justify-center"
                                                                    >
                                                                        <Upload className="size-3.5" />
                                                                        {bankPreview ? 'Change Bank Image' : 'Upload Bank QR / Image'}
                                                                    </Button>
                                                                    <p className="text-[10px] text-muted-foreground">
                                                                        Supports JPG, PNG, WEBP, SVG (Max: 5MB)
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="bank_title" className="text-xs font-semibold">Display Title</Label>
                                                            <Input
                                                                id="bank_title"
                                                                value={data.bank_title}
                                                                onChange={(e) => setData('bank_title', e.target.value)}
                                                                placeholder="e.g. Direct Bank Transfer / NEFT / IMPS / Wire"
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="bank_name" className="text-xs font-semibold">Bank Name</Label>
                                                                <Input
                                                                    id="bank_name"
                                                                    value={data.bank_name}
                                                                    onChange={(e) => setData('bank_name', e.target.value)}
                                                                    placeholder="e.g. HDFC Bank / Chase / Standard Chartered"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="bank_account_name" className="text-xs font-semibold">Account Holder Name</Label>
                                                                <Input
                                                                    id="bank_account_name"
                                                                    value={data.bank_account_name}
                                                                    onChange={(e) => setData('bank_account_name', e.target.value)}
                                                                    placeholder="e.g. Acme Tech Solutions LLC"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="bank_account_number" className="text-xs font-semibold">Account Number / IBAN</Label>
                                                                <Input
                                                                    id="bank_account_number"
                                                                    value={data.bank_account_number}
                                                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                                                    placeholder="e.g. 50200012345678"
                                                                    className="h-9 text-xs font-mono"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="bank_ifsc_swift" className="text-xs font-semibold">IFSC / SWIFT / BIC / Routing Code</Label>
                                                                <Input
                                                                    id="bank_ifsc_swift"
                                                                    value={data.bank_ifsc_swift}
                                                                    onChange={(e) => setData('bank_ifsc_swift', e.target.value)}
                                                                    placeholder="e.g. HDFC0001234 or CHASUS33"
                                                                    className="h-9 text-xs font-mono"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="bank_branch" className="text-xs font-semibold">Branch Name & Address (Optional)</Label>
                                                            <Input
                                                                id="bank_branch"
                                                                value={data.bank_branch}
                                                                onChange={(e) => setData('bank_branch', e.target.value)}
                                                                placeholder="e.g. Financial District Branch, New York"
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="bank_instructions" className="text-xs font-semibold">Payment Instructions for Customer</Label>
                                                            <Textarea
                                                                id="bank_instructions"
                                                                rows={3}
                                                                value={data.bank_instructions}
                                                                onChange={(e) => setData('bank_instructions', e.target.value)}
                                                                placeholder="Instructions displayed to the customer during checkout..."
                                                                className="text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </TabsContent>

                                        {/* ---------- TAB 3: GLOBAL & VERIFICATION RULES ---------- */}
                                        <TabsContent value="general" className="space-y-6 pt-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                                {/* Currency Config */}
                                                <div className="p-5 rounded-xl border border-border/60 bg-card space-y-4">
                                                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
                                                        <Globe className="size-5 text-primary" />
                                                        <div>
                                                            <h4 className="font-bold text-sm text-foreground">Global Currency Settings</h4>
                                                            <p className="text-[11px] text-muted-foreground">Default currency and symbols for transactions</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">Base Currency Code</Label>
                                                        <Select
                                                            value={data.payment_currency || 'USD'}
                                                            onValueChange={(val) => setData('payment_currency', val)}
                                                        >
                                                            <SelectTrigger className="h-9 text-xs font-mono">
                                                                <SelectValue placeholder="Select currency" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                                                                <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                                                                <SelectItem value="INR">INR - Indian Rupee (₹)</SelectItem>
                                                                <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                                                                <SelectItem value="CAD">CAD - Canadian Dollar (C$)</SelectItem>
                                                                <SelectItem value="AUD">AUD - Australian Dollar (A$)</SelectItem>
                                                                <SelectItem value="NGN">NGN - Nigerian Naira (₦)</SelectItem>
                                                                <SelectItem value="AED">AED - UAE Dirham (د.إ)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="payment_currency_symbol" className="text-xs">Currency Symbol</Label>
                                                        <Input
                                                            id="payment_currency_symbol"
                                                            value={data.payment_currency_symbol}
                                                            onChange={(e) => setData('payment_currency_symbol', e.target.value)}
                                                            placeholder="$ or € or ₹"
                                                            className="h-9 text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Global Verification Policy */}
                                                <div className="p-5 rounded-xl border border-border/60 bg-card space-y-4">
                                                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
                                                        <ShieldCheck className="size-5 text-amber-500" />
                                                        <div>
                                                            <h4 className="font-bold text-sm text-foreground">Global Payment Verification Policy</h4>
                                                            <p className="text-[11px] text-muted-foreground">Configure global is_verification_required rule</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-foreground">
                                                                Require Verification For All Payments (Global)
                                                            </span>
                                                            <Switch
                                                                checked={data.is_verification_required === '1'}
                                                                onCheckedChange={(c) => setData('is_verification_required', c ? '1' : '0')}
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                            When enabled, all orders and transactions across all methods will stay in <strong>Pending Verification</strong> status until an administrator manually verifies and marks them as completed.
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2 pt-1 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                            <span>Instant auto-approval can be enabled individually per gateway.</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                            <span>Offline methods (UPI & Bank) default to requiring verification.</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                )}

                                {/* ==================== CRON CONFIGURATION ==================== */}
                                {group === 'cron' && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="cron_notification_email">Send Cron Failure Notifications To (Email)</Label>
                                            <Input id="cron_notification_email" value={data.cron_notification_email} onChange={(e) => setData('cron_notification_email', e.target.value)} placeholder="admin@example.com" />
                                        </div>
                                    </div>
                                )}

                                {/* ==================== FIREBASE CONFIGURATION ==================== */}
                                {group === 'firebase' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="firebase_project_id">Project ID</Label>
                                            <Input id="firebase_project_id" value={data.firebase_project_id} onChange={(e) => setData('firebase_project_id', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="firebase_api_key">API Key</Label>
                                            <Input id="firebase_api_key" value={data.firebase_api_key} onChange={(e) => setData('firebase_api_key', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="firebase_auth_domain">Auth Domain</Label>
                                            <Input id="firebase_auth_domain" value={data.firebase_auth_domain} onChange={(e) => setData('firebase_auth_domain', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="firebase_storage_bucket">Storage Bucket</Label>
                                            <Input id="firebase_storage_bucket" value={data.firebase_storage_bucket} onChange={(e) => setData('firebase_storage_bucket', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="firebase_messaging_sender_id">Messaging Sender ID</Label>
                                            <Input id="firebase_messaging_sender_id" value={data.firebase_messaging_sender_id} onChange={(e) => setData('firebase_messaging_sender_id', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="firebase_app_id">App ID</Label>
                                            <Input id="firebase_app_id" value={data.firebase_app_id} onChange={(e) => setData('firebase_app_id', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="firebase_measurement_id">Measurement ID (Optional)</Label>
                                            <Input id="firebase_measurement_id" value={data.firebase_measurement_id} onChange={(e) => setData('firebase_measurement_id', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex items-center justify-between border-t border-border/50 mt-8">
                                    <span className="text-xs text-muted-foreground">
                                        Ensure sensitive API credentials & payment images are kept up to date.
                                    </span>
                                    <Button type="submit" disabled={processing} className="gap-2 px-6">
                                        <Save className="size-4" />
                                        Save All Configurations
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
