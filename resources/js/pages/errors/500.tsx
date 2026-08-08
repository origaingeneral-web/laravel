import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';

export default function ServerErrorPage() {
    return (
        <>
            <Head title="500 - Server Error" />

            <div className="mb-10">
                <img
                    src={toAbsoluteUrl('/media/illustrations/20.svg')}
                    className="max-h-[160px] dark:hidden"
                    alt="Server error"
                />
                <img
                    src={toAbsoluteUrl('/media/illustrations/20-dark.svg')}
                    className="hidden max-h-[160px] dark:block"
                    alt="Server error"
                />
            </div>

            <Badge variant="destructive" appearance="outline" className="mb-3">
                500 Error
            </Badge>

            <h1 className="mb-2 text-center text-2xl font-semibold text-mono">
                Internal Server Error
            </h1>

            <div className="mb-10 text-center text-base text-secondary-foreground">
                Server error occurred. Please try again later or&nbsp;
                <a
                    href="mailto:support@example.com"
                    className="hover:text-primary-active font-medium text-primary"
                >
                    Contact Us
                </a>
                &nbsp;for assistance.
            </div>

            <Button asChild>
                <a href="/dashboard">Back to Home</a>
            </Button>
        </>
    );
}
