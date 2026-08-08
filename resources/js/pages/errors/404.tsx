import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { toAbsoluteUrl } from '@/lib/helpers';

export default function NotFoundPage() {
    return (
        <>
            <Head title="404 - Page Not Found" />

            <div className="mb-10">
                <img
                    src={toAbsoluteUrl('/media/illustrations/19.svg')}
                    className="max-h-[160px] dark:hidden"
                    alt="Page not found"
                />
                <img
                    src={toAbsoluteUrl('/media/illustrations/19-dark.svg')}
                    className="hidden max-h-[160px] dark:block"
                    alt="Page not found"
                />
            </div>

            <Badge variant="primary" appearance="outline" className="mb-3">
                404 Error
            </Badge>

            <h1 className="mb-2 text-center text-2xl font-semibold text-mono">
                We have lost this page
            </h1>

            <div className="mb-10 text-center text-base text-secondary-foreground">
                The requested page is missing. Check the URL or&nbsp;
                <a
                    href="/dashboard"
                    className="hover:text-primary-active font-medium text-primary"
                >
                    Return Home
                </a>
                .
            </div>
        </>
    );
}
