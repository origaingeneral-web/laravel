import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type MasterStatus = 'Active' | 'Draft' | 'Archived';

export type MasterFormValues = {
    name: string;
    code: string;
    type: string;
    owner: string;
    status: MasterStatus;
};

type MasterRecordFormProps = {
    values: MasterFormValues;
    onChange: (field: keyof MasterFormValues, value: string) => void;
    idPrefix?: string;
};

export function MasterRecordForm({ values, onChange, idPrefix = 'master' }: MasterRecordFormProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-name`} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Master name
                </Label>
                <Input
                    id={`${idPrefix}-name`}
                    value={values.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    placeholder="Business category"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-code`} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Code
                </Label>
                <Input
                    id={`${idPrefix}-code`}
                    value={values.code}
                    onChange={(event) => onChange('code', event.target.value)}
                    placeholder="BC-001"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-type`} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Type
                </Label>
                <Input
                    id={`${idPrefix}-type`}
                    value={values.type}
                    onChange={(event) => onChange('type', event.target.value)}
                    placeholder="Reference"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-owner`} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Owner
                </Label>
                <Input
                    id={`${idPrefix}-owner`}
                    value={values.owner}
                    onChange={(event) => onChange('owner', event.target.value)}
                    placeholder="Ops Team"
                />
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`${idPrefix}-status`} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Status
                </Label>
                <Select value={values.status} onValueChange={(value) => onChange('status', value)}>
                    <SelectTrigger id={`${idPrefix}-status`} className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export const emptyMasterFormValues: MasterFormValues = {
    name: '',
    code: '',
    type: 'Reference',
    owner: '',
    status: 'Draft',
};
