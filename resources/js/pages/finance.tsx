import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Finance() {
    return <ModulePage config={adminModuleConfigs.finance} />;
}
