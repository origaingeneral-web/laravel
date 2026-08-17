import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Server,
    Cpu,
    HardDrive,
    Database,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileCode,
    FolderCheck,
    FolderX,
    RefreshCw,
    Search,
    Copy,
    Check,
    Layers,
    Terminal,
    Info,
    Globe,
    Lock,
    Clock,
    Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ServerInfoProps {
    serverInfo: {
        php_version: string;
        laravel_version: string;
        os: string;
        os_family: string;
        architecture: string;
        web_server: string;
        server_ip: string;
        server_hostname: string;
        server_protocol: string;
        server_port: number | string;
        server_time: string;
        timezone: string;
        environment: string;
        debug_mode: boolean;
        https: boolean;
        db_driver: string;
        db_name: string;
        db_version: string;
        memory_usage: string;
        memory_peak: string;
        disk_total: string;
        disk_free: string;
        disk_used: string;
        disk_used_percent: number;
    };
    phpConfig: {
        loaded_ini: string;
        scanned_inis: string[];
        directives: Array<{
            directive: string;
            current: string;
            recommended: string;
            description: string;
        }>;
    };
    extensions: {
        critical: Array<{
            name: string;
            installed: boolean;
            version: string;
            required: boolean;
            description: string;
        }>;
        all: Array<{
            name: string;
            version: string;
        }>;
        total_count: number;
    };
    permissions: Array<{
        label: string;
        path: string;
        exists: boolean;
        is_writable: boolean;
        is_readable: boolean;
        is_link: boolean;
        permissions: string;
        required: string;
        status: 'ok' | 'warning' | 'missing';
    }>;
}

export default function ServerPage({
    serverInfo,
    phpConfig,
    extensions,
    permissions,
}: ServerInfoProps) {
    const [extensionSearch, setExtensionSearch] = useState('');
    const [directiveSearch, setDirectiveSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleCopyReport = () => {
        const report = `
=== SERVER DIAGNOSTIC REPORT ===
Generated at: ${new Date().toISOString()}
PHP Version: ${serverInfo.php_version}
Laravel Version: ${serverInfo.laravel_version}
OS: ${serverInfo.os} (${serverInfo.os_family})
Architecture: ${serverInfo.architecture}
Web Server: ${serverInfo.web_server}
Database: ${serverInfo.db_driver} (${serverInfo.db_version})
Environment: ${serverInfo.environment} (Debug: ${serverInfo.debug_mode ? 'ON' : 'OFF'})
Memory Usage: ${serverInfo.memory_usage} / Peak: ${serverInfo.memory_peak}
Disk Space: ${serverInfo.disk_used} used of ${serverInfo.disk_total} (${serverInfo.disk_used_percent}%)
Loaded php.ini: ${phpConfig.loaded_ini}
Loaded Extensions: ${extensions.total_count}
================================
        `.trim();

        navigator.clipboard.writeText(report);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Filter extensions
    const filteredAllExtensions = useMemo(() => {
        if (!extensionSearch) return extensions.all;
        const q = extensionSearch.toLowerCase();
        return extensions.all.filter(
            (e) => e.name.toLowerCase().includes(q) || e.version.toLowerCase().includes(q),
        );
    }, [extensions.all, extensionSearch]);

    // Filter directives
    const filteredDirectives = useMemo(() => {
        if (!directiveSearch) return phpConfig.directives;
        const q = directiveSearch.toLowerCase();
        return phpConfig.directives.filter(
            (d) => d.directive.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
        );
    }, [phpConfig.directives, directiveSearch]);

    // Permissions summary
    const allPermissionsValid = permissions.every((p) => p.status === 'ok');
    const allCriticalExtensionsValid = extensions.critical.every((e) => e.installed);

    return (
        <>
            <Head title="Server Information & Diagnostics | System" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Server Information"
                        description="Comprehensive server environment, PHP configuration, loaded extensions, and filesystem diagnostics."
                    />
                    <ToolbarActions>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyReport}
                            className="h-8.5 text-xs gap-1.5"
                        >
                            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                            {copied ? 'Copied Summary' : 'Copy Diagnostics'}
                        </Button>
                        <Button
                            variant="primary"
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
                {/* ==================== 4 TOP STATS / KPI CARDS ==================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: PHP Runtime */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Cpu className="size-3.5 text-blue-500" />
                                PHP Runtime
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                {serverInfo.environment}
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-xl font-bold tracking-tight text-foreground">
                                PHP {serverInfo.php_version}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Laravel v{serverInfo.laravel_version}
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Memory Usage */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Activity className="size-3.5 text-emerald-500" />
                                Memory Usage
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Live
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-xl font-bold tracking-tight text-foreground">
                                {serverInfo.memory_usage}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Peak: {serverInfo.memory_peak}
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Disk Space */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <HardDrive className="size-3.5 text-purple-500" />
                                Storage Disk
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                                {serverInfo.disk_used_percent}% Used
                            </span>
                        </div>
                        <div className="mt-2.5 space-y-1.5">
                            <Progress value={serverInfo.disk_used_percent} className="h-1.5" />
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                                <span>Used: {serverInfo.disk_used}</span>
                                <span>Free: {serverInfo.disk_free}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Database Server */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Database className="size-3.5 text-indigo-500" />
                                Database Server
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                {serverInfo.db_driver}
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-xl font-bold tracking-tight text-foreground truncate" title={serverInfo.db_name}>
                                {serverInfo.db_name}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-mono" title={serverInfo.db_version}>
                                {serverInfo.db_version}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================== MAIN TABS CONTAINER ==================== */}
                <Tabs defaultValue="server" className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl h-11 p-1 bg-muted/60 rounded-xl">
                        <TabsTrigger value="server" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <Server className="size-4" />
                            Server Info
                        </TabsTrigger>
                        <TabsTrigger value="php" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <FileCode className="size-4" />
                            PHP.ini Config
                        </TabsTrigger>
                        <TabsTrigger value="extensions" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <Layers className="size-4" />
                            Extensions
                            <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                                {extensions.total_count}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <FolderCheck className="size-4" />
                            Permissions
                            {!allPermissionsValid && (
                                <span className="size-2 rounded-full bg-amber-500" />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* ---------- TAB 1: SERVER INFORMATION ---------- */}
                    <TabsContent value="server" className="space-y-6 pt-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Section 1: System Environment & OS */}
                            <Card className="border-border/60 shadow-xs overflow-hidden">
                                <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <Server className="size-4 text-primary" />
                                        Operating System & Host
                                    </div>
                                </div>
                                <CardContent className="pt-2 divide-y divide-border/40 text-xs">
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Operating System:</span>
                                        <span className="font-semibold text-foreground font-mono">{serverInfo.os}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">OS Family:</span>
                                        <span className="font-semibold text-foreground">{serverInfo.os_family}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Architecture:</span>
                                        <span className="font-mono text-foreground font-semibold">{serverInfo.architecture}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Server Hostname:</span>
                                        <span className="font-mono font-medium text-foreground">{serverInfo.server_hostname}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Server IP Address:</span>
                                        <span className="font-mono text-foreground">{serverInfo.server_ip}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Server Port:</span>
                                        <span className="font-mono text-foreground">{serverInfo.server_port}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Web Server Software:</span>
                                        <span className="font-semibold text-foreground">{serverInfo.web_server}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">HTTP Protocol:</span>
                                        <span className="font-mono text-foreground">{serverInfo.server_protocol}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 2: Application & Runtime Specs */}
                            <Card className="border-border/60 shadow-xs overflow-hidden">
                                <div className="p-4.5 pb-3.5 border-b border-border/40 bg-muted/20">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <Globe className="size-4 text-primary" />
                                        Application & Framework Specs
                                    </div>
                                </div>
                                <CardContent className="pt-2 divide-y divide-border/40 text-xs">
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">PHP Version:</span>
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold">
                                            {serverInfo.php_version}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Laravel Framework:</span>
                                        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 font-bold">
                                            v{serverInfo.laravel_version}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Environment:</span>
                                        <span className="font-bold text-foreground uppercase">{serverInfo.environment}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Debug Mode:</span>
                                        <Badge variant={serverInfo.debug_mode ? 'warning' : 'outline'} className="text-[10px] font-semibold">
                                            {serverInfo.debug_mode ? 'Enabled (True)' : 'Disabled (False)'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">SSL / HTTPS Protocol:</span>
                                        <Badge variant={serverInfo.https ? 'primary' : 'outline'} className="text-[10px] font-semibold">
                                            {serverInfo.https ? 'Active (HTTPS)' : 'Inactive (HTTP)'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">System Timezone:</span>
                                        <span className="font-semibold text-foreground">{serverInfo.timezone}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Current Server Time:</span>
                                        <span className="font-mono text-foreground font-semibold">{serverInfo.server_time}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-muted-foreground font-medium">Database Name:</span>
                                        <span className="font-mono text-foreground font-bold">{serverInfo.db_name}</span>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </TabsContent>

                    {/* ---------- TAB 2: PHP.INI DIRECTIVES ---------- */}
                    <TabsContent value="php" className="space-y-6 pt-1">
                        {/* INI Path Card */}
                        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                    <FileCode className="size-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-foreground">Loaded Configuration File (php.ini)</span>
                                    <p className="text-xs font-mono text-muted-foreground break-all">
                                        {phpConfig.loaded_ini}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Directives Table */}
                        <Card className="border-border/60 shadow-xs overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Terminal className="size-4 text-primary" />
                                            Core PHP Directives & Limits
                                        </CardTitle>
                                        <CardDescription>
                                            Verify your server's memory, file upload, execution time, and runtime limits.
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full sm:w-64">
                                        <Search className="size-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search directive..."
                                            value={directiveSearch}
                                            onChange={(e) => setDirectiveSearch(e.target.value)}
                                            className="ps-8 h-8 text-xs bg-background"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-5 py-3">Directive</th>
                                            <th className="px-5 py-3">Current Value</th>
                                            <th className="px-5 py-3">Recommended</th>
                                            <th className="px-5 py-3">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {filteredDirectives.map((dir) => (
                                            <tr key={dir.directive} className="hover:bg-muted/15 transition-colors">
                                                <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                                                    {dir.directive}
                                                </td>
                                                <td className="px-5 py-3.5 font-mono">
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                                        {dir.current}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 font-mono text-muted-foreground font-medium">
                                                    {dir.recommended}
                                                </td>
                                                <td className="px-5 py-3.5 text-muted-foreground">
                                                    {dir.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* ---------- TAB 3: EXTENSIONS INFORMATION ---------- */}
                    <TabsContent value="extensions" className="space-y-6 pt-1">
                        {/* Critical Extensions Header */}
                        <Card className="border-border/60 shadow-xs overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-emerald-500" />
                                        Critical Required Extensions
                                    </CardTitle>
                                    <Badge variant={allCriticalExtensionsValid ? 'primary' : 'destructive'} className="text-[10px] font-bold">
                                        {allCriticalExtensionsValid ? 'All Critical Passed' : 'Missing Dependencies'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {extensions.critical.map((ext) => (
                                        <div
                                            key={ext.name}
                                            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                                                ext.installed
                                                    ? 'border-emerald-500/20 bg-emerald-500/5'
                                                    : 'border-destructive/30 bg-destructive/5'
                                            }`}
                                        >
                                            {ext.installed ? (
                                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                                            )}
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-xs text-foreground truncate">{ext.name}</span>
                                                    {ext.required && (
                                                        <span className="text-[9px] font-bold text-red-500">*</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground truncate" title={ext.description}>
                                                    {ext.description}
                                                </p>
                                                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {ext.version}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* All Loaded Extensions Grid */}
                        <Card className="border-border/60 shadow-xs overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Layers className="size-4 text-primary" />
                                            All Loaded Extensions ({extensions.total_count})
                                        </CardTitle>
                                        <CardDescription>
                                            Full list of all active modules and libraries in the PHP runtime.
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full sm:w-64">
                                        <Search className="size-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Filter extensions..."
                                            value={extensionSearch}
                                            onChange={(e) => setExtensionSearch(e.target.value)}
                                            className="ps-8 h-8 text-xs bg-background"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                    {filteredAllExtensions.map((ext) => (
                                        <div
                                            key={ext.name}
                                            className="p-2.5 rounded-lg border border-border/50 bg-muted/20 flex flex-col justify-between space-y-1 hover:border-primary/40 transition-colors"
                                        >
                                            <span className="font-mono font-bold text-xs text-foreground truncate" title={ext.name}>
                                                {ext.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono truncate" title={ext.version}>
                                                {ext.version}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ---------- TAB 4: FILESYSTEM PERMISSIONS ---------- */}
                    <TabsContent value="permissions" className="space-y-6 pt-1">
                        <Card className="border-border/60 shadow-xs overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <FolderCheck className="size-4 text-primary" />
                                            Filesystem Directory & Permissions Audit
                                        </CardTitle>
                                        <CardDescription>
                                            Ensure required framework storage, logs, and cache paths are writable by the web server process.
                                        </CardDescription>
                                    </div>
                                    <Badge variant={allPermissionsValid ? 'primary' : 'warning'} className="text-[10px] font-bold">
                                        {allPermissionsValid ? 'All Permissions Passed' : 'Permission Issues Detected'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-5 py-3">Directory / File</th>
                                            <th className="px-5 py-3">System Path</th>
                                            <th className="px-5 py-3">Current Perms</th>
                                            <th className="px-5 py-3">Required Rule</th>
                                            <th className="px-5 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {permissions.map((p) => {
                                            const isOk = p.status === 'ok';
                                            return (
                                                <tr key={p.label} className="hover:bg-muted/15 transition-colors">
                                                    <td className="px-5 py-3.5 font-bold text-foreground">
                                                        <div className="flex items-center gap-2">
                                                            {isOk ? (
                                                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                                            ) : (
                                                                <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                                                            )}
                                                            <span>{p.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 font-mono text-[11px] text-muted-foreground break-all max-w-xs">
                                                        {p.path}
                                                    </td>
                                                    <td className="px-5 py-3.5 font-mono font-bold">
                                                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                                                            isOk
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-amber-500/10 text-amber-600'
                                                        }`}>
                                                            {p.permissions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-muted-foreground">
                                                        {p.required}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <Badge
                                                            variant={isOk ? 'primary' : 'warning'}
                                                            className="text-[10px] font-semibold"
                                                        >
                                                            {p.is_writable ? 'Writable' : p.exists ? 'Read Only' : 'Missing'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Container>
        </>
    );
}
