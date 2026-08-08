import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function AdminLogin({
    status,
    canResetPassword = false,
}: Props) {
    return (
        <>
            <Head title="Super Admin Login" />

            <style>
                {`
                    .admin-classic-bg {
                        background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-10.png')}');
                    }
                    .dark .admin-classic-bg {
                        background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-10-dark.png')}');
                    }
                `}
            </style>

            <main className="admin-classic-bg flex min-h-dvh grow flex-col items-center justify-center bg-background bg-center bg-no-repeat px-5 py-8">
                <div className="mb-5">
                    <a href="/" aria-label="Home">
                        <AppLogoIcon className="h-[35px] w-auto fill-primary" />
                    </a>
                </div>

                <Card className="w-full max-w-[400px]">
                    <CardContent className="p-6">
                        <div className="block w-full space-y-5">
                            <div className="space-y-1 pb-3 text-center">
                                <div className="mb-3 flex justify-center">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-[0.14em] text-primary uppercase">
                                        <ShieldCheck
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        Super Admin
                                    </span>
                                </div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Sign In
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Welcome back! Log in with your admin
                                    credentials.
                                </p>
                            </div>

                            {status && (
                                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <Form
                                action="/admin/login"
                                method="post"
                                resetOnSuccess={['password']}
                                className="space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="Your email"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-2.5">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-sm font-semibold text-foreground hover:text-primary"
                                                        tabIndex={5}
                                                    >
                                                        Forgot Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Your password"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                />
                                                <Label
                                                    htmlFor="remember"
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    Remember me
                                                </Label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            Sign In
                                        </Button>

                                        <div className="text-center text-sm text-muted-foreground">
                                            Restricted to{' '}
                                            <span className="font-semibold text-foreground">
                                                Super Admin
                                            </span>{' '}
                                            users only.
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
