import { type ReactNode } from 'react';

export default function ErrorLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen grow flex-col items-center justify-center bg-background px-4 py-10">
            {children}
        </main>
    );
}
