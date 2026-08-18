'use client';

import { ReactNode, useState } from 'react';
import { RiErrorWarningFill } from '@remixicon/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';

const isAppDebugEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const appElement = document.getElementById('app');
    if (appElement?.dataset?.page) {
      const pageData = JSON.parse(appElement.dataset.page);
      return Boolean(pageData?.props?.app_debug);
    }
  } catch {
    // Ignore JSON parsing errors
  }

  return false;
};

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [showDevtools] = useState(() => isAppDebugEnabled());

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const message =
              error.message || 'Something went wrong. Please try again.';

            toast.custom(
              () => (
                <Alert variant="mono" icon="destructive" close={false}>
                  <AlertIcon>
                    <RiErrorWarningFill />
                  </AlertIcon>
                  <AlertTitle>{message}</AlertTitle>
                </Alert>
              ),
              {
                position: 'top-center',
              },
            );
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
};

export { QueryProvider };


