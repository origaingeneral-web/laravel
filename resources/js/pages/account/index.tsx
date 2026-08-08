import { Link } from '@inertiajs/react';
import { UserRound } from 'lucide-react';

export function PageNavbar() {
    return (
        <div className="border-b border-border bg-background">
            <div className="mx-auto flex min-h-14 w-full max-w-[1280px] items-center gap-3 px-4">
                <UserRound className="size-5 text-primary" aria-hidden="true" />
                <Link
                    href="/account/home/user-profile"
                    className="text-sm font-semibold text-foreground hover:text-primary"
                >
                    Account
                </Link>
            </div>
        </div>
    );
}
