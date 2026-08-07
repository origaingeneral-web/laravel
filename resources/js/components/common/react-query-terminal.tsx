'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Terminal,
  RefreshCw,
  Trash2,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  Zap,
  Database,
  Search,
  Copy,
  Check,
  Code2,
  Sparkles,
  Radio,
  Layers,
  Sun,
  Moon,
  PanelLeft,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';

interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
  timestamp: string;
  queryKeyStr?: string;
}

type TabType = 'cli' | 'inspector' | 'events';

export function ReactQueryTerminal({
  showTanstackDevtools,
  toggleTanstackDevtools,
}: {
  showTanstackDevtools?: boolean;
  toggleTanstackDevtools?: () => void;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('cli');
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [filterText, setFilterText] = useState('');
  const [expandedQueryKey, setExpandedQueryKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Safely connect SettingsProvider for sidebar theme toggle
  let settings: any = null;
  let storeOption: any = null;
  try {
    const settingsCtx = useSettings();
    settings = settingsCtx.settings;
    storeOption = settingsCtx.storeOption;
  } catch {
    // Graceful fallback if mounted outside SettingsProvider
  }

  const currentSidebarTheme = settings?.layouts?.demo1?.sidebarTheme || 'light';

  const toggleSidebarTheme = (theme?: 'light' | 'dark') => {
    const nextTheme = theme || (currentSidebarTheme === 'dark' ? 'light' : 'dark');
    if (storeOption) {
      storeOption('layouts.demo1.sidebarTheme', nextTheme);
    }
    return nextTheme;
  };

  const [eventLogs, setEventLogs] = useState<
    { id: string; event: string; key: string; time: string; type: 'info' | 'success' | 'warn' | 'error' }[]
  >([]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'system',
      content:
        '⚡ React Query & Layout Management CLI v5.0 online.\nType "help" or click suggestions below (e.g. "sidebar dark", "ls", "refetch").',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to query cache events for real-time live event stream
  useEffect(() => {
    const cache = queryClient.getQueryCache();
    const unsubscribe = cache.subscribe((event) => {
      if (!event) return;
      const keyStr = event.query ? JSON.stringify(event.query.queryKey) : 'Global';
      let type: 'info' | 'success' | 'warn' | 'error' = 'info';
      if (event.type === 'updated' && event.action?.type === 'success') type = 'success';
      if (event.type === 'updated' && event.action?.type === 'error') type = 'error';
      if (event.type === 'removed' || event.type === 'invalidated') type = 'warn';

      setEventLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          event: event.type + (event.action?.type ? `:${event.action.type}` : ''),
          key: keyStr,
          time: new Date().toLocaleTimeString(),
          type,
        },
        ...prev.slice(0, 49),
      ]);
    });
    return () => unsubscribe();
  }, [queryClient]);

  // Auto-scroll CLI output
  useEffect(() => {
    if (activeTab === 'cli' && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  // Focus CLI input when tab or window opens
  useEffect(() => {
    if (isOpen && activeTab === 'cli' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, activeTab]);

  // Global Keyboard Shortcut (Ctrl+Shift+Q or Alt+T) to toggle DevTools directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') ||
        (e.altKey && e.key.toLowerCase() === 't')
      ) {
        e.preventDefault();
        if (toggleTanstackDevtools) {
          toggleTanstackDevtools();
        } else {
          setIsOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTanstackDevtools]);

  const addLog = (
    type: 'input' | 'output' | 'error' | 'system' | 'success',
    content: string,
    queryKeyStr?: string,
  ) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      queryKeyStr,
    };
    setLogs((prev) => [...prev, newEntry]);
  };

  const getQueryStats = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const fetchingCount = queryClient.isFetching();
    const activeCount = queries.filter((q) => q.state.status === 'success' && q.isStale() === false).length;
    const staleCount = queries.filter((q) => q.isStale()).length;
    const errorCount = queries.filter((q) => q.state.status === 'error').length;
    const totalCount = queries.length;

    return { totalCount, activeCount, fetchingCount, staleCount, errorCount, queries };
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLog('input', `$ ${trimmed}`);
    setCommandHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (command) {
      case 'help':
        addLog(
          'system',
          `Available CLI Commands:
  • help                      - Display this command reference
  • sidebar [light|dark|toggle] - Toggle or set Sidebar theme (light/dark)
  • list / ls                 - List all cached queries with status & key
  • stats                     - Output cache summary and memory statistics
  • refetch [key]             - Force refetch queries matching key or all
  • invalidate [key]          - Invalidate cache for queries matching key or all
  • reset                     - Reset query cache to initial state
  • clear / cls               - Clear CLI terminal screen history
  • ping                      - Check QueryClient connection health`,
        );
        break;

      case 'sidebar': {
        let targetTheme: 'light' | 'dark' = currentSidebarTheme === 'dark' ? 'light' : 'dark';
        if (arg === 'dark' || arg === 'light') {
          targetTheme = arg;
        }
        const resultTheme = toggleSidebarTheme(targetTheme);
        addLog('success', `✔ Sidebar theme changed to "${resultTheme}".`);
        break;
      }

      case 'list':
      case 'ls': {
        const { queries } = getQueryStats();
        if (queries.length === 0) {
          addLog('output', 'No queries found in current QueryClient cache.');
        } else {
          let listOutput = `Query Cache Listing (${queries.length} entries):\n\n`;
          queries.forEach((q, idx) => {
            const keyStr = JSON.stringify(q.queryKey);
            const statusStr = q.state.status.toUpperCase();
            const isStale = q.isStale() ? 'STALE' : 'FRESH';
            const observers = q.getObserversCount();
            listOutput += `[${idx + 1}] ${keyStr}\n    Status: ${statusStr} (${isStale}) | Observers: ${observers} | Updated: ${new Date(q.state.dataUpdatedAt).toLocaleTimeString()}\n`;
          });
          addLog('output', listOutput.trimEnd());
        }
        break;
      }

      case 'stats': {
        const { totalCount, activeCount, fetchingCount, staleCount, errorCount } =
          getQueryStats();
        addLog(
          'output',
          `Query Client Cache Metrics:
  ┌──────────────────────┬───────┐
  │ Metric               │ Count │
  ├──────────────────────┼───────┤
  │ Total Query Entries  │ ${totalCount.toString().padStart(5)} │
  │ Active & Fresh       │ ${activeCount.toString().padStart(5)} │
  │ Fetching / Loading   │ ${fetchingCount.toString().padStart(5)} │
  │ Stale Queries        │ ${staleCount.toString().padStart(5)} │
  │ Error State Queries  │ ${errorCount.toString().padStart(5)} │
  ├──────────────────────┼───────┤
  │ Sidebar Theme        │ ${currentSidebarTheme.padStart(5)} │
  └──────────────────────┴───────┘`,
        );
        break;
      }

      case 'refetch': {
        if (arg) {
          queryClient.refetchQueries({ queryKey: [arg] });
          addLog('success', `✔ Refetching queries matching key pattern: "${arg}"`);
        } else {
          queryClient.refetchQueries();
          addLog('success', '✔ Refetching all active queries in application cache.');
        }
        break;
      }

      case 'invalidate': {
        if (arg) {
          queryClient.invalidateQueries({ queryKey: [arg] });
          addLog('success', `✔ Invalidate triggered for query key: "${arg}"`);
        } else {
          queryClient.invalidateQueries();
          addLog('success', '✔ All queries marked as invalidated.');
        }
        break;
      }

      case 'reset': {
        queryClient.resetQueries();
        addLog('success', '✔ Query cache successfully reset.');
        break;
      }

      case 'clear':
      case 'cls': {
        setLogs([]);
        break;
      }

      case 'ping': {
        addLog(
          'success',
          `✔ QueryClient is active. React Query version 5.x. Time: ${new Date().toLocaleTimeString()}`,
        );
        break;
      }

      default:
        addLog(
          'error',
          `Command not recognized: "${command}". Type "help" or click command pills below.`,
        );
        break;
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const copyToClipboard = (text: string, keyIdentifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const stats = getQueryStats();
  const suggestions = [
    'sidebar dark',
    'sidebar light',
    'ls',
    'stats',
    'refetch',
    'invalidate',
    'help',
    'clear',
  ];

  const filteredQueries = stats.queries.filter((q) => {
    if (!filterText) return true;
    const keyStr = JSON.stringify(q.queryKey).toLowerCase();
    return keyStr.includes(filterText.toLowerCase());
  });

  return (
    <>
      {/* Sleek Right-Side Floating Circle Trigger Button - Directly toggles DevTools */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center">
        <button
          onClick={() => {
            if (toggleTanstackDevtools) {
              toggleTanstackDevtools();
            } else {
              setIsOpen((prev) => !prev);
            }
          }}
          title="Direct Toggle React Query DevTools (Ctrl+Shift+Q)"
          className={cn(
            'group relative flex h-11 w-11 items-center justify-center rounded-full shadow-2xl transition-all duration-300',
            'bg-slate-950/95 text-emerald-400 border border-emerald-500/40 backdrop-blur-xl',
            'hover:bg-slate-900 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-110',
            showTanstackDevtools && 'ring-2 ring-emerald-500/60 border-emerald-400 bg-slate-900',
          )}
        >
          {/* Status Indicator Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
            {stats.fetchingCount > 0 ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            ) : (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                'relative inline-flex h-2.5 w-2.5 rounded-full border border-slate-950',
                stats.fetchingCount > 0 ? 'bg-amber-400' : 'bg-emerald-400',
              )}
            />
          </span>

          <Sparkles className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Terminal Drawer Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-18 right-5 z-50 flex flex-col rounded-2xl border border-slate-800/90 bg-slate-950/95 font-mono shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5',
            isExpanded
              ? 'h-[88vh] w-[92vw] right-[4vw]'
              : 'h-[500px] w-[94vw] sm:w-[720px]',
          )}
        >
          {/* Top Bar Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5 rounded-t-2xl select-none">
            {/* Window Controls & Title */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="group flex h-3 w-3 items-center justify-center rounded-full bg-red-500/90 hover:bg-red-500 transition-colors"
                  title="Close Terminal"
                >
                  <X className="h-2 w-2 text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="group flex h-3 w-3 items-center justify-center rounded-full bg-amber-500/90 hover:bg-amber-500 transition-colors"
                  title="Maximize/Restore"
                >
                  <Maximize2 className="h-2 w-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="h-3 w-3 rounded-full bg-emerald-500/90" />
              </div>

              <div className="h-4 w-px bg-slate-800" />

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-950/60 p-1 border border-slate-800/60">
                <button
                  onClick={() => setActiveTab('cli')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeTab === 'cli'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                  )}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>CLI Shell</span>
                </button>

                <button
                  onClick={() => setActiveTab('inspector')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeTab === 'inspector'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                  )}
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>Inspector</span>
                  <Badge
                    variant="outline"
                    className="ml-1 border-slate-700 bg-slate-900 px-1 py-0 text-[10px] text-slate-300"
                  >
                    {stats.totalCount}
                  </Badge>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeTab === 'events'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                  )}
                >
                  <Radio className="h-3.5 w-3.5 animate-pulse text-amber-400" />
                  <span>Live Stream</span>
                </button>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-1.5">
              {/* Sidebar Light/Dark Toggle Pill */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 text-[11px] px-2.5 border transition-all',
                  currentSidebarTheme === 'dark'
                    ? 'border-indigo-500/60 bg-indigo-950/60 text-indigo-300 font-semibold'
                    : 'border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800/60',
                )}
                onClick={() => {
                  const next = toggleSidebarTheme();
                  addLog('success', `✔ Sidebar theme toggled to "${next}".`);
                }}
                title="Toggle Sidebar Light / Dark Mode"
              >
                {currentSidebarTheme === 'dark' ? (
                  <>
                    <Moon className="h-3 w-3 mr-1 text-indigo-400" />
                    Dark Sidebar
                  </>
                ) : (
                  <>
                    <Sun className="h-3 w-3 mr-1 text-amber-400" />
                    Light Sidebar
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] px-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/70 border border-slate-800"
                onClick={() => handleCommand('refetch')}
                title="Refetch All Queries"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refetch
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] px-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/70 border border-slate-800"
                onClick={() => handleCommand('invalidate')}
                title="Invalidate Cache"
              >
                <Zap className="h-3 w-3 mr-1 text-amber-400" />
                Invalidate
              </Button>

              {toggleTanstackDevtools && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 text-[11px] px-2.5 border transition-all',
                    showTanstackDevtools
                      ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
                  )}
                  onClick={toggleTanstackDevtools}
                  title="Toggle TanStack DevTools Overlay"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                  DevTools {showTanstackDevtools ? 'ON' : 'OFF'}
                </Button>
              )}

              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors"
                title="Close terminal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Status Metrics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 text-[11px] text-slate-400 select-none">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Active: <strong className="text-emerald-300">{stats.activeCount}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
                Fetching: <strong className="text-amber-300">{stats.fetchingCount}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                Stale: <strong className="text-orange-300">{stats.staleCount}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                Errors: <strong className="text-red-400">{stats.errorCount}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <PanelLeft className="h-3 w-3 text-indigo-400" />
                Sidebar: <strong className="text-indigo-300 uppercase">{currentSidebarTheme}</strong>
              </span>
            </div>
          </div>

          {/* TAB 1: CLI Shell Output */}
          {activeTab === 'cli' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/80">
              {/* Output Log Stream */}
              <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed font-mono"
              >
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 group">
                    <span className="text-[10px] text-slate-600 select-none pt-0.5 font-mono">
                      {log.timestamp}
                    </span>
                    <div className="flex-1">
                      {log.type === 'input' ? (
                        <div className="flex items-center gap-2 font-semibold text-emerald-400">
                          <span className="text-emerald-500 font-bold">$</span>
                          <span>{log.content.replace(/^\$\s*/, '')}</span>
                        </div>
                      ) : log.type === 'system' ? (
                        <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-cyan-300 font-mono">
                          {log.content}
                        </div>
                      ) : log.type === 'success' ? (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-emerald-300 font-mono">
                          {log.content}
                        </div>
                      ) : log.type === 'error' ? (
                        <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-2.5 text-red-300 font-mono">
                          {log.content}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                          {log.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Command Suggestions Bar */}
              <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/40 border-t border-slate-800/60 overflow-x-auto text-[11px]">
                <span className="text-slate-500 text-[10px] uppercase font-sans font-semibold tracking-wider mr-1">
                  Quick Run:
                </span>
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleCommand(sug)}
                    className="rounded bg-slate-800/80 px-2 py-0.5 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/40 border border-slate-700/60 transition-all font-mono"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Command Line Input Bar */}
              <div className="flex items-center gap-2.5 border-t border-slate-800 bg-slate-900/90 px-4 py-3 rounded-b-2xl">
                <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder='Type command (e.g., "sidebar dark", "sidebar light", "ls", "stats", "refetch")...'
                  className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    handleCommand(input);
                    setInput('');
                  }}
                  className="h-7 text-[11px] px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold font-mono rounded-md shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                >
                  Exec
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: Visual Query Inspector */}
          {activeTab === 'inspector' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/80">
              {/* Search Filter */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter queries by key name..."
                  className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                />
                {filterText && (
                  <button
                    onClick={() => setFilterText('')}
                    className="text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Query Cards List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredQueries.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No matching queries found in QueryClient cache.
                  </div>
                ) : (
                  filteredQueries.map((q) => {
                    const keyStr = JSON.stringify(q.queryKey);
                    const isExpanded = expandedQueryKey === keyStr;
                    const isStale = q.isStale();
                    const status = q.state.status;

                    return (
                      <div
                        key={keyStr}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 hover:border-slate-700 transition-all font-mono"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] font-mono uppercase px-2 py-0.5',
                                status === 'success' && !isStale && 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40',
                                status === 'success' && isStale && 'border-orange-500/50 text-orange-400 bg-orange-950/40',
                                status === 'error' && 'border-red-500/50 text-red-400 bg-red-950/40',
                                status === 'pending' && 'border-amber-500/50 text-amber-400 bg-amber-950/40',
                              )}
                            >
                              {status === 'success' ? (isStale ? 'STALE' : 'FRESH') : status}
                            </Badge>
                            <span className="text-xs font-semibold text-slate-200 break-all">
                              {keyStr}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[10px] px-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800"
                              onClick={() => {
                                queryClient.refetchQueries({ queryKey: q.queryKey });
                                addLog('success', `Refetched ${keyStr}`);
                              }}
                            >
                              Refetch
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[10px] px-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800"
                              onClick={() => {
                                queryClient.invalidateQueries({ queryKey: q.queryKey });
                                addLog('success', `Invalidated ${keyStr}`);
                              }}
                            >
                              Invalidate
                            </Button>

                            <button
                              onClick={() =>
                                copyToClipboard(
                                  JSON.stringify(q.state.data, null, 2),
                                  keyStr,
                                )
                              }
                              className="p-1 text-slate-400 hover:text-slate-200"
                              title="Copy JSON State"
                            >
                              {copiedKey === keyStr ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                setExpandedQueryKey(isExpanded ? null : keyStr)
                              }
                              className="p-1 text-slate-400 hover:text-slate-200"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible JSON State Details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80">
                            <div className="text-[10px] text-slate-500 mb-1">
                              State Data:
                            </div>
                            <pre className="max-h-48 overflow-y-auto rounded-lg bg-slate-950 p-2.5 text-[11px] text-emerald-300/90 border border-slate-800">
                              {JSON.stringify(q.state.data, null, 2) || 'undefined'}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Live Event Stream */}
          {activeTab === 'events' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/80 p-4 overflow-y-auto space-y-2 font-mono">
              {eventLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Listening for QueryClient events... (trigger any query to stream lifecycle events)
                </div>
              ) : (
                eventLogs.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-slate-500">{ev.time}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-mono px-2 py-0.5',
                          ev.type === 'success' && 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40',
                          ev.type === 'warn' && 'border-amber-500/50 text-amber-400 bg-amber-950/40',
                          ev.type === 'error' && 'border-red-500/50 text-red-400 bg-red-950/40',
                          ev.type === 'info' && 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40',
                        )}
                      >
                        {ev.event}
                      </Badge>
                      <span className="text-slate-300 font-semibold">{ev.key}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
