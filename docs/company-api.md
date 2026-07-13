# Company API (multi-product)

Company and employee clients authenticate with Sanctum and call tenant-scoped APIs under `/api/v1/company`.

## Hard rule: one company → many products

A company can subscribe to **multiple products**. Each subscription (`company_products`) has its own:

- plan
- status / expiry
- features
- credits (when applicable)

Do **not** assume one company = one plan.

```
Company (1) ──< company_products >── (N) Product
                     │
                     ├── plan_id
                     ├── status / starts_at / expires_at
                     ├── company_product_feature
                     └── company_product_credits (+ logs)
```

Employees get optional access via `user_product_access`. `company_admin` can use all company products by default.

## Auth

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/login` | Rate-limited (`throttle:login`) |
| POST | `/api/logout` | Revokes current token |
| GET | `/api/me` | User + roles/permissions + company + `products[]` |

### Login / me payload (relevant bits)

```json
{
  "success": true,
  "message": "Authenticated successfully.",
  "data": {
    "token": "...",
    "token_type": "Bearer",
    "user": { "id": 1, "email": "...", "roles": ["company_admin"], "permissions": ["..."] },
    "company": { "id": 1, "company_name": "Test Company", "status": 1 },
    "products": [
      {
        "id": 1,
        "name": "F2 Super",
        "code": "f2_super",
        "status": "active",
        "is_accessible": true,
        "expires_at": "...",
        "plan": { "id": 1, "plan_name": "F2 Starter" }
      },
      {
        "id": 2,
        "name": "Another App",
        "code": "another_app",
        "status": "active",
        "is_accessible": true,
        "expires_at": "...",
        "plan": { "id": 2, "plan_name": "Another Pro" }
      }
    ]
  }
}
```

Login is blocked only when the **company** is inactive, or **all** product subscriptions are inactive/expired. A single expired product does not block login; that product’s routes return 422.

## Company routes (`/api/v1/company`)

All routes: `auth:sanctum` + `company.context` + `role:company_admin|employee`.

Product-scoped routes also use `product.access` (company subscription + user product access + active/non-expired).

| Method | Path | Permission |
|--------|------|------------|
| GET | `/profile` | `company.profile.view` |
| PUT | `/profile` | `company.profile.update` |
| GET | `/employees` | `company.employees.view` |
| POST | `/employees` | `company.employees.manage` |
| GET | `/employees/{id}` | `company.employees.view` |
| PUT | `/employees/{id}` | `company.employees.manage` |
| PATCH | `/employees/{id}/status` | `company.employees.manage` |
| POST | `/employees/{id}/reset-password` | `company.employees.manage` |
| PUT | `/employees/{id}/products` | `company.employees.manage` |
| GET | `/products` | `company.products.view` |
| GET | `/products/{product}` | `company.products.view` |
| GET | `/products/{product}/plan` | `company.plan.view` |
| GET | `/products/{product}/features` | `company.features.view` |
| GET | `/products/{product}/credits` | `company.credits.view` |
| GET | `/products/{product}/credits/logs` | `company.credits.view` |
| POST | `/products/{product}/renewal-requests` | `company.plan.view` |
| POST | `/products/{product}/addon-feature-requests` | `company.features.view` |

`{product}` must be a product linked in `company_products` for the auth user’s company. Others → 404. No user access → 403. Inactive/expired subscription → 422.

## Example requests

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"email":"company.admin@example.com","password":"password"}'

# Profile
curl http://localhost:8000/api/v1/company/profile \
  -H "Authorization: Bearer {token}" -H "Accept: application/json"

# List products for this company (admin sees all; employee sees assigned)
curl http://localhost:8000/api/v1/company/products \
  -H "Authorization: Bearer {token}" -H "Accept: application/json"

# Per-product plan / features / credits
curl http://localhost:8000/api/v1/company/products/1/plan \
  -H "Authorization: Bearer {token}" -H "Accept: application/json"

curl http://localhost:8000/api/v1/company/products/1/features \
  -H "Authorization: Bearer {token}" -H "Accept: application/json"

curl http://localhost:8000/api/v1/company/products/1/credits \
  -H "Authorization: Bearer {token}" -H "Accept: application/json"

# Create employee with product access
curl -X POST http://localhost:8000/api/v1/company/employees \
  -H "Authorization: Bearer {token}" -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"password","password_confirmation":"password","product_ids":[1]}'

# Assign/revoke products
curl -X PUT http://localhost:8000/api/v1/company/employees/2/products \
  -H "Authorization: Bearer {token}" -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"product_ids":[1,2]}'
```

## Seeded demo

| Role | Email | Password | Product access |
|------|-------|----------|----------------|
| company_admin | `company.admin@example.com` | `password` | F2 Super + Another App |
| employee | `employee@example.com` | `password` | F2 Super only |

Company `TEST` is subscribed to both products with different plans/expiry windows.

## Security notes

- Every query is scoped to `auth()->user()->company_id`
- Product routes require `company_products` membership
- Employees only see/use products in `user_product_access`
- Company APIs never adjust credits, plan pricing, or subscription status
- `company_admin` cannot create `super_admin` users

## Scale notes (10M+ users direction)

- Hot-path composite indexes on `users`, `company_products`, `user_product_access`, `company_product_feature`
- Product middleware: one subscription lookup (no duplicate `exists`)
- Product list: one grouped feature-count query (no N+1)
- Features: pivot columns selected in the same join
- Employee list: company-scoped, capped `per_page` (max 50), prefix search
- Credits GET is read-only (no auto-insert)
- Company API rate limit: 120 req/min/user (`throttle:company-api`)
- Use Redis for cache/queue/sessions in production (Spatie permission cache is already 24h)
