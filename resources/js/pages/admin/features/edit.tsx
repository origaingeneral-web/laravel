import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Layers, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Edit({ feature, products }: any) {
    const { data, setData, put, processing, errors } = useForm({
        product_id: feature.product_id?.toString() || '',
        name: feature.name || '',
        description: feature.description || '',
        is_addon: !!feature.is_addon,
        price: feature.price ? Number(feature.price).toFixed(2) : '0.00',
        is_active: !!feature.is_active,
        sort_order: feature.sort_order || 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/features/${feature.id}`);
    };

    return (
        <>
            <Head title="Edit Feature | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Edit Feature"
                        description={`Update properties for ${feature.name}`}
                    />
                    <ToolbarActions>
                        <Button asChild variant="outline" className="gap-2 shadow-xs">
                            <Link href="/admin/features">
                                <ArrowLeft className="size-4" />
                                Cancel
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="max-w-2xl mx-auto border-border/50 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b border-border/50">
                        <CardTitle className="text-base font-semibold">Feature Details</CardTitle>
                        <CardDescription>Update name, module type, and pricing.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product <span className="text-destructive">*</span></Label>
                                    <Select 
                                        onValueChange={(val) => setData('product_id', val)}
                                        value={data.product_id}
                                    >
                                        <SelectTrigger id="product_id" className="h-10 rounded-lg">
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-10 rounded-lg"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="rounded-lg resize-none"
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                {/* Feature Type Selector */}
                                <div className="space-y-2 pt-1">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Feature Type <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-muted/40 border border-border/60">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData((prev) => ({ ...prev, is_addon: false, price: '0.00' }));
                                            }}
                                            className={`flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all cursor-pointer ${
                                                !data.is_addon
                                                    ? 'bg-background text-foreground shadow-sm border border-blue-500/40 dark:border-blue-500/60'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 font-semibold text-xs text-blue-600 dark:text-blue-400">
                                                <Layers className="size-3.5" />
                                                <span>Core Feature</span>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground leading-tight">
                                                Default / Free module included with product
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData((prev) => ({ ...prev, is_addon: true }));
                                            }}
                                            className={`flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all cursor-pointer ${
                                                data.is_addon
                                                    ? 'bg-background text-foreground shadow-sm border border-amber-500/50 dark:border-amber-500/70'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-600 dark:text-amber-400">
                                                <Sparkles className="size-3.5" />
                                                <span>Add-on (Paid)</span>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground leading-tight">
                                                Optional paid addon with custom pricing
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Price Field for Add-ons */}
                                {data.is_addon && (
                                    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-1.5 transition-all">
                                        <Label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200 flex items-center justify-between">
                                            <span>Add-on Price (INR) <span className="text-destructive">*</span></span>
                                            <span className="text-[10px] lowercase font-normal text-muted-foreground">cost in ₹ for activating this addon</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                className="h-10 pl-7 text-sm font-semibold rounded-lg bg-background"
                                                required={data.is_addon}
                                            />
                                        </div>
                                        {errors.price && <p className="text-xs font-medium text-destructive">{errors.price}</p>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
                                    <div>
                                        <Label htmlFor="is_active" className="text-xs font-semibold cursor-pointer">Active Status</Label>
                                        <p className="text-[11px] text-muted-foreground">Disable to temporarily hide this feature across the system</p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(c) => setData('is_active', c)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border/60">
                                <Button asChild variant="outline" className="rounded-lg h-9">
                                    <Link href="/admin/features">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Save className="size-4" />
                                    Update Feature
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
