import { ModulePage } from '@/components/admin/module-page';
import { adminModuleConfigs } from '@/data/admin-modules';

export default function UserManagement() {
    return <ModulePage config={adminModuleConfigs['user-management']} />;
}
