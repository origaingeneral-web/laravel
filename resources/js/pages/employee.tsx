import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Employee() {
    return <ModulePage config={adminModuleConfigs.employee} />;
}
