import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Edit({ feature, products }: any) {
    const { data, setData, put, processing, errors } = useForm({
        product_id: feature.product_id.toString(),
        name: feature.name,
        code: feature.code,
        description: feature.description || '',
        is_addon: feature.is_addon,
        is_active: feature.is_active,
        sort_order: feature.sort_order,
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
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/features">
                                <ArrowLeft className="size-4" />
                                Cancel
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="max-w-2xl mx-auto border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="product_id">Product</Label>
                                    <Select 
                                        onValueChange={(val) => setData('product_id', val)}
                                        value={data.product_id}
                                    >
                                        <SelectTrigger>
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
                                    <Label htmlFor="name">Feature Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="flex items-center gap-6 md:col-span-2 mt-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(c) => setData('is_active', c)}
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_addon"
                                            checked={data.is_addon}
                                            onCheckedChange={(c) => setData('is_addon', c)}
                                        />
                                        <Label htmlFor="is_addon">Is Add-on Feature</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={processing} className="gap-2">
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
