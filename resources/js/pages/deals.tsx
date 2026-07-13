import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Deals() {
    return <ModulePage config={adminModuleConfigs.deals} />;
}
