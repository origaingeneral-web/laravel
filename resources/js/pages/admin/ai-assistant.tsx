import { Head } from '@inertiajs/react';
import Demo1Layout from '@/layouts/demo1/layout';
import { useState, useRef, useEffect } from 'react';
import { AiIcon } from '@/components/ai-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUp,
    ChevronDown,
    Copy,
    Check,
    RotateCcw,
    ThumbsUp,
    Paperclip,
    Mic,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    badge?: string;
    codeSnippet?: string;
    timestamp: string;
}

const QUICK_PILLS = [
    '⚡ Clear Cache',
    '📊 Show System Metrics',
    '🛠️ Generate Export Script',
    '🔒 Security Audit'
];

export default function AiAssistant() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('Rigel AI (Admin Engine)');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: timeStr,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            let responseContent = "I've processed your request for the panel. All system metrics and master table entries are verified and operational.";
            let codeSnippet: string | undefined;
            let badge = "Queried Database • 0.28s";

            if (text.toLowerCase().includes('script') || text.toLowerCase().includes('command') || text.toLowerCase().includes('code')) {
                responseContent = "Here is the optimized PHP Artisan command tailored for your Laravel backend:";
                codeSnippet = `namespace App\\Console\\Commands;

use Illuminate\\Console\\Command;
use Illuminate\\Support\\Facades\\Cache;

class SyncMasterCache extends Command
{
    protected $signature = 'master:sync-cache';
    protected $description = 'Syncs all business categories into Redis cache';

    public function handle()
    {
        Cache::forget('master_categories');
        $this->info('Master cache synchronized successfully!');
    }
}`;
                badge = "Generated Code • 0.42s";
            } else if (text.toLowerCase().includes('cache')) {
                responseContent = "System cache has been analyzed. Total cached keys: 142. Cache driver: Redis. All keys are healthy with no memory leaks detected.";
                badge = "System Audit Complete • 0.19s";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: responseContent,
                badge: badge,
                codeSnippet: codeSnippet,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 1200);
    };

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Head title="Rigel AI | Metronic Admin" />

            <div className="flex h-[calc(100vh-105px)] w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl backdrop-blur-xl">
                {/* Header Bar */}
                <div className="flex h-14 items-center justify-between border-b border-border/50 px-5 bg-card/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-primary/20">
                            <AiIcon className="size-5" />
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm font-bold text-foreground">
                                {selectedModel}
                            </span>
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">AI Engine Active</span>
                    </div>
                </div>

                {/* Messages & Hero Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6" ref={scrollRef}>
                    <div className="mx-auto max-w-4xl space-y-6 pb-32">
                        {/* Welcome Hero State */}
                        {messages.length === 0 && (
                            <div className="py-16 space-y-4 animate-in fade-in duration-500 flex flex-col items-center text-center">
                                <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 border border-primary/20 shadow-lg">
                                    <AiIcon className="size-12" />
                                    <span className="absolute -top-1 -right-1 flex size-3.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex size-3.5 rounded-full bg-blue-500"></span>
                                    </span>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Rigel</span> will assist you on the panel
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
                                    Your dedicated panel AI. Ask questions about database metrics, generate scripts, or perform system health checks.
                                </p>
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                                >
                                    <div className={`flex max-w-[88%] gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="shrink-0 mt-0.5">
                                            {msg.role === 'user' ? (
                                                <img
                                                    className="size-8 rounded-full border border-border/80 shadow-xs"
                                                    src={toAbsoluteUrl('/media/avatars/300-2.png')}
                                                    alt="Admin Avatar"
                                                />
                                            ) : (
                                                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-primary/30 shadow-xs">
                                                    <AiIcon className="size-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 flex-1">
                                            {msg.role === 'ai' && (
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                                    <span className="font-bold text-foreground">Rigel</span>
                                                    {msg.badge && (
                                                        <Badge variant="outline" className="text-[9px] py-0 border-primary/30 text-primary font-mono">
                                                            {msg.badge}
                                                        </Badge>
                                                    )}
                                                    <span>• {msg.timestamp}</span>
                                                </div>
                                            )}

                                            <div
                                                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-xs font-medium'
                                                        : 'bg-muted/40 border border-border/60 text-foreground rounded-tl-xs'
                                                    }`}
                                            >
                                                <p>{msg.content}</p>

                                                {msg.codeSnippet && (
                                                    <div className="mt-3 overflow-hidden rounded-xl border border-border/80 bg-slate-950 text-slate-100 font-mono text-xs shadow-inner">
                                                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-[11px] text-slate-400">
                                                            <span>php</span>
                                                            <button
                                                                onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                                                                className="flex items-center gap-1 hover:text-white transition-colors"
                                                            >
                                                                {copiedId === msg.id ? (
                                                                    <Check className="size-3.5 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="size-3.5" />
                                                                )}
                                                                <span>{copiedId === msg.id ? 'Copied!' : 'Copy Code'}</span>
                                                            </button>
                                                        </div>
                                                        <pre className="p-3.5 overflow-x-auto leading-relaxed text-[11px]">
                                                            <code>{msg.codeSnippet}</code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>

                                            {msg.role === 'ai' && (
                                                <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                                                    <button
                                                        onClick={() => handleCopy(msg.id, msg.content)}
                                                        className="p-1 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                                                        title="Copy response"
                                                    >
                                                        {copiedId === msg.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                                    </button>
                                                    <button
                                                        className="p-1 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                                                        title="Helpful"
                                                    >
                                                        <ThumbsUp className="size-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSend(messages[messages.length - 2]?.content || 'Retry')}
                                                        className="p-1 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                                                        title="Regenerate"
                                                    >
                                                        <RotateCcw className="size-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-3 text-muted-foreground text-xs animate-pulse">
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                        <AiIcon className="size-4" />
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-3.5 py-2.5 border border-border/40">
                                        <span className="size-1.5 rounded-full bg-primary animate-bounce"></span>
                                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                                        <span className="text-[11px] font-medium ml-1.5 text-foreground">Analyzing panel context...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Bottom Input Dock */}
                <div className="relative border-t border-border/40 bg-background/80 p-4 backdrop-blur-xl">
                    <div className="mx-auto max-w-4xl space-y-2.5">
                        {/* Quick Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                            {QUICK_PILLS.map((pill, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(pill)}
                                    className="shrink-0 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all"
                                >
                                    {pill}
                                </button>
                            ))}
                        </div>

                        {/* Input Control */}
                        <div className="relative flex items-center rounded-2xl border border-border/70 bg-card p-2 shadow-lg transition-all focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
                            <Button
                                variant="ghost"
                                mode="icon"
                                size="sm"
                                className="shrink-0 rounded-xl text-muted-foreground hover:text-primary"
                                title="Attach File"
                            >
                                <Paperclip className="size-4" />
                            </Button>

                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                placeholder="Message Rigel (e.g., 'Show total user count' or 'Clear cache')..."
                                className="border-0 bg-transparent text-xs sm:text-sm focus-visible:ring-0 shadow-none px-2 py-2"
                            />

                            <div className="flex items-center gap-1.5 shrink-0">
                                <Button
                                    variant="ghost"
                                    mode="icon"
                                    size="sm"
                                    className="rounded-xl text-muted-foreground hover:text-primary hidden sm:flex"
                                    title="Voice Input"
                                >
                                    <Mic className="size-4" />
                                </Button>

                                <Button
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim()}
                                    className="size-9 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:opacity-95 transition-all disabled:opacity-40"
                                >
                                    <ArrowUp className="size-4.5!" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 px-1">
                            <span>Rigel AI Studio v2.4</span>
                            <span>Press <kbd className="rounded bg-muted px-1 py-0.5 text-[9px] font-mono">Enter</kbd> to send</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AiAssistant.layout = (page: React.ReactNode) => <Demo1Layout>{page}</Demo1Layout>;
