import { SVGProps } from 'react';

export function AiIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="url(#aiGradient)"
            stroke="none"
            {...props}
        >
            <defs>
                <linearGradient id="aiGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4285f4" />
                    <stop offset="50%" stopColor="#9b72cb" />
                    <stop offset="100%" stopColor="#d96570" />
                </linearGradient>
            </defs>
            {/* Main Gemini-like Star */}
            <path d="M12 2.5c0 5.25-4.25 9.5-9.5 9.5 5.25 0 9.5 4.25 9.5 9.5 0-5.25 4.25-9.5 9.5-9.5-5.25 0-9.5-4.25-9.5-9.5z" />
            {/* Smaller Sparkle */}
            <path d="M19 2c0 1.93-1.57 3.5-3.5 3.5 1.93 0 3.5 1.57 3.5 3.5 0-1.93 1.57-3.5 3.5-3.5-1.93 0-3.5-1.57-3.5-3.5z" />
        </svg>
    );
}
