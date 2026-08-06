import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import TextLink from '@/components/text-link';
import { Icons } from '@/components/common/icons';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <>
            <Head title="Log in" />

            <div className="text-center space-y-1.5 pb-5">
                <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back! Log in with your credentials.
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="block w-full space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <Alert appearance="light" size="sm">
                            <AlertIcon>
                                <AlertCircle className="text-primary" />
                            </AlertIcon>
                            <AlertTitle className="text-accent-foreground">
                                Use <strong>demo@kt.com</strong> username and{' '}
                                <strong>demo123</strong> password for demo access.
                            </AlertTitle>
                        </Alert>

                        <div className="flex flex-col gap-3.5">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Icons.googleColorful className="size-5!" /> Sign in with Google
                            </Button>
                        </div>

                        <div className="relative py-1.5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">or</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    type={passwordVisible ? 'text' : 'password'}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                >
                                    {passwordVisible ? (
                                        <EyeOff className="size-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="size-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>
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

                        <Button
                            type="submit"
                            className="w-full mt-4"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Spinner className="size-4 animate-spin" /> Loading...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
