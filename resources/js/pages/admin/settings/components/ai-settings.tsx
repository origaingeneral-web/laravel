import { useState } from 'react';
import {
    Bot,
    Sparkles,
    Cpu,
    Eye,
    EyeOff,
    CheckCircle2,
    Sliders,
    Zap,
    Globe,
    Server,
    ShieldCheck,
    Check,
    Layers,
    Info,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AiSettingsProps {
    data: any;
    setData: (key: string | ((prev: any) => any), value?: any) => void;
    errors?: Record<string, string>;
}

const AI_PROVIDERS = [
    {
        id: 'openai',
        name: 'OpenAI (ChatGPT)',
        subtitle: 'GPT-4o, o1, o3-mini & GPT-4 Turbo',
        color: 'from-emerald-500 to-teal-600',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        defaultModel: 'gpt-4o',
        models: [
            { value: 'gpt-4o', label: 'GPT-4o (Flagship Multimodal)' },
            { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Affordable)' },
            { value: 'o1', label: 'OpenAI o1 (Advanced Reasoning)' },
            { value: 'o3-mini', label: 'OpenAI o3-mini (High Speed Reasoning)' },
            { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'custom', label: 'Custom Model Name...' },
        ],
        defaultBaseUrl: 'https://api.openai.com/v1',
    },
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        subtitle: 'Claude 3.7 Sonnet, Claude 3.5 Haiku',
        color: 'from-amber-500 to-orange-600',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        defaultModel: 'claude-3-5-sonnet-20241022',
        models: [
            { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Hybrid Reasoning)' },
            { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Best Coding & Work)' },
            { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Lightning Fast)' },
            { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
            { value: 'custom', label: 'Custom Model Name...' },
        ],
        defaultBaseUrl: 'https://api.anthropic.com/v1',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        subtitle: 'Gemini 2.0 Flash & Gemini 1.5 Pro',
        color: 'from-blue-500 to-indigo-600',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        defaultModel: 'gemini-2.0-flash',
        models: [
            { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Next-Gen High Speed)' },
            { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (2M Context Window)' },
            { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Ultra Efficient)' },
            { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro' },
            { value: 'custom', label: 'Custom Model Name...' },
        ],
        defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek AI',
        subtitle: 'DeepSeek-V3 & DeepSeek-R1 Reasoner',
        color: 'from-cyan-500 to-blue-600',
        badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        defaultModel: 'deepseek-chat',
        models: [
            { value: 'deepseek-chat', label: 'DeepSeek-V3 (DeepSeek Chat)' },
            { value: 'deepseek-reasoner', label: 'DeepSeek-R1 (DeepSeek Reasoner)' },
            { value: 'custom', label: 'Custom Model Name...' },
        ],
        defaultBaseUrl: 'https://api.deepseek.com',
    },
    {
        id: 'groq',
        name: 'Groq Cloud (LPU)',
        subtitle: 'Sub-second Inference for Llama 3.3',
        color: 'from-rose-500 to-red-600',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        defaultModel: 'llama-3.3-70b-versatile',
        models: [
            { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (Meta)' },
            { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (Ultra Fast)' },
            { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B 32k' },
            { value: 'gemma2-9b-it', label: 'Gemma 2 9B IT (Google)' },
            { value: 'custom', label: 'Custom Model Name...' },
        ],
        defaultBaseUrl: 'https://api.groq.com/openai/v1',
    },
    {
        id: 'custom',
        name: 'Custom API / Ollama',
        subtitle: 'Local Ollama, Together AI, Mistral, vLLM',
        color: 'from-purple-500 to-violet-600',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        defaultModel: '',
        models: [],
        defaultBaseUrl: 'http://localhost:11434/v1',
    },
];

export function AiSettings({ data, setData, errors }: AiSettingsProps) {
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<string>(data.active_ai_provider || 'openai');

    const toggleKeyVisibility = (key: string) => {
        setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const currentActiveProvider = data.active_ai_provider || 'openai';
    const activeProviderObj = AI_PROVIDERS.find((p) => p.id === currentActiveProvider) || AI_PROVIDERS[0];

    const setActiveProvider = (providerId: string) => {
        setData('active_ai_provider', providerId);
    };

    return (
        <div className="space-y-6">
            {/* AI Providers Config Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/40 rounded-xl border border-border/60 gap-1">
                    {AI_PROVIDERS.map((p) => {
                        const isActive = currentActiveProvider === p.id;
                        return (
                            <TabsTrigger
                                key={p.id}
                                value={p.id}
                                className="py-2 px-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                            >
                                <span className="truncate">{p.name.split(' ')[0]}</span>
                                {isActive && (
                                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {/* 1. OpenAI Config */}
                <TabsContent value="openai">
                    <ProviderConfigCard
                        title="OpenAI Configuration"
                        description="Configure your OpenAI API Key for GPT-4o, GPT-4o Mini, and o1 models."
                        providerId="openai"
                        isActive={currentActiveProvider === 'openai'}
                        onActivate={() => setActiveProvider('openai')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="openai_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OpenAI API Key</Label>
                                <div className="relative">
                                    <Input
                                        id="openai_api_key"
                                        type={showKey.openai ? 'text' : 'password'}
                                        value={data.openai_api_key || ''}
                                        onChange={(e) => setData('openai_api_key', e.target.value)}
                                        placeholder="sk-proj-..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('openai')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.openai ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Obtain from your OpenAI Platform Dashboard (platform.openai.com).</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="openai_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</Label>
                                <Select
                                    value={data.openai_model || 'gpt-4o'}
                                    onValueChange={(val) => setData('openai_model', val)}
                                >
                                    <SelectTrigger id="openai_model" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_PROVIDERS.find((p) => p.id === 'openai')?.models.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="openai_organization_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization ID (Optional)</Label>
                                <Input
                                    id="openai_organization_id"
                                    value={data.openai_organization_id || ''}
                                    onChange={(e) => setData('openai_organization_id', e.target.value)}
                                    placeholder="org-..."
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="openai_base_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Base URL (Optional Override / Proxy)</Label>
                                <Input
                                    id="openai_base_url"
                                    value={data.openai_base_url || ''}
                                    onChange={(e) => setData('openai_base_url', e.target.value)}
                                    placeholder="https://api.openai.com/v1"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="openai_max_tokens" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Tokens</Label>
                                <Input
                                    id="openai_max_tokens"
                                    type="number"
                                    value={data.openai_max_tokens || '4096'}
                                    onChange={(e) => setData('openai_max_tokens', e.target.value)}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="openai_temperature" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Temperature (0.0 to 1.0)</Label>
                                <Input
                                    id="openai_temperature"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    value={data.openai_temperature || '0.7'}
                                    onChange={(e) => setData('openai_temperature', e.target.value)}
                                    className="h-10 rounded-lg"
                                />
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>

                {/* 2. Anthropic Claude Config */}
                <TabsContent value="anthropic">
                    <ProviderConfigCard
                        title="Anthropic Claude Configuration"
                        description="Configure Anthropic API keys for Claude 3.7 Sonnet, 3.5 Sonnet, and Claude Haiku."
                        providerId="anthropic"
                        isActive={currentActiveProvider === 'anthropic'}
                        onActivate={() => setActiveProvider('anthropic')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="anthropic_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Anthropic API Key</Label>
                                <div className="relative">
                                    <Input
                                        id="anthropic_api_key"
                                        type={showKey.anthropic ? 'text' : 'password'}
                                        value={data.anthropic_api_key || ''}
                                        onChange={(e) => setData('anthropic_api_key', e.target.value)}
                                        placeholder="sk-ant-api03-..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('anthropic')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.anthropic ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Obtain from console.anthropic.com.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="anthropic_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</Label>
                                <Select
                                    value={data.anthropic_model || 'claude-3-5-sonnet-20241022'}
                                    onValueChange={(val) => setData('anthropic_model', val)}
                                >
                                    <SelectTrigger id="anthropic_model" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Claude Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_PROVIDERS.find((p) => p.id === 'anthropic')?.models.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="anthropic_max_tokens" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Tokens</Label>
                                <Input
                                    id="anthropic_max_tokens"
                                    type="number"
                                    value={data.anthropic_max_tokens || '4096'}
                                    onChange={(e) => setData('anthropic_max_tokens', e.target.value)}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="anthropic_base_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Base URL (Optional Override)</Label>
                                <Input
                                    id="anthropic_base_url"
                                    value={data.anthropic_base_url || ''}
                                    onChange={(e) => setData('anthropic_base_url', e.target.value)}
                                    placeholder="https://api.anthropic.com/v1"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>

                {/* 3. Google Gemini Config */}
                <TabsContent value="gemini">
                    <ProviderConfigCard
                        title="Google Gemini Configuration"
                        description="Configure Google AI Studio API key for Gemini 2.0 Flash and Gemini 1.5 Pro models."
                        providerId="gemini"
                        isActive={currentActiveProvider === 'gemini'}
                        onActivate={() => setActiveProvider('gemini')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="gemini_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Google AI Studio API Key</Label>
                                <div className="relative">
                                    <Input
                                        id="gemini_api_key"
                                        type={showKey.gemini ? 'text' : 'password'}
                                        value={data.gemini_api_key || ''}
                                        onChange={(e) => setData('gemini_api_key', e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('gemini')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.gemini ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Generate your free API key at aistudio.google.com.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gemini_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</Label>
                                <Select
                                    value={data.gemini_model || 'gemini-2.0-flash'}
                                    onValueChange={(val) => setData('gemini_model', val)}
                                >
                                    <SelectTrigger id="gemini_model" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Gemini Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_PROVIDERS.find((p) => p.id === 'gemini')?.models.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gemini_temperature" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Temperature (0.0 to 1.0)</Label>
                                <Input
                                    id="gemini_temperature"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    value={data.gemini_temperature || '0.7'}
                                    onChange={(e) => setData('gemini_temperature', e.target.value)}
                                    className="h-10 rounded-lg"
                                />
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>

                {/* 4. DeepSeek Config */}
                <TabsContent value="deepseek">
                    <ProviderConfigCard
                        title="DeepSeek AI Configuration"
                        description="Configure DeepSeek API Key for DeepSeek-V3 and DeepSeek-R1 reasoning models."
                        providerId="deepseek"
                        isActive={currentActiveProvider === 'deepseek'}
                        onActivate={() => setActiveProvider('deepseek')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="deepseek_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">DeepSeek API Key</Label>
                                <div className="relative">
                                    <Input
                                        id="deepseek_api_key"
                                        type={showKey.deepseek ? 'text' : 'password'}
                                        value={data.deepseek_api_key || ''}
                                        onChange={(e) => setData('deepseek_api_key', e.target.value)}
                                        placeholder="sk-..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('deepseek')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.deepseek ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Obtain from platform.deepseek.com.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deepseek_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</Label>
                                <Select
                                    value={data.deepseek_model || 'deepseek-chat'}
                                    onValueChange={(val) => setData('deepseek_model', val)}
                                >
                                    <SelectTrigger id="deepseek_model" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select DeepSeek Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_PROVIDERS.find((p) => p.id === 'deepseek')?.models.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deepseek_base_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Base URL</Label>
                                <Input
                                    id="deepseek_base_url"
                                    value={data.deepseek_base_url || 'https://api.deepseek.com'}
                                    onChange={(e) => setData('deepseek_base_url', e.target.value)}
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>

                {/* 5. Groq Cloud Config */}
                <TabsContent value="groq">
                    <ProviderConfigCard
                        title="Groq Cloud LPU Configuration"
                        description="Configure Groq Cloud for ultra-fast low-latency token generation."
                        providerId="groq"
                        isActive={currentActiveProvider === 'groq'}
                        onActivate={() => setActiveProvider('groq')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="groq_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Groq API Key</Label>
                                <div className="relative">
                                    <Input
                                        id="groq_api_key"
                                        type={showKey.groq ? 'text' : 'password'}
                                        value={data.groq_api_key || ''}
                                        onChange={(e) => setData('groq_api_key', e.target.value)}
                                        placeholder="gsk_..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('groq')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.groq ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Obtain from console.groq.com/keys.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="groq_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</Label>
                                <Select
                                    value={data.groq_model || 'llama-3.3-70b-versatile'}
                                    onValueChange={(val) => setData('groq_model', val)}
                                >
                                    <SelectTrigger id="groq_model" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Groq Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_PROVIDERS.find((p) => p.id === 'groq')?.models.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="groq_base_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Base URL</Label>
                                <Input
                                    id="groq_base_url"
                                    value={data.groq_base_url || 'https://api.groq.com/openai/v1'}
                                    onChange={(e) => setData('groq_base_url', e.target.value)}
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>

                {/* 6. Custom API / Ollama */}
                <TabsContent value="custom">
                    <ProviderConfigCard
                        title="Custom AI Provider / Local Ollama"
                        description="Connect any OpenAI-compatible endpoint (Ollama, Together AI, Mistral, vLLM, LM Studio)."
                        providerId="custom"
                        isActive={currentActiveProvider === 'custom'}
                        onActivate={() => setActiveProvider('custom')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="custom_ai_provider_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provider / Service Name</Label>
                                <Input
                                    id="custom_ai_provider_name"
                                    value={data.custom_ai_provider_name || ''}
                                    onChange={(e) => setData('custom_ai_provider_name', e.target.value)}
                                    placeholder="e.g. Local Ollama, Together AI, Mistral"
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="custom_ai_model" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model Identifier</Label>
                                <Input
                                    id="custom_ai_model"
                                    value={data.custom_ai_model || ''}
                                    onChange={(e) => setData('custom_ai_model', e.target.value)}
                                    placeholder="e.g. llama3:latest, mistral-large, qwen2.5-coder"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="custom_ai_base_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Base URL</Label>
                                <Input
                                    id="custom_ai_base_url"
                                    value={data.custom_ai_base_url || ''}
                                    onChange={(e) => setData('custom_ai_base_url', e.target.value)}
                                    placeholder="e.g. http://localhost:11434/v1 or https://api.together.xyz/v1"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="custom_ai_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bearer Token / API Key (Optional for Local)</Label>
                                <div className="relative">
                                    <Input
                                        id="custom_ai_api_key"
                                        type={showKey.custom ? 'text' : 'password'}
                                        value={data.custom_ai_api_key || ''}
                                        onChange={(e) => setData('custom_ai_api_key', e.target.value)}
                                        placeholder="Leave empty if local Ollama without auth"
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('custom')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.custom ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ProviderConfigCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ProviderConfigCard({
    title,
    description,
    providerId,
    isActive,
    onActivate,
    children,
}: {
    title: string;
    description: string;
    providerId: string;
    isActive: boolean;
    onActivate: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="p-6 rounded-2xl border border-border/70 bg-card space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                    <h4 className="font-bold text-base text-foreground">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
                <div>
                    {isActive ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="size-4 shrink-0" />
                            <span>Currently Active Engine</span>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onActivate}
                            className="gap-2 h-9 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10"
                        >
                            <Zap className="size-3.5 text-amber-500" />
                            Set As Active Engine
                        </Button>
                    )}
                </div>
            </div>

            {children}
        </div>
    );
}
