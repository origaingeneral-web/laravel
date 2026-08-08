import { useState } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/common/container';

export function NetworkError() {
    const [retryMessage, setRetryMessage] = useState('');

    const handleRetry = () => {
        if (!navigator.onLine) {
            setRetryMessage(
                'Still offline. Reconnect to the internet, then try again.',
            );

            return;
        }

        window.location.reload();
    };

    return (
        <Container>
            <div className="flex min-h-[calc(100vh-var(--header-height)-8rem)] items-center justify-center py-10">
                <Card className="w-full max-w-2xl">
                    <CardContent className="p-8 text-center sm:p-12">
                        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                            <WifiOff className="size-8" aria-hidden="true" />
                        </div>

                        <div className="mb-2 text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                            Network Connection Failed
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-mono">
                            You are offline
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm text-secondary-foreground">
                            We could not reach the server. Check your internet
                            connection, then retry the dashboard.
                        </p>

                        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                            <Button variant="outline" onClick={handleRetry}>
                                <RefreshCw className="size-4" />
                                Retry
                            </Button>
                        </div>

                        {retryMessage && (
                            <p className="mx-auto mt-4 max-w-md text-xs font-medium text-destructive">
                                {retryMessage}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
