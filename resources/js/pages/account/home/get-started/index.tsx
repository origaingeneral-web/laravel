import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AccountGetStartedContent() {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <h2 className="text-lg font-semibold">Account setup</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review your profile details and keep your account
                        information up to date.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
