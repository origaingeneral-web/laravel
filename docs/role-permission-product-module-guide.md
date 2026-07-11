# Role and Permission Management for Product-wise Modules

This project already uses the Spatie Permission package through the migration in [database/migrations/2026_07_09_060506_create_permission_tables.php](../database/migrations/2026_07_09_060506_create_permission_tables.php) and the config file [config/permission.php](../config/permission.php).

The product/module schema in [database/migrations/2026_07_09_095818_create_products_table.php](../database/migrations/2026_07_09_095818_create_products_table.php) can be integrated with roles and permissions in a clean way.

## Important for multi-company setup

If you have multiple companies, then checking only by product id is not enough. A product belongs to a company, and a user should be allowed only inside the company they belong to.

So the better rule is:

- Role = what kind of user they are
- Permission = what action they can do
- Company context = which company they are working in
- Product/module = which resource is being accessed

In practice, this means permission checks should be shaped like:

- company.5.products.view
- company.5.products.update
- company.5.modules.12.view

or handled in a policy using both company and product ownership.

## 1. Recommended approach

Use Spatie Roles and Permissions as the main access-control system.

Use your module/product tables as the resource objects that permissions protect.

### Simple rule
- Roles = who the user is
- Permissions = what the user can do
- Product/module records = what resource is being accessed

## 2. How to map your schema

Your tables are conceptually:

- module_products = product master
- module_items = module/item inside a product
- module_files_details = file details for a module

This means permissions can be organized like:

- products.view
- products.create
- products.update
- products.delete

and for module-level access:

- products.{product_id}.modules.view
- products.{product_id}.modules.create
- products.{product_id}.modules.update
- products.{product_id}.modules.delete

## 3. Best practice for role and permission design

### A. Create roles
Example roles:
- super-admin
- admin
- product-manager
- module-user
- viewer

### B. Create permissions by action
Example permissions:
- products.view
- products.create
- products.update
- products.delete
- modules.view
- modules.create
- modules.update
- modules.delete

### C. Assign permissions to roles
Example:
- super-admin -> all permissions
- admin -> all product/module permissions
- product-manager -> view/create/update for assigned products
- module-user -> only specific module permissions
- viewer -> only view permissions

## 4. How to connect this with your product-wise modules

You should not try to store all access logic directly in the role table.
Instead, use permissions + policies.

### Example permission naming
For a product with id = 12:
- products.12.view
- products.12.update

For a module under that product:
- products.12.modules.45.view
- products.12.modules.45.update

This gives you very fine-grained control.

## 5. Recommended implementation pattern

### Step 1: Add HasRoles to the user model
```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
}
```

### Step 2: Create roles and permissions
```php
$superAdmin = Role::create(['name' => 'super-admin']);
$productManager = Role::create(['name' => 'product-manager']);

Permission::create(['name' => 'products.view']);
Permission::create(['name' => 'products.create']);
Permission::create(['name' => 'products.update']);
Permission::create(['name' => 'products.delete']);

$productManager->givePermissionTo([
    'products.view',
    'products.create',
    'products.update',
]);
```

### Step 3: Assign role to user
```php
$user->assignRole('product-manager');
```

### Step 4: Check permission
```php
if ($user->can('products.update')) {
    // allow update
}
```

## 6. Use policies for product-specific access

Spatie handles role/permission checks well, but for product-specific business rules, use Laravel Policies.

Example:
```php
public function update(User $user, Product $product): bool
{
    return $user->can('products.update')
        && $user->hasRole('product-manager')
        && $product->company_id === $user->company_id;
}
```

If you want stricter per-product control:
```php
public function update(User $user, Product $product): bool
{
    return $user->can('products.update')
        && $user->hasPermissionTo('company.' . $product->company_id . '.products.update');
}
```

This is the important part for your case: the check should always include the company context, not only the product id.

## 7. Suggested database design for your case

You can keep the permission tables from Spatie as-is and use your existing module/product tables for resources.

### Suggested permission structure
- Role: admin, manager, viewer
- Permission: products.view, products.update, modules.view
- Resource: module_products, module_items, module_files_details

### Suggested authorization flow
1. User logs in
2. User gets assigned one or more roles
3. Roles receive permissions
4. Controller or policy checks permission
5. Access is allowed or denied

## 8. Recommended rule for your application

For this project, the best structure is:

- Use Spatie for role and permission assignment
- Use product/module tables as the protected resources
- Use policies for permission decisions that depend on the product or module
- Avoid putting large business logic directly into roles

## 9. Example final structure

### Roles
- super-admin
- admin
- product-manager
- module-viewer

### Permissions
- products.view
- products.create
- products.update
- products.delete
- modules.view
- modules.create
- modules.update
- modules.delete

### Access logic
- Super admin: full access
- Admin: full access to all products/modules
- Product manager: access only to assigned products/modules
- Viewer: view only

## 10. Practical recommendation

If you want a simple and maintainable setup:

1. Start with global permissions like products.view and modules.update
2. Add policies for product/module ownership or assignment
3. Later, add more granular permissions if needed

This approach is easier to maintain than trying to create a completely separate custom role system.
