import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function Review() {
    return <ModulePage config={adminModuleConfigs.review} />;
}
