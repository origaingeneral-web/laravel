import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <div className="space-y-6 text-center">
                <div className="rounded-2xl border border-border bg-muted/40 p-6">
                    <h2 className="text-lg font-semibold">Registration is invite-only</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Public account registration is disabled. Please ask an administrator to create your account.
                    </p>
                </div>
                <TextLink href={login()}>Return to login</TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
