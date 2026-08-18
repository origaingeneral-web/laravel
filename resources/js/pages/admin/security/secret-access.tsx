import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ShieldAlert,
    KeyRound,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
    Sliders,
    Server,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SecretAccess({ intended }: { intended?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        secret_password: '',
        intended: intended || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/secret-access/verify');
    };

    return (
        <>
            <Head title="Super Admin Security Verification | Admin" />

            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    {/* Security Card */}
                    <Card className="border border-border/70 shadow-sm rounded-2xl bg-card">
                        <CardHeader className="flex flex-col items-center justify-center text-center pb-3 pt-6 border-b border-border/40">
                            <CardTitle className="text-lg font-bold text-center text-foreground">
                                Security Verification
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 pt-4 space-y-6">
                            {/* Security Notice */}
                            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2 font-semibold text-foreground">
                                    <ShieldAlert className="size-4 text-amber-500 shrink-0" />
                                    <span>Continuous Session Protection</span>
                                </div>
                                <p className="leading-relaxed text-[11px]">
                                    Once verified, you can browse all <strong>Settings</strong> & <strong>System</strong> pages continuously. Visiting any other menu or closing the browser will immediately lock access.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="secret_password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Secret Password
                                        </Label>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="secret_password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.secret_password}
                                            onChange={(e) => setData('secret_password', e.target.value)}
                                            placeholder="Enter secret password..."
                                            autoFocus
                                            className={`h-11 pr-10 rounded-xl font-mono text-sm ${errors.secret_password ? 'border-destructive focus-visible:ring-destructive' : ''
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>

                                    {errors.secret_password && (
                                        <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1.5">
                                            <AlertCircle className="size-3.5" />
                                            {errors.secret_password}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.secret_password.trim()}
                                        className="w-full h-11 rounded-xl gap-2 font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        {processing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Unlock className="size-4" />
                                        )}
                                        Verify & Unlock Access
                                    </Button>

                                    <Button asChild variant="outline" className="w-full h-10 rounded-xl gap-2 text-xs">
                                        <Link href="/admin/dashboard">
                                            <ArrowLeft className="size-3.5" />
                                            Return to Dashboard
                                        </Link>
                                    </Button>
                                </div>
                            </form>

                            {/* Help note */}
                            <div className="pt-2 text-center">
                                <p className="text-[11px] text-muted-foreground">
                                    Default passcode: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">secret123</code>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
