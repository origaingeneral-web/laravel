import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Sales() {
    return <ModulePage config={adminModuleConfigs.sales} />;
}
