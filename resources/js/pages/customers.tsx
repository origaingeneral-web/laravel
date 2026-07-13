import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Customers() {
    return <ModulePage config={adminModuleConfigs.customers} />;
}
