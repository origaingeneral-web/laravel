import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Edit({ permission, features }: any) {
    const rawName = permission.name || '';
    const featureCode = permission.feature?.code;
    const displayName = featureCode && rawName.startsWith(`${featureCode}.`)
        ? rawName.substring(featureCode.length + 1)
        : rawName;

    const { data, setData, put, processing, errors } = useForm({
        feature_id: permission.feature_id?.toString() || '',
        name: displayName,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/permissions/${permission.id}`);
    };

    const selectedFeatureObj = features.find((f: any) => f.id.toString() === data.feature_id);

    return (
        <>
            <Head title="Edit Permission | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Edit Permission"
                        description={`Update permission ${permission.name}`}
                    />
                    <ToolbarActions>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/permissions">
                                <ArrowLeft className="size-4" />
                                Cancel
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <Card className="max-w-2xl mx-auto border-border/50 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <KeyRound className="size-5 text-primary" />
                            <CardTitle className="text-base font-semibold">Edit Permission</CardTitle>
                        </div>
                        <CardDescription>Update name or change feature association.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="feature_id">Feature</Label>
                                    <Select 
                                        onValueChange={(val) => setData('feature_id', val)}
                                        value={data.feature_id}
                                    >
                                        <SelectTrigger id="feature_id">
                                            <SelectValue placeholder="Select Feature" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {features.map((f: any) => (
                                                <SelectItem key={f.id} value={f.id.toString()}>
                                                    {f.name} {f.product ? `(${f.product.name})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.feature_id && <p className="text-sm text-destructive">{errors.feature_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Permission Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {selectedFeatureObj && data.name && (
                                    <div className="p-3 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">Permission Key:</span>{' '}
                                        <span className="font-mono text-primary font-semibold">
                                            {selectedFeatureObj.code}.{data.name.trim().toLowerCase().replace(/\s+/g, '_')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button asChild variant="outline">
                                    <Link href="/admin/permissions">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    Update Permission
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
