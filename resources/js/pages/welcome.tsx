import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Welcome to Donezo" />
            <div className="welcome-shell flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)] text-foreground dark:bg-[radial-gradient(circle_at_top,_rgba(5,38,89,0.35),_transparent_55%)]">
                <main className="welcome-card w-full border border-border/70 bg-card/80 shadow-lg backdrop-blur">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:mb-5 sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Enterprise Admin Workspace
                    </div>

                    <h1 className="welcome-title font-black tracking-tight text-primary dark:text-white">
                        Donezo
                    </h1>

                    <p className="welcome-copy mt-3 max-w-2xl text-muted-foreground sm:mt-4">
                        Plan, prioritize, and accomplish your tasks with ease. Harness the power of modern dashboards,
                        analytics, and collaboration in one place.
                    </p>

                    <div className="mt-6 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:gap-3">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-lg active:scale-95 sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-lg active:scale-95 sm:w-auto"
                                >
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary px-6 py-3.5 font-semibold text-secondary transition-all hover:bg-secondary/5 active:scale-95 sm:w-auto"
                                >
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
