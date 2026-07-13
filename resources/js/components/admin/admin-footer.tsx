export function AdminFooter() {
    return (
        <footer className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 py-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright © {new Date().getFullYear()} NexLink. All rights reserved.</p>
            <p className="font-semibold">Version 1.0.0</p>
        </footer>
    );
}
