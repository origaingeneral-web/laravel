import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Database,
    Download,
    Trash2,
    HardDrive,
    Building2,
    AlertTriangle,
    ShieldCheck,
    RefreshCw,
    Search,
    FileCode,
    FileArchive,
    CheckCircle2,
    Calendar,
    Layers,
    Lock,
    X,
    Info,
    Sparkles,
    ShieldAlert,
    ArrowDownToLine,
    Clock,
    FileJson,
    Flame,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CompanyItem {
    id: number;
    company_name: string;
    company_code: string;
    email: string;
    status: number;
}

interface BackupFileItem {
    filename: string;
    type: 'full' | 'company' | 'auto_purge';
    size: string;
    size_raw: number;
    created_at: string;
    download_url: string;
}

interface DbStats {
    driver: string;
    database: string;
    tables_count: number;
    backups_count: number;
    backup_dir: string;
}

interface DatabasePageProps {
    companies: CompanyItem[];
    backups: BackupFileItem[];
    dbStats: DbStats;
}

export default function DatabasePage({ companies, backups, dbStats }: DatabasePageProps) {
    const [selectedCompanyForBackup, setSelectedCompanyForBackup] = useState<string>('');
    const [selectedCompanyForPurge, setSelectedCompanyForPurge] = useState<string>('');
    const [purgeConfirmationText, setPurgeConfirmationText] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [backupTypeFilter, setBackupTypeFilter] = useState<string>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dialog state for purging
    const [isPurgeDialogOpen, setIsPurgeDialogOpen] = useState<boolean>(false);
    const [deleteBackupTarget, setDeleteBackupTarget] = useState<string | null>(null);

    // Form handlers
    const fullBackupForm = useForm({});
    const companyBackupForm = useForm({
        company_id: '',
    });
    const purgeForm = useForm({
        company_id: '',
        confirmation: '',
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleCreateFullBackup = (e: React.FormEvent) => {
        e.preventDefault();
        fullBackupForm.post('/admin/system/database/full-backup');
    };

    const handleCreateCompanyBackup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyForBackup) return;
        companyBackupForm.setData('company_id', selectedCompanyForBackup);
        companyBackupForm.post('/admin/system/database/company-backup');
    };

    const handleConfirmPurge = () => {
        if (!selectedCompanyForPurge || purgeConfirmationText !== 'PURGE') return;
        purgeForm.setData({
            company_id: selectedCompanyForPurge,
            confirmation: 'PURGE',
        });
        purgeForm.post('/admin/system/database/purge-company', {
            onSuccess: () => {
                setIsPurgeDialogOpen(false);
                setSelectedCompanyForPurge('');
                setPurgeConfirmationText('');
            },
        });
    };

    const handleDeleteBackup = (filename: string) => {
        router.delete(`/admin/system/database/delete/${filename}`, {
            onSuccess: () => setDeleteBackupTarget(null),
        });
    };

    const selectedBackupCompanyObj = companies.find((c) => String(c.id) === selectedCompanyForBackup);
    const selectedPurgeCompanyObj = companies.find((c) => String(c.id) === selectedCompanyForPurge);

    // Filter backups
    const filteredBackups = useMemo(() => {
        return backups.filter((b) => {
            const matchesSearch = b.filename.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = backupTypeFilter === 'all' || b.type === backupTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [backups, searchQuery, backupTypeFilter]);

    return (
        <>
            <Head title="Database & Backups | System Management" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Database & Backup Management"
                        description="Generate full SQL database dumps, export company-wise data backups, and perform safe tenant resets with mandatory auto-backups."
                    />
                    <ToolbarActions>
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
                {/* ==================== 4 TOP KPI STATS ==================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Database Engine */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Database className="size-3.5 text-blue-500" />
                                Database Engine
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                {dbStats.driver}
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-xl font-bold tracking-tight text-foreground truncate" title={dbStats.database}>
                                {dbStats.database}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Primary connection
                            </p>
                        </div>
                    </div>

                    {/* Database Tables */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Layers className="size-3.5 text-indigo-500" />
                                Schema Tables
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                Active
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {dbStats.tables_count}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Managed relational tables
                            </p>
                        </div>
                    </div>

                    {/* Total Companies */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Building2 className="size-3.5 text-emerald-500" />
                                Tenant Companies
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Registered
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {companies.length}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Available for export & purge
                            </p>
                        </div>
                    </div>

                    {/* Total Backups */}
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <FileArchive className="size-3.5 text-purple-500" />
                                Backup Archives
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                                Stored
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {backups.length}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                In <code>storage/app/backups/</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================== MAIN TABS CONTAINER ==================== */}
                <Tabs defaultValue="backup" className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-xl h-11 p-1 bg-muted/60 rounded-xl">
                        <TabsTrigger value="backup" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <ArrowDownToLine className="size-4" />
                            Create Backups
                        </TabsTrigger>
                        <TabsTrigger value="purge" className="flex items-center gap-2 text-xs font-semibold rounded-lg text-destructive data-[state=active]:text-destructive">
                            <Trash2 className="size-4" />
                            Safe Company Purge
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
                            <FileArchive className="size-4" />
                            Backup Archives
                            <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                                {backups.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* ---------- TAB 1: CREATE BACKUPS ---------- */}
                    <TabsContent value="backup" className="space-y-6 pt-1">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Option 1: Full Database SQL Backup */}
                            <Card className="border-border/60 shadow-xs flex flex-col justify-between overflow-hidden">
                                <div>
                                    <div className="p-5 pb-4 border-b border-border/40 bg-gradient-to-r from-blue-500/5 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                                                    <Database className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-foreground">1. Full Database Dump (.SQL)</h3>
                                                    <p className="text-xs text-muted-foreground">Export all {dbStats.tables_count} tables and complete database structure</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-bold">
                                                Complete
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="pt-5 space-y-4">
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Generates a portable SQL dump containing full table definitions (<code>CREATE TABLE</code>) and insert statements (<code>INSERT INTO</code>) for all database rows.
                                        </p>

                                        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-2.5 text-xs">
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                <span>Includes all master tables, companies, users, settings & logs</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                <span>Chunked record streams with foreign-key safety checks</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                <span>Instantly stored in local storage and ready for download</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="p-5 pt-0">
                                    <form onSubmit={handleCreateFullBackup}>
                                        <Button
                                            type="submit"
                                            disabled={fullBackupForm.processing}
                                            className="w-full gap-2 font-semibold h-10 shadow-xs"
                                        >
                                            <Download className="size-4" />
                                            {fullBackupForm.processing ? 'Exporting SQL Backup...' : 'Generate Full DB Backup (.sql)'}
                                        </Button>
                                    </form>
                                </div>
                            </Card>

                            {/* Option 2: Company-Wise Backup */}
                            <Card className="border-border/60 shadow-xs flex flex-col justify-between overflow-hidden">
                                <div>
                                    <div className="p-5 pb-4 border-b border-border/40 bg-gradient-to-r from-emerald-500/5 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                                                    <Building2 className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-foreground">2. Company-Wise Data Backup (.JSON)</h3>
                                                    <p className="text-xs text-muted-foreground">Export isolated tenant records for a selected company</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                                                Tenant Export
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="pt-5 space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="company_backup_select" className="text-xs font-bold">
                                                Select Company to Export
                                            </Label>
                                            <Select
                                                value={selectedCompanyForBackup}
                                                onValueChange={(val) => {
                                                    setSelectedCompanyForBackup(val);
                                                    companyBackupForm.setData('company_id', val);
                                                }}
                                            >
                                                <SelectTrigger id="company_backup_select" className="h-9.5 text-xs">
                                                    <SelectValue placeholder="Choose a company..." />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {companies.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>
                                                            <div className="flex items-center justify-between gap-3 w-full">
                                                                <span className="font-semibold">{c.company_name}</span>
                                                                <span className="text-[10px] font-mono text-muted-foreground">({c.company_code || `ID #${c.id}`})</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedBackupCompanyObj && (
                                            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-foreground">{selectedBackupCompanyObj.company_name}</span>
                                                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">{selectedBackupCompanyObj.company_code}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">{selectedBackupCompanyObj.email}</p>
                                            </div>
                                        )}

                                        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-1.5 text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">Tables included in export:</span>
                                            <p className="text-[11px] leading-relaxed">
                                                Company Profile, Staff Users, Payments, Subscriptions, Credits & Logs, Feature requests, Communication logs, and Tokens.
                                            </p>
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="p-5 pt-0">
                                    <form onSubmit={handleCreateCompanyBackup}>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={!selectedCompanyForBackup || companyBackupForm.processing}
                                            className="w-full gap-2 font-semibold h-10 border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                                        >
                                            <Download className="size-4" />
                                            {companyBackupForm.processing ? 'Exporting Company Data...' : 'Export Company Backup (.json)'}
                                        </Button>
                                    </form>
                                </div>
                            </Card>

                        </div>
                    </TabsContent>

                    {/* ---------- TAB 2: SAFE COMPANY DATA PURGE ---------- */}
                    <TabsContent value="purge" className="space-y-6 pt-1">
                        <Card className="border-destructive/30 shadow-xs bg-destructive/[0.02] overflow-hidden">
                            <div className="p-5 pb-4 border-b border-destructive/20 bg-gradient-to-r from-destructive/10 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-9 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center font-bold">
                                            <Trash2 className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-destructive">Safe Company Data Reset & Purge</h3>
                                            <p className="text-xs text-muted-foreground">Delete auxiliary company activity while preserving the admin panel company record</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="text-[10px] font-bold">
                                        Auto-Backup Enforced
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="pt-6 space-y-6">
                                {/* Rule & Guarantee Notice */}
                                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                                        <ShieldCheck className="size-4 shrink-0" />
                                        <span>Mandatory Pre-Purge Safety Guarantee</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Before any records are deleted, the system will <strong>automatically generate a full JSON backup</strong> of the company's data and verify it on disk. If backup creation fails, the purge is immediately aborted for your safety.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                                        <div className="p-3 rounded-lg bg-background border border-emerald-500/30">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                <CheckCircle2 className="size-4" />
                                                Preserved on Admin Panel:
                                            </span>
                                            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                                                The master company record in <code>companies</code> table (Company Name, Code, Email, Mobile, Address, Status & Settings) remains intact.
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-background border border-destructive/30">
                                            <span className="font-bold text-destructive flex items-center gap-1.5">
                                                <Trash2 className="size-4" />
                                                Cleared & Purged:
                                            </span>
                                            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                                                Payments, Subscriptions, Credit Logs, Staff user accounts, Notifications, and Communication logs belonging to this company.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Selection for Purge */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_purge_select" className="text-xs font-bold text-foreground">
                                            Select Company to Purge / Reset
                                        </Label>
                                        <Select
                                            value={selectedCompanyForPurge}
                                            onValueChange={(val) => setSelectedCompanyForPurge(val)}
                                        >
                                            <SelectTrigger id="company_purge_select" className="h-10 text-xs">
                                                <SelectValue placeholder="Choose company to reset..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {companies.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        <div className="flex items-center justify-between gap-3 w-full">
                                                            <span className="font-bold">{c.company_name}</span>
                                                            <span className="text-[10px] font-mono text-muted-foreground">({c.company_code || `ID #${c.id}`})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={!selectedCompanyForPurge}
                                            onClick={() => {
                                                setPurgeConfirmationText('');
                                                setIsPurgeDialogOpen(true);
                                            }}
                                            className="w-full gap-2 font-bold h-10 shadow-xs"
                                        >
                                            <Trash2 className="size-4" />
                                            Proceed to Purge Company Data...
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ---------- TAB 3: BACKUP HISTORY & ARCHIVES ---------- */}
                    <TabsContent value="history" className="space-y-6 pt-1">
                        <Card className="border-border/60 shadow-xs overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <FileArchive className="size-4 text-primary" />
                                            Stored Backup Archives ({filteredBackups.length})
                                        </CardTitle>
                                        <CardDescription>
                                            Download or remove previous database and company backup archives.
                                        </CardDescription>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <Select value={backupTypeFilter} onValueChange={setBackupTypeFilter}>
                                            <SelectTrigger className="h-8 text-xs w-32 bg-background">
                                                <SelectValue placeholder="Filter type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Backups</SelectItem>
                                                <SelectItem value="full">Full DB (.sql)</SelectItem>
                                                <SelectItem value="company">Company (.json)</SelectItem>
                                                <SelectItem value="auto_purge">Auto-Purge</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="relative w-48">
                                            <Search className="size-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search file..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="ps-8 h-8 text-xs bg-background"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-5 py-3">Backup File</th>
                                            <th className="px-5 py-3">Type</th>
                                            <th className="px-5 py-3">Size</th>
                                            <th className="px-5 py-3">Created At</th>
                                            <th className="px-5 py-3 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {filteredBackups.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                                                    <FileArchive className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                                                    <p className="font-semibold text-foreground text-xs">No backup archives found</p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">Use the "Create Backups" tab above to generate your first backup.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBackups.map((item) => {
                                                let typeBadge = (
                                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-semibold">
                                                        Full DB (.sql)
                                                    </Badge>
                                                );
                                                if (item.type === 'company') {
                                                    typeBadge = (
                                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold">
                                                            Company (.json)
                                                        </Badge>
                                                    );
                                                } else if (item.type === 'auto_purge') {
                                                    typeBadge = (
                                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-semibold">
                                                            Auto Purge
                                                        </Badge>
                                                    );
                                                }

                                                return (
                                                    <tr key={item.filename} className="hover:bg-muted/15 transition-colors">
                                                        <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                                                            <div className="flex items-center gap-2.5">
                                                                {item.type === 'full' ? (
                                                                    <FileCode className="size-4 text-blue-500 shrink-0" />
                                                                ) : (
                                                                    <FileJson className="size-4 text-emerald-500 shrink-0" />
                                                                )}
                                                                <span className="truncate max-w-sm" title={item.filename}>{item.filename}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            {typeBadge}
                                                        </td>
                                                        <td className="px-5 py-3.5 font-mono text-muted-foreground font-medium">
                                                            {item.size}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-muted-foreground font-mono text-[11px]">
                                                            {item.created_at}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-end">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <a
                                                                    href={item.download_url}
                                                                    download
                                                                    className="inline-flex items-center gap-1.5 h-7.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted text-foreground transition-colors shadow-2xs"
                                                                >
                                                                    <Download className="size-3.5 text-primary" />
                                                                    Download
                                                                </a>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setDeleteBackupTarget(item.filename)}
                                                                    className="h-7.5 size-7.5 p-0 text-destructive hover:bg-destructive/10"
                                                                    title="Delete Backup"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Container>

            {/* ==================== PURGE CONFIRMATION DIALOG ==================== */}
            <AlertDialog open={isPurgeDialogOpen} onOpenChange={setIsPurgeDialogOpen}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <div className="size-11 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-1.5">
                            <AlertTriangle className="size-6" />
                        </div>
                        <AlertDialogTitle className="text-base font-bold text-destructive">
                            Confirm Data Reset for "{selectedPurgeCompanyObj?.company_name}"
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-foreground space-y-2.5 pt-1">
                            <p>
                                You are about to purge all transactions, subscriptions, user staff accounts, and logs for <strong>{selectedPurgeCompanyObj?.company_name}</strong>.
                            </p>
                            <div className="space-y-1.5">
                                <p className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                                    ✓ The main company profile on the admin panel will NOT be deleted.
                                </p>
                                <p className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-medium">
                                    ✓ An automatic JSON backup will be created and saved before deletion.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Label htmlFor="purge_verify_input" className="text-xs font-bold text-foreground">
                                    Type <span className="font-mono text-destructive">PURGE</span> below to confirm:
                                </Label>
                                <Input
                                    id="purge_verify_input"
                                    value={purgeConfirmationText}
                                    onChange={(e) => setPurgeConfirmationText(e.target.value.toUpperCase())}
                                    placeholder="Type PURGE"
                                    className="h-9 text-xs font-mono mt-1.5 uppercase font-bold"
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-3">
                        <AlertDialogCancel className="h-8.5 text-xs">Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={purgeConfirmationText !== 'PURGE' || purgeForm.processing}
                            onClick={handleConfirmPurge}
                            className="h-8.5 text-xs font-bold"
                        >
                            {purgeForm.processing ? 'Backing up & Purging...' : 'I Understand, Backup & Purge'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ==================== DELETE BACKUP FILE CONFIRMATION DIALOG ==================== */}
            <AlertDialog open={Boolean(deleteBackupTarget)} onOpenChange={(open) => !open && setDeleteBackupTarget(null)}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-bold text-destructive">
                            Delete Backup File?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
                            Are you sure you want to permanently delete backup archive: <code className="block p-2 mt-1.5 rounded bg-muted font-mono break-all">{deleteBackupTarget}</code>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-2">
                        <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBackupTarget && handleDeleteBackup(deleteBackupTarget)}
                            className="h-8 text-xs font-semibold"
                        >
                            Delete Backup File
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
