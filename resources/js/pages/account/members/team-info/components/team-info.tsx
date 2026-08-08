import { UsersRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TeamInfo() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UsersRound
                        className="size-4 text-primary"
                        aria-hidden="true"
                    />
                    Team Info
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    View team membership, roles, and basic collaboration
                    details.
                </p>
            </CardContent>
        </Card>
    );
}
