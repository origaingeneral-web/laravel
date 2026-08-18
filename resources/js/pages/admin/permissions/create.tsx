import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Create({ features, selected_feature_id }: any) {
    const { data, setData, post, processing, errors } = useForm({
        feature_id: selected_feature_id?.toString() || '',
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/permissions');
    };

    const selectedFeatureObj = features.find((f: any) => f.id.toString() === data.feature_id);

    const suggestions = ['Job Opening', 'Candidates', 'Interview', 'View', 'Create', 'Edit', 'Delete', 'Manage', 'Export'];

    return (
        <>
            <Head title="Create Permission | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Create Permission"
                        description="Add a permission under a specific feature module."
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
                            <CardTitle className="text-base font-semibold">Permission Details</CardTitle>
                        </div>
                        <CardDescription>Select the feature and provide the permission name.</CardDescription>
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
                                            <SelectValue placeholder="Select Feature (e.g. Recruitment)" />
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
                                        placeholder="e.g. Job Opening, Candidates, Interview"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {/* Suggestions */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <span className="text-xs text-muted-foreground mr-1">Quick Names:</span>
                                    {suggestions.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setData('name', s)}
                                            className="text-xs px-2 py-0.5 rounded border border-border/70 hover:bg-accent transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                {selectedFeatureObj && data.name && (
                                    <div className="p-3 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">Generated Permission Key:</span>{' '}
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
                                    Save Permission
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
