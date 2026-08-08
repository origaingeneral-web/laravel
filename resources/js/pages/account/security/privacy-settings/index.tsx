import { ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PanelProps = {
    className?: string;
    text?: string;
    limit?: number;
};

export function BlockList({ className, text, limit = 4 }: PanelProps) {
    return (
        <Card className={cn('h-full', className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldAlert
                        className="size-4 text-primary"
                        aria-hidden="true"
                    />
                    Block List
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {text ?? 'Manage users who cannot contact you.'}
                </p>
                <div className="text-xs font-medium text-muted-foreground">
                    Showing {limit} recent entries
                </div>
            </CardContent>
        </Card>
    );
}

export function ReportSettings({ className }: PanelProps) {
    return (
        <Card className={cn('h-full', className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal
                        className="size-4 text-primary"
                        aria-hidden="true"
                    />
                    Report Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Configure privacy and report preferences for your account.
                </p>
            </CardContent>
        </Card>
    );
}
