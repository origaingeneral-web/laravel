'use client';

import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    title?: string;
    message: string;
    description?: string;
    errors?: Record<string, string[] | string> | string[];
    statusCode?: number;
    type?: ToastType;
    duration?: number;
    notification?: boolean;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

interface ToastCardProps {
    id: string | number;
    title?: string;
    message: string;
    description?: string;
    errors?: Record<string, string[] | string> | string[];
    statusCode?: number;
    type: ToastType;
    duration: number;
}

type ToastTheme = {
    label: string;
    shell: string;
    accent: string;
    iconWrap: string;
    icon: React.ReactNode;
    title: string;
    text: string;
    progressTrack: string;
    progress: string;
    close: string;
};

function normalizeStatusCode(statusCode?: number | string): number | undefined {
    const parsedStatusCode = Number(statusCode);

    return Number.isFinite(parsedStatusCode) ? parsedStatusCode : undefined;
}

function resolveToastType(type: ToastType = 'success', statusCode?: number | string): ToastType {
    const normalizedStatusCode = normalizeStatusCode(statusCode);

    if (!normalizedStatusCode) {
        return type;
    }

    if (normalizedStatusCode >= 200 && normalizedStatusCode < 300) {
        return 'success';
    }

    if (normalizedStatusCode >= 300 && normalizedStatusCode < 400) {
        return 'info';
    }

    if (
        normalizedStatusCode === 400 ||
        normalizedStatusCode === 401 ||
        normalizedStatusCode === 403 ||
        normalizedStatusCode === 404 ||
        normalizedStatusCode === 409 ||
        normalizedStatusCode === 422 ||
        (normalizedStatusCode >= 429 && normalizedStatusCode < 500)
    ) {
        return 'warning';
    }

    if (normalizedStatusCode >= 400) {
        return 'error';
    }

    return type;
}

function getToastTheme(type: ToastType, statusCode?: number): ToastTheme {
    switch (resolveToastType(type, statusCode)) {
        case 'success':
            return {
                label: 'Success',
                shell: 'border-emerald-200 bg-white text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white',
                accent: 'bg-emerald-500',
                iconWrap: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
                icon: <Check className="size-4 stroke-[3]" />,
                title: 'text-slate-950 dark:text-white',
                text: 'text-slate-600 dark:text-slate-300',
                progressTrack: 'bg-emerald-100 dark:bg-emerald-500/15',
                progress: 'bg-emerald-500',
                close: 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white',
            };
        case 'info':
            return {
                label: 'Info',
                shell: 'border-sky-200 bg-white text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:border-sky-500/30 dark:bg-slate-950 dark:text-white',
                accent: 'bg-sky-500',
                iconWrap: 'bg-sky-50 text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30',
                icon: <Info className="size-4 stroke-[2.6]" />,
                title: 'text-slate-950 dark:text-white',
                text: 'text-slate-600 dark:text-slate-300',
                progressTrack: 'bg-sky-100 dark:bg-sky-500/15',
                progress: 'bg-sky-500',
                close: 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white',
            };
        case 'warning':
            return {
                label: 'Warning',
                shell: 'border-amber-200 bg-white text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:border-amber-500/30 dark:bg-slate-950 dark:text-white',
                accent: 'bg-amber-500',
                iconWrap: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
                icon: <AlertTriangle className="size-4 stroke-[2.6]" />,
                title: 'text-slate-950 dark:text-white',
                text: 'text-slate-600 dark:text-slate-300',
                progressTrack: 'bg-amber-100 dark:bg-amber-500/15',
                progress: 'bg-amber-500',
                close: 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white',
            };
        case 'error':
        default:
            return {
                label: 'Error',
                shell: 'border-rose-200 bg-white text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:border-rose-500/30 dark:bg-slate-950 dark:text-white',
                accent: 'bg-rose-500',
                iconWrap: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
                icon: <AlertCircle className="size-4 stroke-[2.6]" />,
                title: 'text-slate-950 dark:text-white',
                text: 'text-slate-600 dark:text-slate-300',
                progressTrack: 'bg-rose-100 dark:bg-rose-500/15',
                progress: 'bg-rose-500',
                close: 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white',
            };
    }
}

function getErrorList(errors?: Record<string, string[] | string> | string[]): string[] {
    if (!errors) {
        return [];
    }

    if (Array.isArray(errors)) {
        return errors.map(String);
    }

    return Object.values(errors).flatMap((value) => (Array.isArray(value) ? value.map(String) : [value]));
}

export function ToastCard({
    id,
    title,
    message,
    description,
    errors,
    statusCode,
    type = 'success',
    duration = 5000,
}: ToastCardProps) {
    const [progress, setProgress] = useState(100);
    const [isHovered, setIsHovered] = useState(false);
    const remainingTimeRef = useRef(duration);
    const lastTickRef = useRef(0);

    useEffect(() => {
        if (duration <= 0) {
            return;
        }

        lastTickRef.current = Date.now();
        remainingTimeRef.current = duration;

        const interval = setInterval(() => {
            if (isHovered) {
                lastTickRef.current = Date.now();

                return;
            }

            const now = Date.now();
            const elapsed = now - lastTickRef.current;
            lastTickRef.current = now;
            remainingTimeRef.current -= elapsed;

            if (remainingTimeRef.current <= 0) {
                clearInterval(interval);
                toast.dismiss(id);

                return;
            }

            setProgress(Math.max(0, (remainingTimeRef.current / duration) * 100));
        }, 20);

        return () => clearInterval(interval);
    }, [id, duration, isHovered]);

    const normalizedStatusCode = normalizeStatusCode(statusCode);
    const theme = getToastTheme(type, normalizedStatusCode);
    const errorList = getErrorList(errors);
    const statusLabel = title || theme.label;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="alert"
            className={`group relative flex w-full overflow-hidden rounded-lg border ${theme.shell} select-none transition-all duration-200 hover:-translate-y-0.5 sm:min-w-[380px] sm:max-w-[460px]`}
        >
            <div className={`w-1.5 shrink-0 ${theme.accent}`} />

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-3 p-4 pb-3">
                    <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md ${theme.iconWrap}`}>
                        {theme.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className={`mb-1 text-sm font-semibold leading-5 ${theme.title}`}>{statusLabel}</p>

                        <p className={`break-words text-sm font-medium leading-5 ${theme.text}`}>{message}</p>

                        {description && description !== message && (
                            <p className={`mt-1 break-words text-xs leading-5 ${theme.text}`}>{description}</p>
                        )}

                        {errorList.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                {errorList.slice(0, 4).map((error, index) => (
                                    <p key={`${error}-${index}`} className={`break-words text-xs font-medium leading-4 ${theme.text}`}>
                                        - {error}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => toast.dismiss(id)}
                        className={`-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-md transition-colors ${theme.close}`}
                        aria-label="Close notification"
                    >
                        <X className="size-4 stroke-[2.5]" />
                    </button>
                </div>

                <div className={`h-1 w-full ${theme.progressTrack}`}>
                    <div className={`h-full ${theme.progress} transition-[width] duration-75 ease-linear`} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
}

export function showToast(options: ToastOptions | string, explicitType?: ToastType): string | number {
    const opts: ToastOptions =
        typeof options === 'string'
            ? { message: options, type: explicitType || 'success', duration: 5000, notification: true }
            : { type: 'success', duration: 5000, notification: true, ...options };

    if (opts.notification === false || !opts.message) {
        return '';
    }

    const statusCode = normalizeStatusCode(opts.statusCode);
    const type = resolveToastType(opts.type, statusCode);
    const duration = opts.duration ?? 5000;

    return toast.custom(
        (id) => (
            <ToastCard
                id={id}
                title={opts.title}
                message={opts.message}
                description={opts.description}
                errors={opts.errors}
                statusCode={statusCode}
                type={type}
                duration={duration}
            />
        ),
        {
            position: opts.position || 'top-right',
            duration: Infinity,
        },
    );
}

showToast.success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'success', statusCode: 200, ...options });

showToast.error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'error', statusCode: 500, ...options });

showToast.warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'warning', statusCode: 422, ...options });

showToast.info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'info', statusCode: 200, ...options });

export function handleApiResponseToast(response: any, statusCode?: number): void {
    if (!response || typeof response !== 'object') {
        return;
    }

    const inferredStatusCode = normalizeStatusCode(statusCode || response.status || response.statusCode) || (response.success === false ? 400 : 200);
    const shouldNotify = response.notification === true || (response.notification !== false && response.message);

    if (shouldNotify && response.message) {
        showToast({
            message: response.message,
            description: response.description,
            errors: response.errors,
            statusCode: inferredStatusCode,
            type: resolveToastType(response.type as ToastType, inferredStatusCode),
            notification: true,
        });
    }
}
