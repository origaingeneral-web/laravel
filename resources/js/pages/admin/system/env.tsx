import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    SlidersHorizontal,
    Save,
    AlertTriangle,
    ShieldCheck,
    FileCode2,
    Clock,
    Globe,
    Terminal,
    Lock,
    Zap,
    RotateCcw,
    Layers,
    Database,
    FileText,
    CheckCircle2,
    Info,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnvPageProps {
    envData: {
        app_name: string;
        app_env: string;
        app_debug: boolean;
        app_url: string;
        app_timezone: string;
        app_locale: string;
        app_fallback_locale: string;
        log_level: string;
        session_lifetime: number;
        session_driver: string;
        cache_store: string;
        queue_connection: string;
    };
    envMeta: {
        path: string;
        exists: boolean;
        is_writable: boolean;
        last_modified: string | null;
        size: number;
    };
    timezones: string[];
}

export default function EnvPage({ envData, envMeta, timezones }: EnvPageProps) {
    const { data, setData, post, processing, errors, isDirty, reset } = useForm({
        app_name: envData.app_name || '',
        app_env: envData.app_env || 'production',
        app_debug: envData.app_debug,
        app_url: envData.app_url || '',
        app_timezone: envData.app_timezone || 'UTC',
        app_locale: envData.app_locale || 'en',
        log_level: envData.log_level || 'debug',
        session_lifetime: envData.session_lifetime || 120,
        session_driver: envData.session_driver || 'file',
        cache_store: envData.cache_store || 'file',
        queue_connection: envData.queue_connection || 'sync',
    });

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/system/env');
    };

    return (
        <>
            <Head title="Environment Configuration (.env) | System" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Environment Configuration"
                        description="Safely view and edit core environment variables, production settings, application name, debug mode, and runtime parameters."
                    />
                    <ToolbarActions>
                        <Badge
                            variant={envMeta.is_writable ? 'primary' : 'destructive'}
                            className="px-3 py-1 text-xs gap-1.5 font-semibold"
                        >
                            {envMeta.is_writable ? (
                                <>
                                    <ShieldCheck className="size-3.5" />
                                    .env Writable
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="size-3.5" />
                                    .env Read Only
                                </>
                            )}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="h-8.5 text-xs gap-1.5"
                        >
                            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-12 space-y-6">
                {/* Meta Header Banner */}
                <div className="p-4.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-xs">
                            <FileCode2 className="size-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-foreground">Active Configuration File (.env)</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-border/60 text-muted-foreground font-mono">
                                    {(envMeta.size / 1024).toFixed(2)} KB
                                </span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground truncate max-w-xl" title={envMeta.path}>
                                {envMeta.path}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 font-mono">
                        {envMeta.last_modified && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <span>Modified: {envMeta.last_modified}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
                    <Tabs defaultValue="app" className="w-full space-y-6">
                        <TabsList className="grid w-full grid-cols-2 max-w-md h-11 p-1 bg-muted/60 rounded-xl">
                            <TabsTrigger value="app" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                                <Globe className="size-4" />
                                App & Environment
                            </TabsTrigger>
                            <TabsTrigger value="runtime" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                                <Zap className="size-4" />
                                Runtime & Cache
                            </TabsTrigger>
                        </TabsList>

                        {/* ---------- TAB 1: APPLICATION & ENVIRONMENT ---------- */}
                        <TabsContent value="app" className="space-y-6 pt-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Card 1: Core Application Identity */}
                                <Card className="border-border/60 shadow-xs overflow-hidden">
                                    <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <Globe className="size-4 text-primary" />
                                            Application Identity & URLs
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">Configure app branding, public URL, and locale settings.</p>
                                    </div>
                                    <CardContent className="pt-4.5 space-y-4">
                                        {/* APP_NAME */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="app_name" className="text-xs font-bold text-foreground">
                                                    Application Name
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">APP_NAME</span>
                                            </div>
                                            <Input
                                                id="app_name"
                                                value={data.app_name}
                                                onChange={(e) => setData('app_name', e.target.value)}
                                                placeholder="e.g. My SaaS Platform"
                                                className="h-9.5 text-xs bg-background"
                                            />
                                            {errors.app_name && (
                                                <p className="text-xs text-destructive">{errors.app_name}</p>
                                            )}
                                        </div>

                                        {/* APP_URL */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="app_url" className="text-xs font-bold text-foreground">
                                                    Application Root URL
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">APP_URL</span>
                                            </div>
                                            <Input
                                                id="app_url"
                                                value={data.app_url}
                                                onChange={(e) => setData('app_url', e.target.value)}
                                                placeholder="https://app.yourdomain.com"
                                                className="h-9.5 text-xs font-mono bg-background"
                                            />
                                            <p className="text-[10px] text-muted-foreground">
                                                Used for generating absolute URLs in emails, notifications, and redirects.
                                            </p>
                                        </div>

                                        {/* APP_LOCALE */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="app_locale" className="text-xs font-bold text-foreground">
                                                    Default Language / Locale
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">APP_LOCALE</span>
                                            </div>
                                            <Select
                                                value={data.app_locale}
                                                onValueChange={(val) => setData('app_locale', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select locale" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English (en)</SelectItem>
                                                    <SelectItem value="es">Spanish (es)</SelectItem>
                                                    <SelectItem value="fr">French (fr)</SelectItem>
                                                    <SelectItem value="de">German (de)</SelectItem>
                                                    <SelectItem value="ar">Arabic (ar)</SelectItem>
                                                    <SelectItem value="zh">Chinese (zh)</SelectItem>
                                                    <SelectItem value="hi">Hindi (hi)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* APP_TIMEZONE */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="app_timezone" className="text-xs font-bold text-foreground">
                                                    Application Timezone
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">APP_TIMEZONE</span>
                                            </div>
                                            <Select
                                                value={data.app_timezone}
                                                onValueChange={(val) => setData('app_timezone', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs font-mono bg-background">
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                                                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</SelectItem>
                                                    <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                                                    <SelectItem value="America/Chicago">America/Chicago (CST/CDT)</SelectItem>
                                                    <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</SelectItem>
                                                    <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                                                    <SelectItem value="Europe/Paris">Europe/Paris (CET/CEST)</SelectItem>
                                                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST +4:00)</SelectItem>
                                                    <SelectItem value="Asia/Singapore">Asia/Singapore (SGT +8:00)</SelectItem>
                                                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</SelectItem>
                                                    <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 2: Environment & Debug Mode */}
                                <Card className="border-border/60 shadow-xs overflow-hidden">
                                    <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <ShieldCheck className="size-4 text-primary" />
                                            Environment & Debug Controls
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">Manage debug visibility, error reporting, and production status.</p>
                                    </div>
                                    <CardContent className="pt-4.5 space-y-4">
                                        {/* APP_ENV */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="app_env" className="text-xs font-bold text-foreground">
                                                    Environment Mode
                                                </Label>
                                                <Badge
                                                    variant={data.app_env === 'production' ? 'primary' : 'warning'}
                                                    className="text-[10px] uppercase font-bold"
                                                >
                                                    {data.app_env}
                                                </Badge>
                                            </div>
                                            <Select
                                                value={data.app_env}
                                                onValueChange={(val) => setData('app_env', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select environment" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="production">Production (Live Web Application)</SelectItem>
                                                    <SelectItem value="local">Local (Development & Testing)</SelectItem>
                                                    <SelectItem value="staging">Staging (Pre-production Server)</SelectItem>
                                                    <SelectItem value="testing">Testing (Automated Test Suite)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* APP_DEBUG */}
                                        <div className={`p-4 rounded-xl border transition-all ${
                                            data.app_debug
                                                ? 'border-amber-500/40 bg-amber-500/5'
                                                : 'border-border/60 bg-muted/20'
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs font-bold text-foreground cursor-pointer">
                                                            Debug Mode (APP_DEBUG)
                                                        </Label>
                                                        <Badge variant={data.app_debug ? 'warning' : 'outline'} className="text-[10px] font-bold">
                                                            {data.app_debug ? 'Debug ON' : 'Debug OFF'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                        When enabled, detailed stack traces & error messages are displayed.
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={Boolean(data.app_debug)}
                                                    onCheckedChange={(checked) => setData('app_debug', checked)}
                                                />
                                            </div>

                                            {data.app_debug && data.app_env === 'production' && (
                                                <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                                    <AlertTriangle className="size-4 shrink-0" />
                                                    <span><strong>Caution:</strong> Enabling APP_DEBUG in production can expose sensitive API keys and database credentials to visitors.</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* LOG_LEVEL */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="log_level" className="text-xs font-bold text-foreground">
                                                    System Log Level
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">LOG_LEVEL</span>
                                            </div>
                                            <Select
                                                value={data.log_level}
                                                onValueChange={(val) => setData('log_level', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select log level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="debug">Debug (All events & verbose traces)</SelectItem>
                                                    <SelectItem value="info">Info (Standard operations & notices)</SelectItem>
                                                    <SelectItem value="warning">Warning (Non-fatal warnings only)</SelectItem>
                                                    <SelectItem value="error">Error (Fatal exceptions & failures)</SelectItem>
                                                    <SelectItem value="critical">Critical (Critical emergency events only)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </TabsContent>

                        {/* ---------- TAB 2: RUNTIME, SESSIONS & CACHE ---------- */}
                        <TabsContent value="runtime" className="space-y-6 pt-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Card: Session Management */}
                                <Card className="border-border/60 shadow-xs overflow-hidden">
                                    <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <Clock className="size-4 text-primary" />
                                            Session Configuration
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">Session timeout and storage driver settings.</p>
                                    </div>
                                    <CardContent className="pt-4.5 space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="session_lifetime" className="text-xs font-bold text-foreground">
                                                    Session Lifetime (Minutes)
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">SESSION_LIFETIME</span>
                                            </div>
                                            <Input
                                                id="session_lifetime"
                                                type="number"
                                                min={1}
                                                max={525600}
                                                value={data.session_lifetime}
                                                onChange={(e) => setData('session_lifetime', Number(e.target.value))}
                                                className="h-9.5 text-xs font-mono bg-background"
                                            />
                                            <p className="text-[10px] text-muted-foreground">
                                                Default: 120 minutes (2 hours). Users will be logged out after this duration of inactivity.
                                            </p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="session_driver" className="text-xs font-bold text-foreground">
                                                    Session Storage Driver
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">SESSION_DRIVER</span>
                                            </div>
                                            <Select
                                                value={data.session_driver}
                                                onValueChange={(val) => setData('session_driver', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select driver" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="file">File (Storage folder)</SelectItem>
                                                    <SelectItem value="cookie">Cookie (Encrypted browser cookie)</SelectItem>
                                                    <SelectItem value="database">Database (Sessions table)</SelectItem>
                                                    <SelectItem value="redis">Redis (In-memory store)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card: Cache & Queue Drivers */}
                                <Card className="border-border/60 shadow-xs overflow-hidden">
                                    <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <Database className="size-4 text-primary" />
                                            Cache & Queue Drivers
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">Configure application caching and background queue execution.</p>
                                    </div>
                                    <CardContent className="pt-4.5 space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="cache_store" className="text-xs font-bold text-foreground">
                                                    Cache Default Store
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">CACHE_STORE</span>
                                            </div>
                                            <Select
                                                value={data.cache_store}
                                                onValueChange={(val) => setData('cache_store', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select cache store" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="file">File (storage/framework/cache)</SelectItem>
                                                    <SelectItem value="database">Database (Cache table)</SelectItem>
                                                    <SelectItem value="redis">Redis (High Performance)</SelectItem>
                                                    <SelectItem value="array">Array (Temporary in-memory)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="queue_connection" className="text-xs font-bold text-foreground">
                                                    Queue Connection
                                                </Label>
                                                <span className="text-[10px] text-muted-foreground font-mono">QUEUE_CONNECTION</span>
                                            </div>
                                            <Select
                                                value={data.queue_connection}
                                                onValueChange={(val) => setData('queue_connection', val)}
                                            >
                                                <SelectTrigger className="h-9.5 text-xs bg-background">
                                                    <SelectValue placeholder="Select queue driver" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sync">Sync (Execute jobs synchronously)</SelectItem>
                                                    <SelectItem value="database">Database (Background jobs table)</SelectItem>
                                                    <SelectItem value="redis">Redis (High Performance Queue)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Bottom Save Action Bar */}
                    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Info className="size-4 text-primary shrink-0" />
                            <span>Saving will update the <code>.env</code> file directly and clear the application config cache automatically.</span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {isDirty && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => reset()}
                                    className="h-9 text-xs"
                                >
                                    Reset Changes
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={processing || !envMeta.is_writable}
                                className="gap-2 px-6 h-9 font-semibold shrink-0 shadow-xs"
                            >
                                <Save className="size-4" />
                                {processing ? 'Saving Changes...' : 'Save Environment Config'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Container>
        </>
    );
}
