'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    Check,
    Lightbulb,
    AlertTriangle,
    X,
} from 'lucide-react';

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
    const lastTickRef = useRef(Date.now());

    useEffect(() => {
        if (duration <= 0) return;

        lastTickRef.current = Date.now();

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
            } else {
                setProgress(Math.max(0, (remainingTimeRef.current / duration) * 100));
            }
        }, 20);

        return () => clearInterval(interval);
    }, [id, duration, isHovered]);

    // Semi-transparent frosted glass theme matching the user reference image
    const getTheme = () => {
        let resolvedType = type;
        if (statusCode) {
            if (statusCode >= 200 && statusCode < 300) resolvedType = 'success';
            else if (statusCode === 422 || statusCode === 400) resolvedType = 'warning';
            else if (statusCode >= 400) resolvedType = 'error';
        }

        switch (resolvedType) {
            case 'success':
                return {
                    defaultTitle: 'Success!',
                    bg: 'bg-[#f0fdf4]/80 dark:bg-[#062c19]/75 backdrop-blur-xl',
                    border: 'border-[#86efac]/90 dark:border-[#22c55e]/40',
                    iconBg: 'bg-[#22c55e] shadow-sm',
                    icon: <Check className="w-4 h-4 text-white stroke-[3]" />,
                    titleColor: 'text-[#14532d] dark:text-[#86efac]',
                    messageColor: 'text-[#374151] dark:text-[#d1d5db]',
                    barColor: 'bg-[#22c55e]',
                    barTrack: 'bg-[#22c55e]/15',
                    closeColor: 'text-[#6b7280] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white',
                };
            case 'info':
                return {
                    defaultTitle: 'Did you know?',
                    bg: 'bg-[#eff6ff]/80 dark:bg-[#082855]/75 backdrop-blur-xl',
                    border: 'border-[#93c5fd]/90 dark:border-[#3b82f6]/40',
                    iconBg: 'bg-[#3b82f6] shadow-sm',
                    icon: <Lightbulb className="w-4 h-4 text-white stroke-[2.5]" />,
                    titleColor: 'text-[#1e3a8a] dark:text-[#93c5fd]',
                    messageColor: 'text-[#374151] dark:text-[#d1d5db]',
                    barColor: 'bg-[#3b82f6]',
                    barTrack: 'bg-[#3b82f6]/15',
                    closeColor: 'text-[#6b7280] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white',
                };
            case 'warning':
                return {
                    defaultTitle: 'Warning!',
                    bg: 'bg-[#fffbeb]/80 dark:bg-[#382606]/75 backdrop-blur-xl',
                    border: 'border-[#fde68a]/90 dark:border-[#f59e0b]/40',
                    iconBg: 'bg-[#f59e0b] shadow-sm',
                    icon: <AlertTriangle className="w-4 h-4 text-white stroke-[2.5]" />,
                    titleColor: 'text-[#78350f] dark:text-[#fde68a]',
                    messageColor: 'text-[#374151] dark:text-[#d1d5db]',
                    barColor: 'bg-[#f59e0b]',
                    barTrack: 'bg-[#f59e0b]/15',
                    closeColor: 'text-[#6b7280] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white',
                };
            case 'error':
            default:
                return {
                    defaultTitle: 'Something went wrong!',
                    bg: 'bg-[#fef2f2]/80 dark:bg-[#3a0d11]/75 backdrop-blur-xl',
                    border: 'border-[#fca5a5]/90 dark:border-[#ef4444]/40',
                    iconBg: 'bg-[#ef4444] shadow-sm',
                    icon: <X className="w-4 h-4 text-white stroke-[3]" />,
                    titleColor: 'text-[#7f1d1d] dark:text-[#fca5a5]',
                    messageColor: 'text-[#374151] dark:text-[#d1d5db]',
                    barColor: 'bg-[#ef4444]',
                    barTrack: 'bg-[#ef4444]/15',
                    closeColor: 'text-[#6b7280] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white',
                };
        }
    };

    const theme = getTheme();
    const displayTitle = title || (statusCode ? `${theme.defaultTitle} (${statusCode})` : theme.defaultTitle);

    // Format error list if provided
    const errorList: string[] = [];
    if (errors) {
        if (Array.isArray(errors)) {
            errorList.push(...errors.map(String));
        } else if (typeof errors === 'object') {
            Object.values(errors).forEach((val) => {
                if (Array.isArray(val)) {
                    errorList.push(...val.map(String));
                } else if (typeof val === 'string') {
                    errorList.push(val);
                }
            });
        }
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative flex flex-col w-full sm:min-w-[360px] sm:max-w-[440px] ${theme.bg} ${theme.border} border-2 rounded-[26px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 select-none hover:scale-[1.01]`}
        >
            {/* Inner Content with Rounded Pill Structure */}
            <div className="p-3.5 sm:p-4 flex items-start gap-3.5">
                {/* Round Solid Circle Icon */}
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${theme.iconBg} mt-0.5`}>
                    {theme.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-1">
                    {/* Header Title */}
                    <h5 className={`text-[14px] font-bold tracking-tight ${theme.titleColor} leading-tight`}>
                        {displayTitle}
                    </h5>

                    {/* Main $message */}
                    <p className={`text-[12.5px] sm:text-[13px] ${theme.messageColor} mt-0.5 leading-snug font-medium break-words`}>
                        {message}
                    </p>

                    {/* Secondary Description */}
                    {description && description !== message && (
                        <p className={`text-[11.5px] opacity-80 ${theme.messageColor} mt-1 leading-normal`}>
                            {description}
                        </p>
                    )}

                    {/* Validation Errors pills if present */}
                    {errorList.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                            {errorList.slice(0, 3).map((err, idx) => (
                                <p key={idx} className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                                    • {err}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Close 'X' Button */}
                <button
                    type="button"
                    onClick={() => toast.dismiss(id)}
                    className={`p-1.5 rounded-full ${theme.closeColor} hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1`}
                    aria-label="Close"
                >
                    <X className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>

            {/* Rounded Progress / Time Bar at Bottom */}
            <div className="px-4 pb-2.5">
                <div className={`w-full ${theme.barTrack} h-1 rounded-full overflow-hidden`}>
                    <div
                        className={`h-full ${theme.barColor} rounded-full transition-[width] duration-75 ease-linear ${
                            isHovered ? 'brightness-125' : ''
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * Trigger an interactive toast with the transparent rounded pill/card design
 */
export function showToast(options: ToastOptions | string, explicitType?: ToastType): string | number {
    const opts: ToastOptions = typeof options === 'string'
        ? { message: options, type: explicitType || 'success' }
        : { type: 'success', duration: 5000, notification: true, ...options };

    if (opts.notification === false) {
        return '';
    }

    const type = opts.type || (opts.statusCode && opts.statusCode >= 400 ? 'error' : 'success');
    const duration = opts.duration ?? 5000;

    return toast.custom(
        (id) => (
            <ToastCard
                id={id}
                title={opts.title}
                message={opts.message}
                description={opts.description}
                errors={opts.errors}
                statusCode={opts.statusCode}
                type={type}
                duration={duration}
            />
        ),
        {
            position: opts.position || 'top-right',
            duration: Infinity, // Handled by ToastCard with exact timer & pause on hover
        }
    );
}

/**
 * Convenience helpers
 */
showToast.success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'success', statusCode: 200, ...options });

showToast.error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'error', statusCode: 500, ...options });

showToast.warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'warning', statusCode: 422, ...options });

showToast.info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'info', statusCode: 200, ...options });

/**
 * Handle API responses directly and detect status codes and notification flags
 */
export function handleApiResponseToast(response: any, statusCode?: number): void {
    if (!response || typeof response !== 'object') return;

    const shouldNotify = response.notification === true || (response.notification !== false && response.message);

    if (shouldNotify && response.message) {
        const inferredStatus = statusCode || (response.success === false ? 400 : 200);
        const type: ToastType = response.success === false || inferredStatus >= 400 ? 'error' : 'success';

        showToast({
            message: response.message,
            description: response.description,
            errors: response.errors,
            statusCode: inferredStatus,
            type,
            notification: true,
        });
    }
}
