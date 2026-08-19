'use client';

import { useEffect } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { showToast, handleApiResponseToast } from '@/components/ui/toast-notification';

export function ToastListener() {
    useFlashToast();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Expose helpers globally for manual calls
        (window as any).showToast = showToast;
        (window as any).handleApiResponseToast = handleApiResponseToast;

        // 1. Global Fetch Response Interceptor
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);

            try {
                // Clone response so we can inspect JSON without consuming the body stream for callers
                const clone = response.clone();
                const contentType = clone.headers.get('content-type') || '';

                if (contentType.includes('application/json')) {
                    clone
                        .json()
                        .then((data) => {
                            if (
                                data &&
                                typeof data === 'object' &&
                                (data.notification === true || data.notification === 1 || data.notification === 'true') &&
                                data.message
                            ) {
                                showToast({
                                    message: data.message,
                                    description: data.description,
                                    errors: data.errors,
                                    statusCode: response.status,
                                    type: response.status >= 400 || data.success === false ? 'error' : 'success',
                                    notification: true,
                                });
                            }
                        })
                        .catch(() => {});
                }
            } catch {
                // Ignore clone/json reading issues
            }

            return response;
        };

        // 2. Global Axios Response Interceptor (if axios is initialized)
        let axiosInterceptorId: number | null = null;
        if ((window as any).axios?.interceptors?.response) {
            axiosInterceptorId = (window as any).axios.interceptors.response.use(
                (res: any) => {
                    const data = res?.data;
                    if (
                        data &&
                        typeof data === 'object' &&
                        (data.notification === true || data.notification === 1 || data.notification === 'true') &&
                        data.message
                    ) {
                        showToast({
                            message: data.message,
                            description: data.description,
                            errors: data.errors,
                            statusCode: res.status,
                            type: res.status >= 400 || data.success === false ? 'error' : 'success',
                            notification: true,
                        });
                    }
                    return res;
                },
                (err: any) => {
                    const data = err?.response?.data;
                    if (
                        data &&
                        typeof data === 'object' &&
                        (data.notification === true || data.notification === 1 || data.notification === 'true') &&
                        data.message
                    ) {
                        showToast({
                            message: data.message,
                            description: data.description,
                            errors: data.errors,
                            statusCode: err?.response?.status || 500,
                            type: 'error',
                            notification: true,
                        });
                    }
                    return Promise.reject(err);
                }
            );
        }

        // 3. Custom Event Listener
        const handleCustomEvent = (event: CustomEvent) => {
            if (event?.detail) {
                handleApiResponseToast(event.detail, (event.detail as any)?.status);
            }
        };

        window.addEventListener('api-response-toast' as any, handleCustomEvent);

        return () => {
            window.fetch = originalFetch;
            if (axiosInterceptorId !== null && (window as any).axios?.interceptors?.response) {
                (window as any).axios.interceptors.response.eject(axiosInterceptorId);
            }
            window.removeEventListener('api-response-toast' as any, handleCustomEvent);
        };
    }, []);

    return null;
}
