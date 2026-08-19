import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { showToast, type ToastType } from '@/components/ui/toast-notification';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const lastToastRef = useRef<string>('');

    useEffect(() => {
        const handleFlash = (event: any) => {
            const pageProps = event?.detail?.page?.props || event?.detail?.flash;
            const flash = pageProps?.flash || pageProps;

            if (!flash) return;

            // 1. Structured flash toast
            const toastData = flash?.toast as (FlashToast & { notification?: boolean; duration?: number }) | undefined;
            if (toastData?.message) {
                const key = `${toastData.type}:${toastData.message}`;
                if (lastToastRef.current === key) return;
                lastToastRef.current = key;
                setTimeout(() => { lastToastRef.current = ''; }, 1000);

                showToast({
                    message: toastData.message,
                    type: (toastData.type as ToastType) || 'success',
                    notification: toastData.notification ?? true,
                    duration: toastData.duration ?? 5000,
                });
                return;
            }

            // 2. Direct flash success / error / message
            if (flash?.success && typeof flash.success === 'string') {
                const key = `success:${flash.success}`;
                if (lastToastRef.current === key) return;
                lastToastRef.current = key;
                setTimeout(() => { lastToastRef.current = ''; }, 1000);

                showToast({
                    message: flash.success,
                    type: 'success',
                    notification: flash.notification ?? true,
                });
            } else if (flash?.error && typeof flash.error === 'string') {
                const key = `error:${flash.error}`;
                if (lastToastRef.current === key) return;
                lastToastRef.current = key;
                setTimeout(() => { lastToastRef.current = ''; }, 1000);

                showToast({
                    message: flash.error,
                    type: 'error',
                    notification: flash.notification ?? true,
                });
            } else if (flash?.message && typeof flash.message === 'string' && flash?.notification !== false) {
                const key = `info:${flash.message}`;
                if (lastToastRef.current === key) return;
                lastToastRef.current = key;
                setTimeout(() => { lastToastRef.current = ''; }, 1000);

                showToast({
                    message: flash.message,
                    type: (flash.type as ToastType) || 'success',
                    notification: true,
                });
            }
        };

        const removeFlashListener = router.on('flash', handleFlash);
        const removeSuccessListener = router.on('success', handleFlash);

        return () => {
            removeFlashListener();
            removeSuccessListener();
        };
    }, []);
}

