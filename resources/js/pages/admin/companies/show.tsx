import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Users, Calendar, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Show({ company }: any) {
    return (
        <>
            <Head title={`${company.company_name} | Admin`} />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title={company.company_name}
                        description={`Company Code: ${company.company_code}`}
                    />
                    <ToolbarActions>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/companies">
                                <ArrowLeft className="size-4" />
                                Back to Companies
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10 space-y-6">
                {/* Company Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-1 md:col-span-2 shadow-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="size-5 text-primary" />
                                Company Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Company Name</p>
                                <p className="font-semibold">{company.company_name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${company.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {company.status === 1 ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                                    {company.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1.5"><Mail className="size-4" /> Email</p>
                                <p>{company.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1.5"><Phone className="size-4" /> Mobile</p>
                                <p>{company.mobile}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1.5"><MapPin className="size-4" /> Address</p>
                                <p>{company.address || 'No address provided.'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="size-5 text-primary" />
                                Owner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Owner Name</p>
                                <p className="font-semibold">{company.owner_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Owner Mobile</p>
                                <p>{company.owner_mobile || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscriptions, Plans & Usage */}
                <div>
                    <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                        <ShieldCheck className="size-6 text-primary" />
                        Subscriptions & Usage
                    </h2>
                    
                    {company.products && company.products.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {company.products.map((sub: any) => {
                                const usagePercentage = sub.staff_limit > 0 ? Math.min(100, Math.round((sub.usage / sub.staff_limit) * 100)) : 0;
                                const isNearLimit = usagePercentage >= 90;
                                
                                return (
                                    <Card key={sub.subscription_id} className="shadow-md border-border/60 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${sub.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl">{sub.name}</CardTitle>
                                                    <CardDescription className="mt-1 font-medium text-primary/80">
                                                        Plan: {sub.plan_name}
                                                    </CardDescription>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Usage Progress */}
                                            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-border/50">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-sm font-medium flex items-center gap-1.5">
                                                        <Users className="size-4 text-muted-foreground" /> 
                                                        User Usage
                                                    </p>
                                                    <p className="text-sm font-bold">
                                                        {sub.usage} / {sub.staff_limit}
                                                    </p>
                                                </div>
                                                <Progress value={usagePercentage} className={`h-2.5 ${isNearLimit ? 'bg-red-100 [&>div]:bg-red-500' : ''}`} />
                                                <p className="text-xs text-muted-foreground mt-2 text-right">
                                                    {usagePercentage}% capacity used
                                                </p>
                                            </div>

                                            {/* Features List */}
                                            {sub.features && sub.features.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold mb-3">Included Features</p>
                                                    <ul className="grid grid-cols-2 gap-2">
                                                        {sub.features.map((feature: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                                                                <span className="leading-tight">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t py-3 text-xs text-muted-foreground flex justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                Started: {new Date(sub.starts_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                Expires: {new Date(sub.expires_at).toLocaleDateString()}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="shadow-sm border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <ShieldCheck className="size-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No Active Subscriptions</h3>
                                <p className="text-muted-foreground mt-1 max-w-sm">
                                    This company does not have any active product subscriptions or plans yet.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </Container>
        </>
    );
}
