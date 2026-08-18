# Project File Structure

> **Project:** Laravel 13 + Inertia v3 + React 19 + Tailwind CSS Application  
> **Last Updated:** 2026-08-18  
> **Generated File:** `FILE_STRUCTURE.md`

---

## 📁 Directory Overview

| Directory | Purpose / Description |
| :--- | :--- |
| [`app/`](file:///c:/Project/laravel/app) | Core PHP backend logic (Controllers, Models, Services, Middleware, Enums, Traits, DTOs). |
| [`bootstrap/`](file:///c:/Project/laravel/bootstrap) | Framework bootstrap and application configuration (`app.php`, `providers.php`). |
| [`config/`](file:///c:/Project/laravel/config) | Application and package configuration files. |
| [`database/`](file:///c:/Project/laravel/database) | Database migrations, model factories, and seeders. |
| [`docs/`](file:///c:/Project/laravel/docs) | Project documentation, API specs, and mockups. |
| [`public/`](file:///c:/Project/laravel/public) | Public web root containing `index.php`, build assets, icons, fonts, and images. |
| [`resources/`](file:///c:/Project/laravel/resources) | Frontend source code (Inertia React pages, components, layouts, hooks, actions/routes, CSS). |
| [`routes/`](file:///c:/Project/laravel/routes) | HTTP routing definitions (`web.php`, `api.php`, `admin.php`, `auth.php`, `settings.php`, `admin/master.php`). |
| [`storage/`](file:///c:/Project/laravel/storage) | File uploads, database backups, cache, and system logs. |
| [`tests/`](file:///c:/Project/laravel/tests) | Automated Pest & PHPUnit test suites (Feature & Unit tests). |

---

## 🌲 Full Directory Tree

```text
laravel/
├── .github/
│   ├── workflows/
│   │   ├── lint.yml
│   │   └── tests.yml
│   └── dependabot.yml
├── app/
│   ├── Concerns/
│   │   ├── InteractsWithTwoFactorState.php
│   │   ├── PasswordValidationRules.php
│   │   ├── ProfileValidationRules.php
│   │   └── TwoFactorAuthenticatable.php
│   ├── Enums/
│   │   ├── CompanyStatus.php
│   │   ├── PermissionName.php
│   │   └── RoleName.php
│   ├── Http/
│   │   ├── Concerns/
│   │   │   └── RespondsWithJson.php
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── Communication/
│   │   │   │   │   └── CommunicationLogController.php
│   │   │   │   ├── Company/
│   │   │   │   │   ├── CompanyController.php
│   │   │   │   │   └── CompanyProductAssignmentController.php
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── DashboardController.php
│   │   │   │   ├── Feature/
│   │   │   │   │   └── FeatureController.php
│   │   │   │   ├── Master/
│   │   │   │   │   ├── AreaWebController.php
│   │   │   │   │   ├── BusinessCategoryWebController.php
│   │   │   │   │   ├── CityWebController.php
│   │   │   │   │   ├── CountryWebController.php
│   │   │   │   │   ├── LanguageWebController.php
│   │   │   │   │   ├── PlanWebController.php
│   │   │   │   │   └── StateWebController.php
│   │   │   │   ├── Notification/
│   │   │   │   │   └── NotificationController.php
│   │   │   │   ├── Payment/
│   │   │   │   │   └── PaymentController.php
│   │   │   │   ├── Permission/
│   │   │   │   │   └── PermissionController.php
│   │   │   │   ├── Security/
│   │   │   │   │   └── SecretAccessController.php
│   │   │   │   ├── Setting/
│   │   │   │   │   └── SettingController.php
│   │   │   │   ├── Subscription/
│   │   │   │   │   └── SubscriptionController.php
│   │   │   │   ├── System/
│   │   │   │   │   ├── DatabaseController.php
│   │   │   │   │   ├── EnvController.php
│   │   │   │   │   └── ServerController.php
│   │   │   │   └── Template/
│   │   │   │       └── NotificationTemplateController.php
│   │   │   ├── Api/
│   │   │   │   ├── Admin/
│   │   │   │   │   └── Master/
│   │   │   │   │       ├── AreaApiController.php
│   │   │   │   │       ├── BusinessCategoryApiController.php
│   │   │   │   │       ├── CityApiController.php
│   │   │   │   │       ├── CountryApiController.php
│   │   │   │   │       ├── LanguageApiController.php
│   │   │   │   │       ├── PlanApiController.php
│   │   │   │   │       └── StateApiController.php
│   │   │   │   ├── Auth/
│   │   │   │   │   └── AuthController.php
│   │   │   │   └── Company/
│   │   │   │       ├── Employee/
│   │   │   │       │   └── EmployeeController.php
│   │   │   │       ├── Product/
│   │   │   │       │   ├── ProductAddonFeatureRequestController.php
│   │   │   │       │   ├── ProductController.php
│   │   │   │       │   ├── ProductCreditController.php
│   │   │   │       │   ├── ProductFeatureController.php
│   │   │   │       │   ├── ProductPlanController.php
│   │   │   │       │   └── ProductRenewalRequestController.php
│   │   │   │       └── Profile/
│   │   │   │           └── ProfileController.php
│   │   │   ├── Auth/
│   │   │   │   ├── AdminLoginController.php
│   │   │   │   ├── AuthenticatedSessionController.php
│   │   │   │   ├── ConfirmablePasswordController.php
│   │   │   │   ├── ConfirmedPasswordStatusController.php
│   │   │   │   ├── ConfirmedTwoFactorAuthenticationController.php
│   │   │   │   ├── EmailVerificationNotificationController.php
│   │   │   │   ├── EmailVerificationPromptController.php
│   │   │   │   ├── NewPasswordController.php
│   │   │   │   ├── PasswordResetLinkController.php
│   │   │   │   ├── RecoveryCodeController.php
│   │   │   │   ├── TwoFactorAuthenticatedSessionController.php
│   │   │   │   ├── TwoFactorAuthenticationController.php
│   │   │   │   ├── TwoFactorQrCodeController.php
│   │   │   │   ├── TwoFactorSecretKeyController.php
│   │   │   │   └── VerifyEmailController.php
│   │   │   ├── Settings/
│   │   │   │   ├── ProfileController.php
│   │   │   │   └── SecurityController.php
│   │   │   └── Controller.php
│   │   ├── Middleware/
│   │   │   ├── EnsureAdminAccess.php
│   │   │   ├── EnsureCompanyContext.php
│   │   │   ├── EnsureProductAccess.php
│   │   │   ├── EnsureSuperAdminSecretVerified.php
│   │   │   ├── ExpireSuperAdminSecretOnOtherPages.php
│   │   │   ├── HandleAppearance.php
│   │   │   └── HandleInertiaRequests.php
│   │   ├── Requests/
│   │   │   ├── Admin/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── StoreCompanyRequest.php
│   │   │   │   ├── SyncCompanyProductFeaturesRequest.php
│   │   │   │   ├── SyncCompanyProductsRequest.php
│   │   │   │   └── UpdateCompanyRequest.php
│   │   │   ├── Api/
│   │   │   │   ├── Company/
│   │   │   │   │   ├── ResetEmployeePasswordRequest.php
│   │   │   │   │   ├── StoreAddonFeatureRequest.php
│   │   │   │   │   ├── StoreEmployeeRequest.php
│   │   │   │   │   ├── SyncEmployeeProductsRequest.php
│   │   │   │   │   ├── UpdateCompanyProfileRequest.php
│   │   │   │   │   ├── UpdateEmployeeRequest.php
│   │   │   │   │   └── UpdateEmployeeStatusRequest.php
│   │   │   │   └── LoginRequest.php
│   │   │   ├── Auth/
│   │   │   │   ├── EmailVerificationRequest.php
│   │   │   │   └── TwoFactorLoginRequest.php
│   │   │   └── Settings/
│   │   │       ├── PasswordUpdateRequest.php
│   │   │       ├── ProfileDeleteRequest.php
│   │   │       ├── ProfileUpdateRequest.php
│   │   │       └── TwoFactorAuthenticationRequest.php
│   │   └── Resources/
│   │       └── Api/
│   │           ├── Company/
│   │           │   ├── AddonFeatureRequestResource.php
│   │           │   ├── CompanyProductPlanResource.php
│   │           │   ├── CompanyProductResource.php
│   │           │   ├── CompanyProductSummaryResource.php
│   │           │   ├── CompanyResource.php
│   │           │   ├── CompanySummaryResource.php
│   │           │   ├── CreditLogResource.php
│   │           │   ├── CreditResource.php
│   │           │   ├── EmployeeResource.php
│   │           │   └── FeatureResource.php
│   │           └── UserResource.php
│   ├── Models/
│   │   ├── Admin/
│   │   │   ├── Communication/
│   │   │   │   └── CommunicationLog.php
│   │   │   ├── Feature/
│   │   │   │   └── Feature.php
│   │   │   ├── Master/
│   │   │   │   ├── Area.php
│   │   │   │   ├── BusinessCategory.php
│   │   │   │   ├── City.php
│   │   │   │   ├── Country.php
│   │   │   │   ├── Language.php
│   │   │   │   ├── Plan.php
│   │   │   │   └── State.php
│   │   │   ├── Notification/
│   │   │   │   └── AppAnnouncement.php
│   │   │   ├── Payment/
│   │   │   │   └── Payment.php
│   │   │   ├── Setting/
│   │   │   │   └── Setting.php
│   │   │   └── Template/
│   │   │       └── NotificationTemplate.php
│   │   ├── Auth/
│   │   │   ├── Permission.php
│   │   │   └── SuperAdmin.php
│   │   ├── Company/
│   │   │   ├── Company.php
│   │   │   ├── CompanyProduct.php
│   │   │   ├── CompanyProductCredit.php
│   │   │   └── CompanyProductCreditLog.php
│   │   ├── Product/
│   │   │   ├── AddonFeatureRequest.php
│   │   │   ├── Product.php
│   │   │   ├── RenewalRequest.php
│   │   │   └── UserProductAccess.php
│   │   └── User.php
│   ├── Policies/
│   │   ├── CompanyPolicy.php
│   │   └── EmployeePolicy.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── TelescopeServiceProvider.php
│   ├── Services/
│   │   ├── FirebaseService.php
│   │   └── TwoFactorAuthenticationProvider.php
│   └── Support/
│       └── RecoveryCode.php
├── bootstrap/
│   ├── cache/
│   │   ├── .gitignore
│   │   ├── packages.php
│   │   └── services.php
│   ├── app.php
│   └── providers.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── inertia.php
│   ├── logging.php
│   ├── mail.php
│   ├── permission.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── services.php
│   ├── session.php
│   └── telescope.php
├── database/
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_super_admin_masters_table.php
│   │   ├── 0001_01_01_000000_create_super_users_table.php
│   │   ├── 0001_01_01_000001_create_companies_table.php
│   │   ├── 0001_01_01_000002_create_users_table.php
│   │   ├── 0001_01_01_000003_add_two_factor_columns_to_users_table.php
│   │   ├── 0001_01_01_000003_create_cache_table.php
│   │   ├── 0001_01_01_000003_create_jobs_table.php
│   │   ├── 0001_01_01_000003_create_passkeys_table.php
│   │   ├── 0001_01_01_000003_create_personal_access_tokens_table.php
│   │   ├── 2026_07_09_060506_create_permission_tables.php
│   │   ├── 2026_07_09_060652_create_media_table.php
│   │   ├── 2026_07_09_081254_create_fcm_tokens_table.php
│   │   ├── 2026_07_09_095818_create_software_products_table.php
│   │   ├── 2026_07_13_112641_add_is_active_and_nullable_company_id_to_users_table.php
│   │   ├── 2026_07_13_120634_create_company_subscription_and_credits_tables.php
│   │   ├── 2026_07_13_121321_refactor_company_subscriptions_to_multi_product.php
│   │   ├── 2026_07_13_122605_add_scale_indexes_for_company_api_tables.php
│   │   ├── 2026_08_11_102306_create_telescope_entries_table.php
│   │   ├── 2026_08_13_060554_add_features_to_plans_table.php
│   │   ├── 2026_08_13_061915_create_payments_table.php
│   │   ├── 2026_08_13_063843_create_settings_table.php
│   │   ├── 2026_08_13_065045_create_notification_templates_table.php
│   │   ├── 2026_08_13_071310_create_communication_logs_table.php
│   │   ├── 2026_08_13_090628_create_app_announcements_table.php
│   │   ├── 2026_08_18_100000_add_feature_id_to_permissions_table.php
│   │   └── 2026_08_18_130000_add_secret_password_to_super_admin_table.php
│   ├── seeders/
│   │   ├── CompanyDemoSeeder.php
│   │   ├── DatabaseSeeder.php
│   │   ├── DemoCompanySeeder.php
│   │   ├── RolePermissionSeeder.php
│   │   ├── SuperAdminMasterSeeder.php
│   │   └── SuperAdminSeeder.php
│   └── .gitignore
├── docs/
│   ├── company-api.md
│   └── role-permission-product-module-guide.md
├── public/
│   ├── build/
│   │   ├── assets/
│   │   │   ├── 404-CsZYt5I0.js
│   │   │   ├── 500-C44t-ywZ.js
│   │   │   ├── account-D0lxPRS7.js
│   │   │   ├── activity-DDNBpHu1.js
│   │   │   ├── admin-dashboard-ev6WLgtV.js
│   │   │   ├── admin-login-BUXZwW3j.js
│   │   │   ├── admin-login-CFqtzyD7.js
│   │   │   ├── admin-navigation-ubfCtIQI.js
│   │   │   ├── ai-assistant-DlroyoXy.js
│   │   │   ├── ai-settings-DwOneFX_.js
│   │   │   ├── alert-DfY3gfm8.js
│   │   │   ├── app-DlbKriPj.css
│   │   │   ├── app-tTyEoQEa.js
│   │   │   ├── arrow-down-CtSq7HvA.js
│   │   │   ├── arrow-left-BY00FugD.js
│   │   │   ├── arrow-up-DpUSDW4X.js
│   │   │   ├── auth-account-deactivated-page-BxaEtQk_.js
│   │   │   ├── auth-get-started-page-priMa8sX.js
│   │   │   ├── auth-welcome-message-page-BI-DFrjj.js
│   │   │   ├── avatar-BxZTYBzh.js
│   │   │   ├── avatar-group-MkZwkGfs.js
│   │   │   ├── badge-check-DMTed8Q1.js
│   │   │   ├── badge-iShLjRBw.js
│   │   │   ├── building-2-D_qJ61LH.js
│   │   │   ├── business-categories-lTWrSQ3c.js
│   │   │   ├── button-CywIBlX3.js
│   │   │   ├── calendar-days-C8L5Ys6C.js
│   │   │   ├── card-BqN2B519.js
│   │   │   ├── channel-stats-C61kk3v8.js
│   │   │   ├── check-BfZ4UOqC.js
│   │   │   ├── checkbox-BJY53n8N.js
│   │   │   ├── chevron-down-D7CskZFj.js
│   │   │   ├── chevron-left-BC94k2qH.js
│   │   │   ├── chevron-right-Dg_fBOwl.js
│   │   │   ├── circle-alert-BiABcCrQ.js
│   │   │   ├── circle-B3CoKWh0.js
│   │   │   ├── circle-check-DCvBUMaU.js
│   │   │   ├── circle-x-C81iOnSm.js
│   │   │   ├── clock-DAFdfMre.js
│   │   │   ├── cloud-upload-CKtYH9-7.js
│   │   │   ├── companies-DkOTwFo5.js
│   │   │   ├── components-C7X80sMp.js
│   │   │   ├── confirm-DPhVjA50.js
│   │   │   ├── confirm-password-C2VZ-cqQ.js
│   │   │   ├── container-DZofxiaV.js
│   │   │   ├── copy-DOXeK1-Q.js
│   │   │   ├── create-aJHSsp7n.js
│   │   │   ├── create-Bw4MoWX2.js
│   │   │   ├── create-BWWa4yUb.js
│   │   │   ├── create-DcQ62LSS.js
│   │   │   ├── create-DuCUHdj8.js
│   │   │   ├── create-N42uVRow.js
│   │   │   ├── createLucideIcon-DdCSgu1q.js
│   │   │   ├── credit-card-KOXCsXGq.js
│   │   │   ├── dashboard-8NJ_pjK5.js
│   │   │   ├── dashboard-Cw-_-VKT.js
│   │   │   ├── database-B0Zu_brL.js
│   │   │   ├── default-page-BP60JgCV.js
│   │   │   ├── demo1-BY7eL53w.js
│   │   │   ├── demo1-dark-sidebar-page-CnRlUoPs.js
│   │   │   ├── demo1-light-sidebar-content-CGDbmTPc.js
│   │   │   ├── demo2-content-DktyHeCs.js
│   │   │   ├── demo2-DtgS30OE.js
│   │   │   ├── demo3-aVX0Sgq2.js
│   │   │   ├── demo3-content-CD53D_Ih.js
│   │   │   ├── demo5-content-766rTko4.js
│   │   │   ├── demo5-KbZQSwiZ.js
│   │   │   ├── dialog-CQ4RoF2W.js
│   │   │   ├── dist--U3HNccw.js
│   │   │   ├── dist-6_Xj1pnf.js
│   │   │   ├── dist-6MNa2prT.js
│   │   │   ├── dist-BdS8Oe-8.js
│   │   │   ├── dist-BDStEXXx.js
│   │   │   ├── dist-Bg7Qpw3V.js
│   │   │   ├── dist-Bm9vbUjM.js
│   │   │   ├── dist-C1RJhgYD.js
│   │   │   ├── dist-CkRcHYNx.js
│   │   │   ├── dist-COTlbI3Z.js
│   │   │   ├── dist-D8Wfxh48.js
│   │   │   ├── dist-Dn9oSco2.js
│   │   │   ├── dist-HdpVd4Y_.js
│   │   │   ├── dist-JZJdf-NX.js
│   │   │   ├── dist-lJ2U3wBr.js
│   │   │   ├── dist-OtPNyg64.js
│   │   │   ├── dist-WMZxjwgx.js
│   │   │   ├── download-B4yzpDDo.js
│   │   │   ├── dropdown-menu-4-DD8Q3qbu.js
│   │   │   ├── dropdown-menu-BGMLvFUl.js
│   │   │   ├── dynamic-table-HrVfABf7.js
│   │   │   ├── earnings-chart-Or-DD8q2.js
│   │   │   ├── edit-BicBzDL8.js
│   │   │   ├── edit-BNsVVfoc.js
│   │   │   ├── edit-C86ASVXP.js
│   │   │   ├── edit-CjPurcIY.js
│   │   │   ├── ellipsis-vertical-Dcu6-CVg.js
│   │   │   ├── entry-callout-Dn18MRYs.js
│   │   │   ├── env-t3I3wSpl.js
│   │   │   ├── es2015-DUG_5yl7.js
│   │   │   ├── eye-D6DO1F2V.js
│   │   │   ├── eye-off-DD7C9teo.js
│   │   │   ├── features-Cl5MS_3e.js
│   │   │   ├── file-code-_pLS7dIt.js
│   │   │   ├── firebase-C52D9tXR.js
│   │   │   ├── flame-0TxTLs39.js
│   │   │   ├── folder-plus-DK1FIhn5.js
│   │   │   ├── fonts-DkuEHybc.css
│   │   │   ├── forgot-password-h6DOyK9w.js
│   │   │   ├── get-started-DJLVlyev.js
│   │   │   ├── globe-Bdn7QsPh.js
│   │   │   ├── helpers-Dfvzj6n2.js
│   │   │   ├── highlights-Bjv6pxbH.js
│   │   │   ├── image-SsddMneZ.js
│   │   │   ├── info-DKNoYKFq.js
│   │   │   ├── input-C3o7E2Ze.js
│   │   │   ├── input-error-PRzde4C0.js
│   │   │   ├── instrument-sans-400-normal-D1W7dsQl.woff
│   │   │   ├── instrument-sans-400-normal-DRC__1Mx.woff2
│   │   │   ├── instrument-sans-400-normal-Q_nF8v4l.woff2
│   │   │   ├── instrument-sans-400-normal-r32jotim.woff
│   │   │   ├── instrument-sans-500-normal-CAxz3nsc.woff
│   │   │   ├── instrument-sans-500-normal-CTEe1bJa.woff2
│   │   │   ├── instrument-sans-500-normal-Dk9ku72i.woff2
│   │   │   ├── instrument-sans-500-normal-Z6ESRlEs.woff
│   │   │   ├── instrument-sans-600-normal-B7fBEWYG.woff2
│   │   │   ├── instrument-sans-600-normal-B9e8oLYv.woff
│   │   │   ├── instrument-sans-600-normal-BsaQcF38.woff2
│   │   │   ├── instrument-sans-600-normal-DMks36a2.woff
│   │   │   ├── integrations-CLOeD_n0.js
│   │   │   ├── integrations-CswZXEAe.js
│   │   │   ├── jsx-runtime-BPxG5C_m.js
│   │   │   ├── key-round-DzcH9s4a.js
│   │   │   ├── label-CKeDEjoX.js
│   │   │   ├── layers-BkbiXo_p.js
│   │   │   ├── layout-Bq8EZODy.js
│   │   │   ├── light-sidebar-DRaGVz0G.js
│   │   │   ├── loader-circle-BEzxEdW_.js
│   │   │   ├── location-settings-aNodjy-x.js
│   │   │   ├── log-out-DwDXuM_e.js
│   │   │   ├── login-CNb5yjn5.js
│   │   │   ├── logs-DVfdKfqC.js
│   │   │   ├── mail-BKnJ-B1B.js
│   │   │   ├── manage-data-uhsEqTWg.js
│   │   │   ├── map-pin-DDn1yNtu.js
│   │   │   ├── masters-lNSlWAvC.js
│   │   │   ├── my-balance-B3H7xntJ.js
│   │   │   ├── options-BSs7P-2V.js
│   │   │   ├── options-FGxkI8V-.js
│   │   │   ├── panel-eANo-kXj.js
│   │   │   ├── password-BASKH8a-.js
│   │   │   ├── password-input-CxKCuQtM.js
│   │   │   ├── payments-Ct2RPU0g.js
│   │   │   ├── pencil-1DeTO3kt.js
│   │   │   ├── permissions-DU4--aXz.js
│   │   │   ├── phone-D0591m0T.js
│   │   │   ├── plus-DhoB4KZh.js
│   │   │   ├── popover-BKOpcYoE.js
│   │   │   ├── privacy-settings-DdhuwA-u.js
│   │   │   ├── progress-CYhvVFgR.js
│   │   │   ├── react-apexcharts.min-Dxe6O8s1.js
│   │   │   ├── react-B4USgXNA.js
│   │   │   ├── react-dom-DoKSefgj.js
│   │   │   ├── react-router-dom-adapter-CUpI65kn.js
│   │   │   ├── refresh-cw-oTIhcFn7.js
│   │   │   ├── register-1WAnBFGh.js
│   │   │   ├── reset-password-AyGV9bYB.js
│   │   │   ├── routes-X_SyEPg_.js
│   │   │   ├── save-BAGXsmZg.js
│   │   │   ├── scroll-area-DABICZyE.js
│   │   │   ├── search-Dszy_exH.js
│   │   │   ├── secret-access-RBwkYi0t.js
│   │   │   ├── select-C8tzdMmK.js
│   │   │   ├── send-MFWmG5CC.js
│   │   │   ├── server-BiJFPuQF.js
│   │   │   ├── server-CYnQYTOw.js
│   │   │   ├── settings-dMsAphel.js
│   │   │   ├── shield-alert-DXtge3uB.js
│   │   │   ├── shield-check-C0zTRTUj.js
│   │   │   ├── show-DSIVjFVD.js
│   │   │   ├── skeleton-BCgzzEY6.js
│   │   │   ├── sliders-horizontal-DUT7P7BQ.js
│   │   │   ├── spinner-BAzYLv_E.js
│   │   │   ├── square-pen-M4-4WuqQ.js
│   │   │   ├── subscriptions-CNO4oHOz.js
│   │   │   ├── switch-XuKgTYao.js
│   │   │   ├── tabs-CpkPTtF_.js
│   │   │   ├── team-info-Cj_Ym9cd.js
│   │   │   ├── team-meeting-CeHcdlnj.js
│   │   │   ├── teams-BwEQ1Wrc.js
│   │   │   ├── templates-CgYeBhuU.js
│   │   │   ├── text-link-B78sdf4u.js
│   │   │   ├── textarea-gK_rLfzR.js
│   │   │   ├── toolbar-A_FfitJu.js
│   │   │   ├── toolbar-DkZ1uHXP.js
│   │   │   ├── trash-2-BDScQYl0.js
│   │   │   ├── trending-up-BKL61fJe.js
│   │   │   ├── triangle-alert-hGs8IZQ2.js
│   │   │   ├── two-factor-challenge-DYJyl10h.js
│   │   │   ├── upload-BSATGgU4.js
│   │   │   ├── user-CHmelhiy.js
│   │   │   ├── user-profile-Df-8twiq.js
│   │   │   ├── user-round-BmW-sECb.js
│   │   │   ├── users-Ddg18C3j.js
│   │   │   ├── utils-B6KiDbIe.js
│   │   │   ├── verify-email-Xm17UEvl.js
│   │   │   ├── wayfinder-Bh70ToPC.js
│   │   │   ├── welcome-SpAB6wc7.js
│   │   │   ├── x-CbQ6A5__.js
│   │   │   └── zap-CPz2XRx0.js
│   │   ├── fonts-manifest.json
│   │   └── manifest.json
│   ├── media/
│   │   ├── app/
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── auth-bg.png
│   │   │   ├── auth-screen.png
│   │   │   ├── default-logo-dark.svg
│   │   │   ├── default-logo.svg
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon.ico
│   │   │   ├── mini-logo-circle-dark.svg
│   │   │   ├── mini-logo-circle-primary-dark.svg
│   │   │   ├── mini-logo-circle-primary.svg
│   │   │   ├── mini-logo-circle-success.svg
│   │   │   ├── mini-logo-circle.svg
│   │   │   ├── mini-logo-gray-dark.svg
│   │   │   ├── mini-logo-gray.svg
│   │   │   ├── mini-logo-primary-dark.svg
│   │   │   ├── mini-logo-primary.svg
│   │   │   ├── mini-logo-square-gray-dark.svg
│   │   │   ├── mini-logo-square-gray.svg
│   │   │   ├── mini-logo.svg
│   │   │   └── og-image.png
│   │   ├── avatars/
│   │   │   ├── gray/
│   │   │   │   ├── 1.png
│   │   │   │   ├── 2.png
│   │   │   │   ├── 3.png
│   │   │   │   ├── 4.png
│   │   │   │   └── 5.png
│   │   │   ├── 300-1.png
│   │   │   ├── 300-10.png
│   │   │   ├── 300-11.png
│   │   │   ├── 300-12.png
│   │   │   ├── 300-13.png
│   │   │   ├── 300-14.png
│   │   │   ├── 300-15.png
│   │   │   ├── 300-16.png
│   │   │   ├── 300-17.png
│   │   │   ├── 300-18.png
│   │   │   ├── 300-19.png
│   │   │   ├── 300-2.png
│   │   │   ├── 300-20.png
│   │   │   ├── 300-21.png
│   │   │   ├── 300-22.png
│   │   │   ├── 300-23.png
│   │   │   ├── 300-24.png
│   │   │   ├── 300-25.png
│   │   │   ├── 300-26.png
│   │   │   ├── 300-27.png
│   │   │   ├── 300-28.png
│   │   │   ├── 300-29.png
│   │   │   ├── 300-3.png
│   │   │   ├── 300-30.png
│   │   │   ├── 300-31.png
│   │   │   ├── 300-32.png
│   │   │   ├── 300-33.png
│   │   │   ├── 300-34.png
│   │   │   ├── 300-4.png
│   │   │   ├── 300-5.png
│   │   │   ├── 300-6.png
│   │   │   ├── 300-7.png
│   │   │   ├── 300-8.png
│   │   │   ├── 300-9.png
│   │   │   └── blank.png
│   │   ├── banners/
│   │   │   ├── button-dark.svg
│   │   │   └── button-red.svg
│   │   ├── brand-logos/
│   │   │   ├── airbnb-2.svg
│   │   │   ├── amazon-2.svg
│   │   │   ├── amazon-dark.svg
│   │   │   ├── amazon.svg
│   │   │   ├── american-express.svg
│   │   │   ├── android.svg
│   │   │   ├── angular.svg
│   │   │   ├── apple-black.svg
│   │   │   ├── apple-white.svg
│   │   │   ├── atica.svg
│   │   │   ├── azure.svg
│   │   │   ├── beats-electronics.svg
│   │   │   ├── bithumb.svg
│   │   │   ├── bitsane.svg
│   │   │   ├── blazor.svg
│   │   │   ├── bookingcom.svg
│   │   │   ├── boomerang.svg
│   │   │   ├── bootstrap.svg
│   │   │   ├── bridgefy.svg
│   │   │   ├── btcchina.svg
│   │   │   ├── btcexchange.svg
│   │   │   ├── casual-hookups.svg
│   │   │   ├── chrome.svg
│   │   │   ├── cloud-one.svg
│   │   │   ├── clusterhq.svg
│   │   │   ├── codeigniter.svg
│   │   │   ├── coinhodler.svg
│   │   │   ├── coinranking.svg
│   │   │   ├── css.svg
│   │   │   ├── datatables.svg
│   │   │   ├── discord.svg
│   │   │   ├── discover.svg
│   │   │   ├── disqus.svg
│   │   │   ├── divi.svg
│   │   │   ├── django.svg
│   │   │   ├── dribbble.svg
│   │   │   ├── duolingo.svg
│   │   │   ├── ebay.svg
│   │   │   ├── equacoin.svg
│   │   │   ├── evernote.svg
│   │   │   ├── facebook.svg
│   │   │   ├── figma.svg
│   │   │   ├── flood-io.svg
│   │   │   ├── forest.svg
│   │   │   ├── foursquare.svg
│   │   │   ├── gamer-coin.svg
│   │   │   ├── gamer-diamond.svg
│   │   │   ├── gamer-trophy.svg
│   │   │   ├── general-electric.svg
│   │   │   ├── gitlab.svg
│   │   │   ├── go.svg
│   │   │   ├── gomix.svg
│   │   │   ├── google-analytics-2.svg
│   │   │   ├── google-analytics.svg
│   │   │   ├── google-calendar.svg
│   │   │   ├── google-play-store.svg
│   │   │   ├── google-webdev.svg
│   │   │   ├── google.svg
│   │   │   ├── grab.svg
│   │   │   ├── gulp.svg
│   │   │   ├── hex-lab.svg
│   │   │   ├── hot-air-balloon.svg
│   │   │   ├── hp-hewlett-packard.svg
│   │   │   ├── hsbc.svg
│   │   │   ├── html.svg
│   │   │   ├── icon.svg
│   │   │   ├── ideal.svg
│   │   │   ├── inferno.svg
│   │   │   ├── infography.svg
│   │   │   ├── instagram-03.svg
│   │   │   ├── instagram-2.svg
│   │   │   ├── instagram.svg
│   │   │   ├── invision.svg
│   │   │   ├── jira.svg
│   │   │   ├── kickstarter.svg
│   │   │   ├── laravel.svg
│   │   │   ├── linkedin-2.svg
│   │   │   ├── linkedin.svg
│   │   │   ├── logo.svg
│   │   │   ├── lykke-lkk.svg
│   │   │   ├── mailchimp-1.svg
│   │   │   ├── mailchimp-2.svg
│   │   │   ├── microsoft-5.svg
│   │   │   ├── monday.svg
│   │   │   ├── monetha.svg
│   │   │   ├── myriadcoin.svg
│   │   │   ├── netcore-2.svg
│   │   │   ├── netcore.svg
│   │   │   ├── nike-dark.svg
│   │   │   ├── nike-light.svg
│   │   │   ├── nodejs.svg
│   │   │   ├── npm.svg
│   │   │   ├── office.svg
│   │   │   ├── online-game.svg
│   │   │   ├── openid.svg
│   │   │   ├── paccion.svg
│   │   │   ├── paper.svg
│   │   │   ├── patientory.svg
│   │   │   ├── paypal.svg
│   │   │   ├── perrier.svg
│   │   │   ├── pillar.svg
│   │   │   ├── pinterest-circle.svg
│   │   │   ├── plastic-scm.svg
│   │   │   ├── plurk.svg
│   │   │   ├── prefect.svg
│   │   │   ├── principle-app.svg
│   │   │   ├── proyecto-casa.svg
│   │   │   ├── quickbooks.svg
│   │   │   ├── rails-2.svg
│   │   │   ├── rails.svg
│   │   │   ├── react.svg
│   │   │   ├── sass.svg
│   │   │   ├── shell.svg
│   │   │   ├── slack.svg
│   │   │   ├── sololearn.svg
│   │   │   ├── spotify-2.svg
│   │   │   ├── spring.svg
│   │   │   ├── stripe.svg
│   │   │   ├── symfony.svg
│   │   │   ├── tbg.svg
│   │   │   ├── telcoin.svg
│   │   │   ├── telegram.svg
│   │   │   ├── tezos.svg
│   │   │   ├── the-ocean.svg
│   │   │   ├── tiktok-2.svg
│   │   │   ├── tiktok-3.svg
│   │   │   ├── tiktok-dark.svg
│   │   │   ├── tiktok.svg
│   │   │   ├── twitch-purple.svg
│   │   │   ├── twitter-2.svg
│   │   │   ├── twitter.svg
│   │   │   ├── uex.svg
│   │   │   ├── vector.svg
│   │   │   ├── vimeo.svg
│   │   │   ├── visa.svg
│   │   │   ├── voise.svg
│   │   │   ├── vue.svg
│   │   │   ├── weave.svg
│   │   │   ├── webpack.svg
│   │   │   ├── webrtc.svg
│   │   │   ├── whatsapp.svg
│   │   │   ├── x-dark.svg
│   │   │   ├── x.svg
│   │   │   ├── xing.svg
│   │   │   ├── xostme-ltd.svg
│   │   │   ├── yarn.svg
│   │   │   ├── yii.svg
│   │   │   ├── youtube-2.svg
│   │   │   ├── youtube.svg
│   │   │   └── zoom.svg
│   │   ├── file-types/
│   │   │   ├── ai.svg
│   │   │   ├── apk.svg
│   │   │   ├── css.svg
│   │   │   ├── disc.svg
│   │   │   ├── doc.svg
│   │   │   ├── excel.svg
│   │   │   ├── figma.svg
│   │   │   ├── font.svg
│   │   │   ├── image.svg
│   │   │   ├── iso.svg
│   │   │   ├── javascript.svg
│   │   │   ├── js.svg
│   │   │   ├── mail-1.svg
│   │   │   ├── mail.svg
│   │   │   ├── mp3.svg
│   │   │   ├── music.svg
│   │   │   ├── pdf.svg
│   │   │   ├── php.svg
│   │   │   ├── powerpoint.svg
│   │   │   ├── ppt.svg
│   │   │   ├── psd.svg
│   │   │   ├── record.svg
│   │   │   ├── sql.svg
│   │   │   ├── svg.svg
│   │   │   ├── text.svg
│   │   │   ├── ttf.svg
│   │   │   ├── txt.svg
│   │   │   ├── vector.svg
│   │   │   ├── video-1.svg
│   │   │   ├── video.svg
│   │   │   ├── word.svg
│   │   │   ├── xls.svg
│   │   │   └── zip.svg
│   │   ├── flags/
│   │   │   ├── afghanistan.svg
│   │   │   ├── aland-islands.svg
│   │   │   ├── albania.svg
│   │   │   ├── algeria.svg
│   │   │   ├── american-samoa.svg
│   │   │   ├── andorra.svg
│   │   │   ├── angola.svg
│   │   │   ├── anguilla.svg
│   │   │   ├── antigua-and-barbuda.svg
│   │   │   ├── argentina.svg
│   │   │   ├── armenia.svg
│   │   │   ├── aruba.svg
│   │   │   ├── australia.svg
│   │   │   ├── austria.svg
│   │   │   ├── azerbaijan.svg
│   │   │   ├── azores-islands.svg
│   │   │   ├── bahamas.svg
│   │   │   ├── bahrain.svg
│   │   │   ├── balearic-islands.svg
│   │   │   ├── bangladesh.svg
│   │   │   ├── barbados.svg
│   │   │   ├── basque-country.svg
│   │   │   ├── belarus.svg
│   │   │   ├── belgium.svg
│   │   │   ├── belize.svg
│   │   │   ├── benin.svg
│   │   │   ├── bermuda.svg
│   │   │   ├── bhutan.svg
│   │   │   ├── bolivia.svg
│   │   │   ├── bonaire.svg
│   │   │   ├── bosnia-and-herzegovina.svg
│   │   │   ├── botswana.svg
│   │   │   ├── brazil.svg
│   │   │   ├── british-columbia.svg
│   │   │   ├── british-indian-ocean-territory.svg
│   │   │   ├── british-virgin-islands.svg
│   │   │   ├── brunei.svg
│   │   │   ├── bulgaria.svg
│   │   │   ├── burkina-faso.svg
│   │   │   ├── burundi.svg
│   │   │   ├── cambodia.svg
│   │   │   ├── cameroon.svg
│   │   │   ├── canada.svg
│   │   │   ├── canary-islands.svg
│   │   │   ├── cape-verde.svg
│   │   │   ├── cayman-islands.svg
│   │   │   ├── central-african-republic.svg
│   │   │   ├── ceuta.svg
│   │   │   ├── chad.svg
│   │   │   ├── chile.svg
│   │   │   ├── china.svg
│   │   │   ├── christmas-island.svg
│   │   │   ├── cocos-island.svg
│   │   │   ├── colombia.svg
│   │   │   ├── comoros.svg
│   │   │   ├── cook-islands.svg
│   │   │   ├── corsica.svg
│   │   │   ├── costa-rica.svg
│   │   │   ├── croatia.svg
│   │   │   ├── cuba.svg
│   │   │   ├── curacao.svg
│   │   │   ├── czech-republic.svg
│   │   │   ├── democratic-republic-of-congo.svg
│   │   │   ├── denmark.svg
│   │   │   ├── djibouti.svg
│   │   │   ├── dominica.svg
│   │   │   ├── dominican-republic.svg
│   │   │   ├── east-timor.svg
│   │   │   ├── ecuador.svg
│   │   │   ├── egypt.svg
│   │   │   ├── el-salvador.svg
│   │   │   ├── england.svg
│   │   │   ├── equatorial-guinea.svg
│   │   │   ├── eritrea.svg
│   │   │   ├── estonia.svg
│   │   │   ├── ethiopia.svg
│   │   │   ├── european-union.svg
│   │   │   ├── falkland-islands.svg
│   │   │   ├── fiji.svg
│   │   │   ├── finland.svg
│   │   │   ├── flag.svg
│   │   │   ├── france.svg
│   │   │   ├── french-polynesia.svg
│   │   │   ├── gabon.svg
│   │   │   ├── galapagos-islands.svg
│   │   │   ├── gambia.svg
│   │   │   ├── georgia.svg
│   │   │   ├── germany.svg
│   │   │   ├── ghana.svg
│   │   │   ├── gibraltar.svg
│   │   │   ├── greece.svg
│   │   │   ├── greenland.svg
│   │   │   ├── grenada.svg
│   │   │   ├── guam.svg
│   │   │   ├── guatemala.svg
│   │   │   ├── guernsey.svg
│   │   │   ├── guinea-bissau.svg
│   │   │   ├── guinea.svg
│   │   │   ├── haiti.svg
│   │   │   ├── hawaii.svg
│   │   │   ├── honduras.svg
│   │   │   ├── hong-kong.svg
│   │   │   ├── hungary.svg
│   │   │   ├── iceland.svg
│   │   │   ├── india.svg
│   │   │   ├── indonesia.svg
│   │   │   ├── iran.svg
│   │   │   ├── iraq.svg
│   │   │   ├── ireland.svg
│   │   │   ├── isle-of-man.svg
│   │   │   ├── israel.svg
│   │   │   ├── italy.svg
│   │   │   ├── ivory-coast.svg
│   │   │   ├── jamaica.svg
│   │   │   ├── japan.svg
│   │   │   ├── jersey.svg
│   │   │   ├── jordan.svg
│   │   │   ├── kazakhstan.svg
│   │   │   ├── kenya.svg
│   │   │   ├── kiribati.svg
│   │   │   ├── kosovo.svg
│   │   │   ├── kuwait.svg
│   │   │   ├── kyrgyzstan.svg
│   │   │   ├── laos.svg
│   │   │   ├── latvia.svg
│   │   │   ├── lebanon.svg
│   │   │   ├── lesotho.svg
│   │   │   ├── liberia.svg
│   │   │   ├── libya.svg
│   │   │   ├── liechtenstein.svg
│   │   │   ├── lithuania.svg
│   │   │   ├── luxembourg.svg
│   │   │   ├── macao.svg
│   │   │   ├── madagascar.svg
│   │   │   ├── madeira.svg
│   │   │   ├── malawi.svg
│   │   │   ├── malaysia.svg
│   │   │   ├── maldives.svg
│   │   │   ├── mali.svg
│   │   │   ├── malta.svg
│   │   │   ├── marshall-island.svg
│   │   │   ├── martinique.svg
│   │   │   ├── mauritania.svg
│   │   │   ├── mauritius.svg
│   │   │   ├── melilla.svg
│   │   │   ├── mexico.svg
│   │   │   ├── micronesia.svg
│   │   │   ├── moldova.svg
│   │   │   ├── monaco.svg
│   │   │   ├── mongolia.svg
│   │   │   ├── montenegro.svg
│   │   │   ├── montserrat.svg
│   │   │   ├── morocco.svg
│   │   │   ├── mozambique.svg
│   │   │   ├── myanmar.svg
│   │   │   ├── namibia.svg
│   │   │   ├── nato.svg
│   │   │   ├── nauru.svg
│   │   │   ├── nepal.svg
│   │   │   ├── netherlands.svg
│   │   │   ├── new-zealand.svg
│   │   │   ├── nicaragua.svg
│   │   │   ├── niger.svg
│   │   │   ├── nigeria.svg
│   │   │   ├── niue.svg
│   │   │   ├── norfolk-island.svg
│   │   │   ├── north-korea.svg
│   │   │   ├── northern-cyprus.svg
│   │   │   ├── northern-mariana-islands.svg
│   │   │   ├── norway.svg
│   │   │   ├── oman.svg
│   │   │   ├── ossetia.svg
│   │   │   ├── pakistan.svg
│   │   │   ├── palau.svg
│   │   │   ├── palestine.svg
│   │   │   ├── panama.svg
│   │   │   ├── papua-new-guinea.svg
│   │   │   ├── paraguay.svg
│   │   │   ├── peru.svg
│   │   │   ├── philippines.svg
│   │   │   ├── pitcairn-islands.svg
│   │   │   ├── poland.svg
│   │   │   ├── portugal.svg
│   │   │   ├── puerto-rico.svg
│   │   │   ├── qatar.svg
│   │   │   ├── rapa-nui.svg
│   │   │   ├── republic-of-macedonia.svg
│   │   │   ├── republic-of-the-congo.svg
│   │   │   ├── romania.svg
│   │   │   ├── russia.svg
│   │   │   ├── rwanda.svg
│   │   │   ├── saba-island.svg
│   │   │   ├── sahrawi-arab-democratic-republic.svg
│   │   │   ├── saint-kitts-and-nevis.svg
│   │   │   ├── samoa.svg
│   │   │   ├── san-marino.svg
│   │   │   ├── sao-tome-and-prince.svg
│   │   │   ├── sardinia.svg
│   │   │   ├── saudi-arabia.svg
│   │   │   ├── scotland.svg
│   │   │   ├── senegal.svg
│   │   │   ├── serbia.svg
│   │   │   ├── seychelles.svg
│   │   │   ├── sicily.svg
│   │   │   ├── sierra-leone.svg
│   │   │   ├── singapore.svg
│   │   │   ├── sint-eustatius.svg
│   │   │   ├── sint-maarten.svg
│   │   │   ├── slovakia.svg
│   │   │   ├── slovenia.svg
│   │   │   ├── solomon-islands.svg
│   │   │   ├── somalia.svg
│   │   │   ├── somaliland.svg
│   │   │   ├── south-africa.svg
│   │   │   ├── south-korea.svg
│   │   │   ├── south-sudan.svg
│   │   │   ├── spain.svg
│   │   │   ├── sri-lanka.svg
│   │   │   ├── st-barts.svg
│   │   │   ├── st-lucia.svg
│   │   │   ├── st-vincent-and-the-grenadines.svg
│   │   │   ├── sudan.svg
│   │   │   ├── suriname.svg
│   │   │   ├── swaziland.svg
│   │   │   ├── sweden.svg
│   │   │   ├── switzerland.svg
│   │   │   ├── syria.svg
│   │   │   ├── taiwan.svg
│   │   │   ├── tajikistan.svg
│   │   │   ├── tanzania.svg
│   │   │   ├── thailand.svg
│   │   │   ├── tibet.svg
│   │   │   ├── togo.svg
│   │   │   ├── tokelau.svg
│   │   │   ├── tonga.svg
│   │   │   ├── transnistria.svg
│   │   │   ├── trinidad-and-tobago.svg
│   │   │   ├── tunisia.svg
│   │   │   ├── turkey.svg
│   │   │   ├── turkmenistan.svg
│   │   │   ├── turks-and-caicos.svg
│   │   │   ├── tuvalu-1.svg
│   │   │   ├── tuvalu.svg
│   │   │   ├── uganda.svg
│   │   │   ├── uk.svg
│   │   │   ├── ukraine.svg
│   │   │   ├── united-arab-emirates.svg
│   │   │   ├── united-kingdom.svg
│   │   │   ├── united-nations.svg
│   │   │   ├── united-states.svg
│   │   │   ├── uruguay.svg
│   │   │   ├── uzbekistan.svg
│   │   │   ├── vanuatu.svg
│   │   │   ├── vatican-city.svg
│   │   │   ├── venezuela.svg
│   │   │   ├── vietnam.svg
│   │   │   ├── virgin-islands.svg
│   │   │   ├── wales.svg
│   │   │   ├── yemen.svg
│   │   │   ├── zambia.svg
│   │   │   └── zimbabwe.svg
│   │   ├── illustrations/
│   │   │   ├── 1-dark.svg
│   │   │   ├── 1.svg
│   │   │   ├── 10-dark.svg
│   │   │   ├── 10.svg
│   │   │   ├── 11-dark.svg
│   │   │   ├── 11.svg
│   │   │   ├── 12.svg
│   │   │   ├── 13.svg
│   │   │   ├── 14.svg
│   │   │   ├── 15.svg
│   │   │   ├── 16.svg
│   │   │   ├── 17.svg
│   │   │   ├── 18-dark.svg
│   │   │   ├── 18.svg
│   │   │   ├── 19-dark.svg
│   │   │   ├── 19.svg
│   │   │   ├── 2-dark.svg
│   │   │   ├── 2.svg
│   │   │   ├── 20-dark.svg
│   │   │   ├── 20.svg
│   │   │   ├── 21-dark.svg
│   │   │   ├── 21.svg
│   │   │   ├── 22-dark.svg
│   │   │   ├── 22.svg
│   │   │   ├── 23-dark.svg
│   │   │   ├── 23.svg
│   │   │   ├── 24.svg
│   │   │   ├── 25.svg
│   │   │   ├── 26.svg
│   │   │   ├── 27.svg
│   │   │   ├── 28-dark.svg
│   │   │   ├── 28.svg
│   │   │   ├── 29-dark.svg
│   │   │   ├── 29.svg
│   │   │   ├── 3-dark.svg
│   │   │   ├── 3.svg
│   │   │   ├── 30-dark.svg
│   │   │   ├── 30.svg
│   │   │   ├── 31-dark.svg
│   │   │   ├── 31.svg
│   │   │   ├── 32-dark.svg
│   │   │   ├── 32.svg
│   │   │   ├── 33-dark.svg
│   │   │   ├── 33.svg
│   │   │   ├── 34-dark.svg
│   │   │   ├── 34.svg
│   │   │   ├── 35-dark.svg
│   │   │   ├── 35.svg
│   │   │   ├── 4-dark.svg
│   │   │   ├── 4.svg
│   │   │   ├── 5-dark.svg
│   │   │   ├── 5.svg
│   │   │   ├── 6.svg
│   │   │   ├── 7.svg
│   │   │   ├── 8.svg
│   │   │   └── 9.svg
│   │   ├── images/
│   │   │   ├── 2600x1200/
│   │   │   │   ├── 1.png
│   │   │   │   ├── 2-dark.png
│   │   │   │   ├── 2.png
│   │   │   │   ├── 3-dark.png
│   │   │   │   ├── 3.png
│   │   │   │   ├── bg-1-dark.png
│   │   │   │   ├── bg-1.png
│   │   │   │   ├── bg-10-dark.png
│   │   │   │   ├── bg-10.png
│   │   │   │   ├── bg-11.png
│   │   │   │   ├── bg-12.png
│   │   │   │   ├── bg-13.png
│   │   │   │   ├── bg-14-dark.png
│   │   │   │   ├── bg-14.png
│   │   │   │   ├── bg-2-dark.png
│   │   │   │   ├── bg-2.png
│   │   │   │   ├── bg-3-dark.png
│   │   │   │   ├── bg-3.png
│   │   │   │   ├── bg-4-dark.png
│   │   │   │   ├── bg-4.png
│   │   │   │   ├── bg-5-dark.png
│   │   │   │   ├── bg-5.png
│   │   │   │   ├── bg-6.png
│   │   │   │   ├── bg-7.png
│   │   │   │   ├── bg-8.png
│   │   │   │   └── bg-9.png
│   │   │   ├── 2600x1600/
│   │   │   │   ├── 1-dark.png
│   │   │   │   ├── 1.png
│   │   │   │   ├── 2-dark.png
│   │   │   │   ├── 2.png
│   │   │   │   ├── bg-1-dark.png
│   │   │   │   ├── bg-1.png
│   │   │   │   ├── bg-2-dark.png
│   │   │   │   ├── bg-2.png
│   │   │   │   ├── bg-3-dark.png
│   │   │   │   └── bg-3.png
│   │   │   ├── 600x400/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 10.jpg
│   │   │   │   ├── 11.jpg
│   │   │   │   ├── 12.jpg
│   │   │   │   ├── 13.jpg
│   │   │   │   ├── 14.jpg
│   │   │   │   ├── 15.jpg
│   │   │   │   ├── 16.jpg
│   │   │   │   ├── 17.jpg
│   │   │   │   ├── 18.jpg
│   │   │   │   ├── 19.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   ├── 20.jpg
│   │   │   │   ├── 21.jpg
│   │   │   │   ├── 22.jpg
│   │   │   │   ├── 23.jpg
│   │   │   │   ├── 24.jpg
│   │   │   │   ├── 25.jpg
│   │   │   │   ├── 26.jpg
│   │   │   │   ├── 27.jpg
│   │   │   │   ├── 28.jpg
│   │   │   │   ├── 29.jpg
│   │   │   │   ├── 3.jpg
│   │   │   │   ├── 30.jpg
│   │   │   │   ├── 31.jpg
│   │   │   │   ├── 32.jpg
│   │   │   │   ├── 33.jpg
│   │   │   │   ├── 4.jpg
│   │   │   │   ├── 5.jpg
│   │   │   │   ├── 6.jpg
│   │   │   │   ├── 7.jpg
│   │   │   │   ├── 8.jpg
│   │   │   │   └── 9.jpg
│   │   │   └── 600x600/
│   │   │       ├── 1.jpg
│   │   │       ├── 10.jpg
│   │   │       ├── 11.jpg
│   │   │       ├── 12.jpg
│   │   │       ├── 13.jpg
│   │   │       ├── 14.jpg
│   │   │       ├── 15.jpg
│   │   │       ├── 16.jpg
│   │   │       ├── 17.jpg
│   │   │       ├── 18.jpg
│   │   │       ├── 19.jpg
│   │   │       ├── 2.jpg
│   │   │       ├── 20.jpg
│   │   │       ├── 21.jpg
│   │   │       ├── 22.jpg
│   │   │       ├── 23.jpg
│   │   │       ├── 24.jpg
│   │   │       ├── 25.jpg
│   │   │       ├── 26.jpg
│   │   │       ├── 27.jpg
│   │   │       ├── 28.jpg
│   │   │       ├── 29.jpg
│   │   │       ├── 3.jpg
│   │   │       ├── 30.jpg
│   │   │       ├── 31.jpg
│   │   │       ├── 32.jpg
│   │   │       ├── 33.jpg
│   │   │       ├── 34.jpg
│   │   │       ├── 35.jpg
│   │   │       ├── 4.jpg
│   │   │       ├── 5.jpg
│   │   │       ├── 6.jpg
│   │   │       ├── 7.jpg
│   │   │       ├── 8.jpg
│   │   │       └── 9.jpg
│   │   └── store/
│   │       └── client/
│   │           └── 600x600/
│   │               ├── 1.png
│   │               ├── 10.png
│   │               ├── 11.png
│   │               ├── 12.png
│   │               ├── 13.png
│   │               ├── 14.png
│   │               ├── 15.png
│   │               ├── 16.png
│   │               ├── 2.png
│   │               ├── 3.png
│   │               ├── 4.png
│   │               ├── 5.png
│   │               ├── 6.png
│   │               ├── 7.png
│   │               ├── 8.png
│   │               └── 9.png
│   ├── storage/
│   │   └── .gitignore
│   ├── .htaccess
│   ├── 500.html
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── fonts-manifest.dev.json
│   ├── hot
│   ├── index.php
│   └── robots.txt
├── resources/
│   ├── css/
│   │   ├── components/
│   │   │   ├── apexcharts.css
│   │   │   ├── image-input.css
│   │   │   ├── leaflet.css
│   │   │   ├── rating.css
│   │   │   └── scrollable.css
│   │   ├── demos/
│   │   │   └── demo1.css
│   │   ├── app.css
│   │   ├── config.reui.css
│   │   └── styles.css
│   ├── js/
│   │   ├── actions/
│   │   │   ├── App/
│   │   │   │   ├── Http/
│   │   │   │   │   ├── Controllers/
│   │   │   │   │   │   ├── Admin/
│   │   │   │   │   │   │   ├── Communication/
│   │   │   │   │   │   │   │   ├── CommunicationLogController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Company/
│   │   │   │   │   │   │   │   ├── CompanyController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Dashboard/
│   │   │   │   │   │   │   │   ├── DashboardController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Feature/
│   │   │   │   │   │   │   │   ├── FeatureController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Master/
│   │   │   │   │   │   │   │   ├── AreaWebController.ts
│   │   │   │   │   │   │   │   ├── BusinessCategoryWebController.ts
│   │   │   │   │   │   │   │   ├── CityWebController.ts
│   │   │   │   │   │   │   │   ├── CountryWebController.ts
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   ├── LanguageWebController.ts
│   │   │   │   │   │   │   │   ├── PlanWebController.ts
│   │   │   │   │   │   │   │   └── StateWebController.ts
│   │   │   │   │   │   │   ├── Notification/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── NotificationController.ts
│   │   │   │   │   │   │   ├── Payment/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── PaymentController.ts
│   │   │   │   │   │   │   ├── Permission/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── PermissionController.ts
│   │   │   │   │   │   │   ├── Security/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── SecretAccessController.ts
│   │   │   │   │   │   │   ├── Setting/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── SettingController.ts
│   │   │   │   │   │   │   ├── Subscription/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── SubscriptionController.ts
│   │   │   │   │   │   │   ├── System/
│   │   │   │   │   │   │   │   ├── DatabaseController.ts
│   │   │   │   │   │   │   │   ├── EnvController.ts
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── ServerController.ts
│   │   │   │   │   │   │   ├── Template/
│   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   └── NotificationTemplateController.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── Api/
│   │   │   │   │   │   │   ├── Admin/
│   │   │   │   │   │   │   │   ├── Master/
│   │   │   │   │   │   │   │   │   ├── AreaApiController.ts
│   │   │   │   │   │   │   │   │   ├── BusinessCategoryApiController.ts
│   │   │   │   │   │   │   │   │   ├── CityApiController.ts
│   │   │   │   │   │   │   │   │   ├── CountryApiController.ts
│   │   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   │   ├── LanguageApiController.ts
│   │   │   │   │   │   │   │   │   ├── PlanApiController.ts
│   │   │   │   │   │   │   │   │   └── StateApiController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Auth/
│   │   │   │   │   │   │   │   ├── AuthController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── Company/
│   │   │   │   │   │   │   │   ├── Employee/
│   │   │   │   │   │   │   │   │   ├── EmployeeController.ts
│   │   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   │   ├── Product/
│   │   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   │   ├── ProductAddonFeatureRequestController.ts
│   │   │   │   │   │   │   │   │   ├── ProductController.ts
│   │   │   │   │   │   │   │   │   ├── ProductCreditController.ts
│   │   │   │   │   │   │   │   │   ├── ProductFeatureController.ts
│   │   │   │   │   │   │   │   │   ├── ProductPlanController.ts
│   │   │   │   │   │   │   │   │   └── ProductRenewalRequestController.ts
│   │   │   │   │   │   │   │   ├── Profile/
│   │   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   │   └── ProfileController.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── Auth/
│   │   │   │   │   │   │   ├── AdminLoginController.ts
│   │   │   │   │   │   │   ├── AuthenticatedSessionController.ts
│   │   │   │   │   │   │   ├── ConfirmablePasswordController.ts
│   │   │   │   │   │   │   ├── ConfirmedPasswordStatusController.ts
│   │   │   │   │   │   │   ├── ConfirmedTwoFactorAuthenticationController.ts
│   │   │   │   │   │   │   ├── EmailVerificationNotificationController.ts
│   │   │   │   │   │   │   ├── EmailVerificationPromptController.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── NewPasswordController.ts
│   │   │   │   │   │   │   ├── PasswordResetLinkController.ts
│   │   │   │   │   │   │   ├── RecoveryCodeController.ts
│   │   │   │   │   │   │   ├── TwoFactorAuthenticatedSessionController.ts
│   │   │   │   │   │   │   ├── TwoFactorAuthenticationController.ts
│   │   │   │   │   │   │   ├── TwoFactorQrCodeController.ts
│   │   │   │   │   │   │   ├── TwoFactorSecretKeyController.ts
│   │   │   │   │   │   │   └── VerifyEmailController.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── Illuminate/
│   │   │   │   ├── Routing/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── RedirectController.ts
│   │   │   │   └── index.ts
│   │   │   ├── Inertia/
│   │   │   │   ├── Controller.ts
│   │   │   │   └── index.ts
│   │   │   └── Laravel/
│   │   │       ├── Sanctum/
│   │   │       │   ├── Http/
│   │   │       │   │   ├── Controllers/
│   │   │       │   │   │   ├── CsrfCookieController.ts
│   │   │       │   │   │   └── index.ts
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── Telescope/
│   │   │       │   ├── Http/
│   │   │       │   │   ├── Controllers/
│   │   │       │   │   │   ├── CacheController.ts
│   │   │       │   │   │   ├── ClientRequestController.ts
│   │   │       │   │   │   ├── CommandsController.ts
│   │   │       │   │   │   ├── DumpController.ts
│   │   │       │   │   │   ├── EntriesController.ts
│   │   │       │   │   │   ├── EventsController.ts
│   │   │       │   │   │   ├── ExceptionController.ts
│   │   │       │   │   │   ├── GatesController.ts
│   │   │       │   │   │   ├── HomeController.ts
│   │   │       │   │   │   ├── index.ts
│   │   │       │   │   │   ├── LogController.ts
│   │   │       │   │   │   ├── MailController.ts
│   │   │       │   │   │   ├── MailEmlController.ts
│   │   │       │   │   │   ├── MailHtmlController.ts
│   │   │       │   │   │   ├── ModelsController.ts
│   │   │       │   │   │   ├── MonitoredTagController.ts
│   │   │       │   │   │   ├── NotificationsController.ts
│   │   │       │   │   │   ├── QueriesController.ts
│   │   │       │   │   │   ├── QueueBatchesController.ts
│   │   │       │   │   │   ├── QueueController.ts
│   │   │       │   │   │   ├── RecordingController.ts
│   │   │       │   │   │   ├── RedisController.ts
│   │   │       │   │   │   ├── RequestsController.ts
│   │   │       │   │   │   ├── ScheduleController.ts
│   │   │       │   │   │   └── ViewsController.ts
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   ├── auth/
│   │   │   ├── adapters/
│   │   │   │   ├── supabase-adapter.test.ts
│   │   │   │   └── supabase-adapter.ts
│   │   │   ├── context/
│   │   │   │   └── auth-context.ts
│   │   │   ├── forms/
│   │   │   │   ├── reset-password-schema.ts
│   │   │   │   ├── signin-schema.ts
│   │   │   │   └── signup-schema.ts
│   │   │   ├── layouts/
│   │   │   │   ├── branded.tsx
│   │   │   │   └── classic.tsx
│   │   │   ├── lib/
│   │   │   │   ├── helpers.ts
│   │   │   │   └── models.ts
│   │   │   ├── pages/
│   │   │   │   ├── extended/
│   │   │   │   │   ├── check-email.tsx
│   │   │   │   │   ├── reset-password-changed.tsx
│   │   │   │   │   ├── reset-password-check-email.tsx
│   │   │   │   │   └── tfa.tsx
│   │   │   │   ├── callback-page.tsx
│   │   │   │   ├── change-password-page.tsx
│   │   │   │   ├── reset-password-page.tsx
│   │   │   │   ├── signin-page.tsx
│   │   │   │   └── signup-page.tsx
│   │   │   ├── providers/
│   │   │   │   └── supabase-provider.tsx
│   │   │   ├── auth-routes.tsx
│   │   │   ├── auth-routing.tsx
│   │   │   └── require-auth.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── data-table/
│   │   │   │   │   ├── data-table-row-actions.tsx
│   │   │   │   │   ├── data-table-toolbar.tsx
│   │   │   │   │   ├── data-table.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── use-data-table.ts
│   │   │   │   ├── admin-footer.tsx
│   │   │   │   ├── admin-modal.tsx
│   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   ├── admin-topbar.tsx
│   │   │   │   ├── master-record-form.tsx
│   │   │   │   ├── module-page.tsx
│   │   │   │   ├── page-header.tsx
│   │   │   │   ├── stat-card.tsx
│   │   │   │   └── table-pagination.tsx
│   │   │   ├── common/
│   │   │   │   ├── container.tsx
│   │   │   │   ├── content-loader.tsx
│   │   │   │   ├── dynamic-table.tsx
│   │   │   │   ├── icons.tsx
│   │   │   │   ├── react-query-terminal.tsx
│   │   │   │   ├── recaptcha-popover.tsx
│   │   │   │   └── screen-loader.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard-analytics-card.tsx
│   │   │   │   ├── dashboard-progress-card.tsx
│   │   │   │   ├── dashboard-projects-card.tsx
│   │   │   │   ├── dashboard-reminders-card.tsx
│   │   │   │   ├── dashboard-stats.tsx
│   │   │   │   └── dashboard-team-card.tsx
│   │   │   ├── image-input/
│   │   │   │   ├── image-input.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── utils.ts
│   │   │   ├── keenicons/
│   │   │   │   ├── assets/
│   │   │   │   │   ├── duotone/
│   │   │   │   │   │   ├── demo-files/
│   │   │   │   │   │   │   ├── demo.css
│   │   │   │   │   │   │   └── demo.js
│   │   │   │   │   │   ├── fonts/
│   │   │   │   │   │   │   ├── keenicons-duotone.svg
│   │   │   │   │   │   │   ├── keenicons-duotone.ttf
│   │   │   │   │   │   │   └── keenicons-duotone.woff
│   │   │   │   │   │   ├── demo.html
│   │   │   │   │   │   ├── Read Me.txt
│   │   │   │   │   │   ├── selection.json
│   │   │   │   │   │   └── style.css
│   │   │   │   │   ├── filled/
│   │   │   │   │   │   ├── demo-files/
│   │   │   │   │   │   │   ├── demo.css
│   │   │   │   │   │   │   └── demo.js
│   │   │   │   │   │   ├── fonts/
│   │   │   │   │   │   │   ├── keenicons-filled.svg
│   │   │   │   │   │   │   ├── keenicons-filled.ttf
│   │   │   │   │   │   │   └── keenicons-filled.woff
│   │   │   │   │   │   ├── demo.html
│   │   │   │   │   │   ├── Read Me.txt
│   │   │   │   │   │   ├── selection.json
│   │   │   │   │   │   └── style.css
│   │   │   │   │   ├── outline/
│   │   │   │   │   │   ├── demo-files/
│   │   │   │   │   │   │   ├── demo.css
│   │   │   │   │   │   │   └── demo.js
│   │   │   │   │   │   ├── fonts/
│   │   │   │   │   │   │   ├── keenicons-outline.svg
│   │   │   │   │   │   │   ├── keenicons-outline.ttf
│   │   │   │   │   │   │   └── keenicons-outline.woff
│   │   │   │   │   │   ├── demo.html
│   │   │   │   │   │   ├── Read Me.txt
│   │   │   │   │   │   ├── selection.json
│   │   │   │   │   │   └── style.css
│   │   │   │   │   ├── solid/
│   │   │   │   │   │   ├── demo-files/
│   │   │   │   │   │   │   ├── demo.css
│   │   │   │   │   │   │   └── demo.js
│   │   │   │   │   │   ├── fonts/
│   │   │   │   │   │   │   ├── keenicons-solid.svg
│   │   │   │   │   │   │   ├── keenicons-solid.ttf
│   │   │   │   │   │   │   └── keenicons-solid.woff
│   │   │   │   │   │   ├── demo.html
│   │   │   │   │   │   ├── Read Me.txt
│   │   │   │   │   │   ├── selection.json
│   │   │   │   │   │   └── style.css
│   │   │   │   │   └── styles.css
│   │   │   │   ├── index.ts
│   │   │   │   ├── keenicons.tsx
│   │   │   │   └── types.ts
│   │   │   ├── supabase/
│   │   │   │   └── SupabaseStatus.tsx
│   │   │   ├── ui/
│   │   │   │   ├── accordion-menu.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar-group.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── code.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── counting-number.tsx
│   │   │   │   ├── data-grid-column-filter.tsx
│   │   │   │   ├── data-grid-column-header.tsx
│   │   │   │   ├── data-grid-column-visibility.tsx
│   │   │   │   ├── data-grid-pagination.tsx
│   │   │   │   ├── data-grid-table-dnd-rows.tsx
│   │   │   │   ├── data-grid-table-dnd.tsx
│   │   │   │   ├── data-grid-table.tsx
│   │   │   │   ├── data-grid.tsx
│   │   │   │   ├── datefield.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── file-upload.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── github-button.tsx
│   │   │   │   ├── gradient-background.tsx
│   │   │   │   ├── grid-background.tsx
│   │   │   │   ├── hover-background.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── icon.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── kanban.tsx
│   │   │   │   ├── kbd.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── marquee.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── placeholder-pattern.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── scrollspy.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── shimmering-text.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── skeleton-with-pattern.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── sliding-number.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── sortable.tsx
│   │   │   │   ├── spinner.tsx
│   │   │   │   ├── stepper.tsx
│   │   │   │   ├── svg-text.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── text-reveal.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── tree.tsx
│   │   │   │   ├── typing-text.tsx
│   │   │   │   ├── video-text.tsx
│   │   │   │   └── word-rotate.tsx
│   │   │   ├── ai-icon.tsx
│   │   │   ├── alert-error.tsx
│   │   │   ├── app-content.tsx
│   │   │   ├── app-header.tsx
│   │   │   ├── app-logo-icon.tsx
│   │   │   ├── app-logo.tsx
│   │   │   ├── app-shell.tsx
│   │   │   ├── app-sidebar-header.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── appearance-tabs.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── delete-user.tsx
│   │   │   ├── heading.tsx
│   │   │   ├── input-error.tsx
│   │   │   ├── manage-passkeys.tsx
│   │   │   ├── manage-two-factor.tsx
│   │   │   ├── nav-footer.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-user.tsx
│   │   │   ├── passkey-item.tsx
│   │   │   ├── passkey-register.tsx
│   │   │   ├── passkey-verify.tsx
│   │   │   ├── password-input.tsx
│   │   │   ├── text-link.tsx
│   │   │   ├── two-factor-recovery-codes.tsx
│   │   │   ├── two-factor-setup-modal.tsx
│   │   │   ├── user-info.tsx
│   │   │   └── user-menu-content.tsx
│   │   ├── config/
│   │   │   ├── admin-navigation.ts
│   │   │   ├── general.config.ts
│   │   │   ├── menu.config.tsx
│   │   │   ├── palette.config.ts
│   │   │   ├── settings.config.ts
│   │   │   └── types.ts
│   │   ├── data/
│   │   │   └── admin-modules.ts
│   │   ├── hooks/
│   │   │   ├── use-appearance.tsx
│   │   │   ├── use-body-class.ts
│   │   │   ├── use-clipboard.ts
│   │   │   ├── use-copy-to-clipboard.ts
│   │   │   ├── use-current-url.ts
│   │   │   ├── use-file-upload.ts
│   │   │   ├── use-flash-toast.ts
│   │   │   ├── use-initials.tsx
│   │   │   ├── use-menu.ts
│   │   │   ├── use-mobile-navigation.ts
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-mounted.ts
│   │   │   ├── use-recaptcha-v2.ts
│   │   │   ├── use-scroll-position.ts
│   │   │   ├── use-slider-input.ts
│   │   │   ├── use-two-factor-auth.ts
│   │   │   └── use-viewport.ts
│   │   ├── i18n/
│   │   │   ├── messages/
│   │   │   │   ├── ar.json
│   │   │   │   ├── en.json
│   │   │   │   ├── fr.json
│   │   │   │   └── zh.json
│   │   │   ├── config.ts
│   │   │   └── types.ts
│   │   ├── layouts/
│   │   │   ├── app/
│   │   │   │   ├── app-header-layout.tsx
│   │   │   │   └── app-sidebar-layout.tsx
│   │   │   ├── auth/
│   │   │   │   ├── auth-card-layout.tsx
│   │   │   │   ├── auth-simple-layout.tsx
│   │   │   │   └── auth-split-layout.tsx
│   │   │   ├── demo1/
│   │   │   │   ├── components/
│   │   │   │   │   ├── breadcrumb.tsx
│   │   │   │   │   ├── content.tsx
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── mega-menu-mobile.tsx
│   │   │   │   │   ├── mega-menu.tsx
│   │   │   │   │   ├── network-error.tsx
│   │   │   │   │   ├── sidebar-header.tsx
│   │   │   │   │   ├── sidebar-menu.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo10/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar-footer.tsx
│   │   │   │   │   ├── sidebar-header.tsx
│   │   │   │   │   ├── sidebar-menu-primary.tsx
│   │   │   │   │   ├── sidebar-menu-secondary.tsx
│   │   │   │   │   ├── sidebar-menu.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── toolbar-menu.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo2/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header-logo.tsx
│   │   │   │   │   ├── header-topbar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── navbar-links.tsx
│   │   │   │   │   ├── navbar-menu.tsx
│   │   │   │   │   ├── navbar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo3/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header-logo.tsx
│   │   │   │   │   ├── header-topbar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── navbar-links.tsx
│   │   │   │   │   ├── navbar-menu.tsx
│   │   │   │   │   ├── navbar.tsx
│   │   │   │   │   ├── sidebar-menu.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo4/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar-menu-dashboard.tsx
│   │   │   │   │   ├── sidebar-menu-default.tsx
│   │   │   │   │   ├── sidebar-primary.tsx
│   │   │   │   │   ├── sidebar-secondary.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo5/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header-logo.tsx
│   │   │   │   │   ├── header-topbar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── navbar-menu.tsx
│   │   │   │   │   ├── navbar.tsx
│   │   │   │   │   ├── sidebar-menu-dashboard.tsx
│   │   │   │   │   ├── sidebar-menu-default.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo6/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar-footer.tsx
│   │   │   │   │   ├── sidebar-header.tsx
│   │   │   │   │   ├── sidebar-menu-primary.tsx
│   │   │   │   │   ├── sidebar-menu-secondary.tsx
│   │   │   │   │   ├── sidebar-menu.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── toolbar-menu.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo7/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header-logo.tsx
│   │   │   │   │   ├── header-topbar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── mega-menu-mobile.tsx
│   │   │   │   │   ├── mega-menu.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo8/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar-footer.tsx
│   │   │   │   │   ├── sidebar-header.tsx
│   │   │   │   │   ├── sidebar-menu.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── demo9/
│   │   │   │   ├── components/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── header-logo.tsx
│   │   │   │   │   ├── header-search.tsx
│   │   │   │   │   ├── header-topbar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── mega-menu-mobile.tsx
│   │   │   │   │   ├── mega-menu.tsx
│   │   │   │   │   ├── navbar.tsx
│   │   │   │   │   └── toolbar.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── error/
│   │   │   │   └── layout.tsx
│   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   ├── admin-layout.tsx
│   │   │   ├── app-layout.tsx
│   │   │   └── auth-layout.tsx
│   │   ├── lib/
│   │   │   ├── dom.ts
│   │   │   ├── helpers.ts
│   │   │   ├── storage.ts
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── account/
│   │   │   │   ├── billing/
│   │   │   │   ├── home/
│   │   │   │   │   ├── get-started/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── user-profile.tsx
│   │   │   │   ├── members/
│   │   │   │   │   └── team-info/
│   │   │   │   │       └── components/
│   │   │   │   │           └── team-info.tsx
│   │   │   │   ├── security/
│   │   │   │   │   └── privacy-settings/
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── admin/
│   │   │   │   ├── communication/
│   │   │   │   │   ├── notifications/
│   │   │   │   │   │   ├── firebase/
│   │   │   │   │   │   │   ├── create.tsx
│   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   └── panel/
│   │   │   │   │   │       ├── create.tsx
│   │   │   │   │   │       └── index.tsx
│   │   │   │   │   └── logs.tsx
│   │   │   │   ├── companies/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── show.tsx
│   │   │   │   ├── features/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── masters/
│   │   │   │   │   ├── business-categories/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── payments/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── permissions/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── security/
│   │   │   │   │   └── secret-access.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ai-settings.tsx
│   │   │   │   │   │   └── location-settings.tsx
│   │   │   │   │   └── edit.tsx
│   │   │   │   ├── subscriptions/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── system/
│   │   │   │   │   ├── database.tsx
│   │   │   │   │   ├── env.tsx
│   │   │   │   │   └── server.tsx
│   │   │   │   ├── templates/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── ai-assistant.tsx
│   │   │   │   └── dashboard.tsx
│   │   │   ├── auth/
│   │   │   │   ├── account-deactivated/
│   │   │   │   │   ├── auth-account-deactivated-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── get-started/
│   │   │   │   │   ├── auth-get-started-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── welcome-message/
│   │   │   │   │   ├── auth-welcome-message-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── admin-login.tsx
│   │   │   │   ├── confirm-password.tsx
│   │   │   │   ├── forgot-password.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   ├── reset-password.tsx
│   │   │   │   ├── two-factor-challenge.tsx
│   │   │   │   └── verify-email.tsx
│   │   │   ├── dashboards/
│   │   │   │   ├── default/
│   │   │   │   │   ├── default-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── demo1/
│   │   │   │   │   ├── dark-sidebar/
│   │   │   │   │   │   ├── demo1-dark-sidebar-page.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── light-sidebar/
│   │   │   │   │   │   ├── components/
│   │   │   │   │   │   │   ├── channel-stats.tsx
│   │   │   │   │   │   │   ├── earnings-chart.tsx
│   │   │   │   │   │   │   ├── entry-callout.tsx
│   │   │   │   │   │   │   ├── highlights.tsx
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── team-meeting.tsx
│   │   │   │   │   │   │   └── teams.tsx
│   │   │   │   │   │   ├── demo1-light-sidebar-content.tsx
│   │   │   │   │   │   ├── demo1-light-sidebar-page.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── demo2/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── integrations.tsx
│   │   │   │   │   │   ├── manage-data.tsx
│   │   │   │   │   │   ├── my-balance.tsx
│   │   │   │   │   │   └── options.tsx
│   │   │   │   │   ├── demo2-content.tsx
│   │   │   │   │   ├── demo2-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── demo3/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── integrations.tsx
│   │   │   │   │   ├── demo3-content.tsx
│   │   │   │   │   ├── demo3-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── demo4/
│   │   │   │   │   ├── demo4-content.tsx
│   │   │   │   │   ├── demo4-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── demo5/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── options.tsx
│   │   │   │   │   ├── demo5-content.tsx
│   │   │   │   │   ├── demo5-page.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── errors/
│   │   │   │   ├── 404.tsx
│   │   │   │   └── 500.tsx
│   │   │   ├── network/
│   │   │   │   └── user-table/
│   │   │   ├── public-profile/
│   │   │   │   ├── profiles/
│   │   │   │   └── projects/
│   │   │   ├── store-admin/
│   │   │   │   ├── components/
│   │   │   │   └── inventory/
│   │   │   ├── store-client/
│   │   │   │   └── checkout/
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── admin-login.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── welcome.tsx
│   │   ├── partials/
│   │   │   ├── activities/
│   │   │   │   ├── anniversary.tsx
│   │   │   │   ├── blog-anniversary.tsx
│   │   │   │   ├── blogging-conference.tsx
│   │   │   │   ├── designer-welcome.tsx
│   │   │   │   ├── interview.tsx
│   │   │   │   ├── login.tsx
│   │   │   │   ├── milestone.tsx
│   │   │   │   ├── new-article.tsx
│   │   │   │   ├── new-product.tsx
│   │   │   │   ├── new-team.tsx
│   │   │   │   ├── photography-workshop.tsx
│   │   │   │   ├── product-specific.tsx
│   │   │   │   ├── product-webinar.tsx
│   │   │   │   ├── project-status.tsx
│   │   │   │   ├── timeline-item.tsx
│   │   │   │   ├── upcoming-content.tsx
│   │   │   │   └── virtual-team.tsx
│   │   │   ├── cards/
│   │   │   │   ├── card-add-new-row.tsx
│   │   │   │   ├── card-add-new.tsx
│   │   │   │   ├── card-author-row.tsx
│   │   │   │   ├── card-author.tsx
│   │   │   │   ├── card-campaign-row.tsx
│   │   │   │   ├── card-campaign.tsx
│   │   │   │   ├── card-connection-row.tsx
│   │   │   │   ├── card-connection.tsx
│   │   │   │   ├── card-integration.tsx
│   │   │   │   ├── card-location.tsx
│   │   │   │   ├── card-notification.tsx
│   │   │   │   ├── card-now-playing.tsx
│   │   │   │   ├── card-ntf-row.tsx
│   │   │   │   ├── card-ntf.tsx
│   │   │   │   ├── card-ntf2.tsx
│   │   │   │   ├── card-post.tsx
│   │   │   │   ├── card-project-extended-row.tsx
│   │   │   │   ├── card-project-extended.tsx
│   │   │   │   ├── card-project-row.tsx
│   │   │   │   ├── card-project.tsx
│   │   │   │   ├── card-role.tsx
│   │   │   │   ├── card-team-row.tsx
│   │   │   │   ├── card-team.tsx
│   │   │   │   ├── card-tournament.tsx
│   │   │   │   ├── card-user-mini.tsx
│   │   │   │   ├── card-user-social-row.tsx
│   │   │   │   ├── card-user-social.tsx
│   │   │   │   ├── card-work-row.tsx
│   │   │   │   ├── card-work.tsx
│   │   │   │   └── index.ts
│   │   │   ├── common/
│   │   │   │   ├── avatar-group.tsx
│   │   │   │   ├── avatar-input.tsx
│   │   │   │   ├── avatar-single.tsx
│   │   │   │   ├── create-team.tsx
│   │   │   │   ├── engage.tsx
│   │   │   │   ├── faq.tsx
│   │   │   │   ├── help.tsx
│   │   │   │   ├── help2.tsx
│   │   │   │   ├── hexagon-badge.tsx
│   │   │   │   ├── highlighted-posts.tsx
│   │   │   │   ├── rating.tsx
│   │   │   │   ├── starter.tsx
│   │   │   │   ├── toolbar.tsx
│   │   │   │   └── user-hero.tsx
│   │   │   ├── dialogs/
│   │   │   │   ├── search/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── search-dialog.tsx
│   │   │   │   │   ├── search-docs.tsx
│   │   │   │   │   ├── search-empty.tsx
│   │   │   │   │   ├── search-integrations.tsx
│   │   │   │   │   ├── search-mixed.tsx
│   │   │   │   │   ├── search-no-results.tsx
│   │   │   │   │   ├── search-settings-items.tsx
│   │   │   │   │   ├── search-settings.tsx
│   │   │   │   │   ├── search-users.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   ├── share-profile/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── share-profile-dialog.tsx
│   │   │   │   │   ├── share-profile-settings.tsx
│   │   │   │   │   ├── share-profile-users.tsx
│   │   │   │   │   ├── share-profile-via-email.tsx
│   │   │   │   │   ├── share-profile-via-link.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   ├── account-deactivated-dialog.tsx
│   │   │   │   ├── give-award-dialog.tsx
│   │   │   │   ├── report-user-dialog.tsx
│   │   │   │   └── welcome-message-dialog.tsx
│   │   │   ├── dropdown-menu/
│   │   │   │   ├── dropdown-menu-1.tsx
│   │   │   │   ├── dropdown-menu-2.tsx
│   │   │   │   ├── dropdown-menu-3.tsx
│   │   │   │   ├── dropdown-menu-4.tsx
│   │   │   │   ├── dropdown-menu-5.tsx
│   │   │   │   ├── dropdown-menu-6.tsx
│   │   │   │   ├── dropdown-menu-7.tsx
│   │   │   │   ├── dropdown-menu-8.tsx
│   │   │   │   └── dropdown-menu-9.tsx
│   │   │   ├── mega-menu/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mega-menu-footer.tsx
│   │   │   │   │   ├── mega-menu-sub-default.tsx
│   │   │   │   │   └── mega-menu-sub-highlighted.tsx
│   │   │   │   ├── mega-menu-sub-account.tsx
│   │   │   │   ├── mega-menu-sub-auth.tsx
│   │   │   │   ├── mega-menu-sub-network.tsx
│   │   │   │   ├── mega-menu-sub-profiles.tsx
│   │   │   │   └── mega-menu-sub-store.tsx
│   │   │   ├── navbar/
│   │   │   │   ├── navbar-menu.tsx
│   │   │   │   ├── navbar.tsx
│   │   │   │   └── scrollspy-menu.tsx
│   │   │   ├── topbar/
│   │   │   │   ├── notifications/
│   │   │   │   │   ├── item-1.tsx
│   │   │   │   │   ├── item-10.tsx
│   │   │   │   │   ├── item-11.tsx
│   │   │   │   │   ├── item-12.tsx
│   │   │   │   │   ├── item-13.tsx
│   │   │   │   │   ├── item-14.tsx
│   │   │   │   │   ├── item-15.tsx
│   │   │   │   │   ├── item-16.tsx
│   │   │   │   │   ├── item-17.tsx
│   │   │   │   │   ├── item-18.tsx
│   │   │   │   │   ├── item-19.tsx
│   │   │   │   │   ├── item-2.tsx
│   │   │   │   │   ├── item-20.tsx
│   │   │   │   │   ├── item-3.tsx
│   │   │   │   │   ├── item-4.tsx
│   │   │   │   │   ├── item-5.tsx
│   │   │   │   │   ├── item-6.tsx
│   │   │   │   │   ├── item-7.tsx
│   │   │   │   │   ├── item-8.tsx
│   │   │   │   │   └── item-9.tsx
│   │   │   │   ├── apps-dropdown-menu.tsx
│   │   │   │   ├── chat-sheet.tsx
│   │   │   │   ├── notifications-sheet.tsx
│   │   │   │   ├── palette-sheet.tsx
│   │   │   │   ├── subscription-sheet.tsx
│   │   │   │   └── user-dropdown-menu.tsx
│   │   │   ├── anniversary.tsx
│   │   │   ├── blog-anniversary.tsx
│   │   │   ├── blogging-conference.tsx
│   │   │   ├── designer-welcome.tsx
│   │   │   ├── interview.tsx
│   │   │   ├── login.tsx
│   │   │   ├── milestone.tsx
│   │   │   ├── new-article.tsx
│   │   │   ├── new-product.tsx
│   │   │   ├── new-team.tsx
│   │   │   ├── photography-workshop.tsx
│   │   │   ├── product-specific.tsx
│   │   │   ├── product-webinar.tsx
│   │   │   ├── project-status.tsx
│   │   │   ├── timeline-item.tsx
│   │   │   ├── upcoming-content.tsx
│   │   │   └── virtual-team.tsx
│   │   ├── providers/
│   │   │   ├── i18n-provider.tsx
│   │   │   ├── modules-provider.tsx
│   │   │   ├── query-provider.tsx
│   │   │   ├── settings-provider.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── tooltips-provider.tsx
│   │   ├── routes/
│   │   │   ├── account/
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   ├── communication/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── companies/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── features/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── master/
│   │   │   │   │   ├── areas/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── business-categories/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── cities/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── countries/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── languages/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── plans/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── states/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── notifications/
│   │   │   │   │   ├── firebase/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── panel/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── payments/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── permissions/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── secret-access/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── settings/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── subscriptions/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── system/
│   │   │   │   │   ├── database/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── env/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── master/
│   │   │   │   │   │   │   ├── areas/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── business-categories/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── cities/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── countries/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── languages/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── plans/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── states/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── company/
│   │   │   │   │   │   ├── employees/
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── products/
│   │   │   │   │   │   │   ├── credits/
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── profile/
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── boost/
│   │   │   │   └── index.ts
│   │   │   ├── login/
│   │   │   │   └── index.ts
│   │   │   ├── password/
│   │   │   │   ├── confirm/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── sanctum/
│   │   │   │   └── index.ts
│   │   │   ├── storage/
│   │   │   │   ├── local/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── two-factor/
│   │   │   │   ├── login/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── verification/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── global.d.ts
│   │   │   ├── index.ts
│   │   │   ├── navigation.ts
│   │   │   ├── ui.ts
│   │   │   └── vite-env.d.ts
│   │   ├── wayfinder/
│   │   │   └── index.ts
│   │   ├── app.tsx
│   │   └── react-router-dom-adapter.tsx
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── admin/
│   │   └── master.php
│   ├── admin.php
│   ├── api.php
│   ├── auth.php
│   ├── console.php
│   ├── settings.php
│   └── web.php
├── storage/
│   ├── app/
│   │   ├── backups/
│   │   │   └── auto_backup_before_purge_DEMO_2026-08-17_124215.json
│   │   ├── private/
│   │   │   └── .gitignore
│   │   ├── public/
│   │   │   └── .gitignore
│   │   └── .gitignore
│   ├── framework/
│   │   ├── cache/
│   │   ├── sessions/
│   │   ├── testing/
│   │   │   └── .gitignore
│   │   ├── views/
│   │   └── .gitignore
│   └── logs/
│       ├── .gitignore
│       ├── browser.log
│       └── laravel.log
├── tests/
│   ├── Feature/
│   │   ├── Admin/
│   │   │   ├── BusinessCategoryTest.php
│   │   │   ├── MasterTest.php
│   │   │   └── SuperAdminSecretAccessTest.php
│   │   ├── Api/
│   │   │   ├── Company/
│   │   │   │   ├── CompanyProfileTest.php
│   │   │   │   ├── EmployeeTest.php
│   │   │   │   ├── MultiProductTest.php
│   │   │   │   └── PlanFeatureCreditTest.php
│   │   │   └── AuthTest.php
│   │   ├── Auth/
│   │   │   ├── AuthenticationTest.php
│   │   │   ├── EmailVerificationTest.php
│   │   │   ├── PasswordConfirmationTest.php
│   │   │   ├── PasswordResetTest.php
│   │   │   ├── RegistrationTest.php
│   │   │   ├── TwoFactorChallengeTest.php
│   │   │   └── VerificationNotificationTest.php
│   │   ├── AccountProfileTest.php
│   │   ├── AdminAuthenticationTest.php
│   │   ├── DashboardTest.php
│   │   ├── ErrorPagesTest.php
│   │   ├── ExampleTest.php
│   │   └── SuperAdminSeedersTest.php
│   ├── Unit/
│   │   └── ExampleTest.php
│   ├── Pest.php
│   └── TestCase.php
├── .editorconfig
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── artisan
├── boost.json
├── components.json
├── composer.json
├── composer.lock
├── eslint.config.js
├── FILE_STRUCTURE.md
├── gcm-diagnose.log
├── laravel
├── laravel.code-workspace
├── package-lock.json
├── package.json
├── patch_index.cjs
├── patch_index.py
├── phpstan.neon
├── phpunit.xml
├── pint.json
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

## 🔑 Key Modules & Architecture Breakdown

### 1. Backend (`app/`)
- **`app/Http/Controllers/`**:
  - `Admin/`: Super Admin management (Companies, Subscriptions, Payments, Plans, Master Data, System Settings, Database & Environment tools).
  - `Api/V1/`: Version 1 API endpoints for Admin master data and Company services (Profile, Employees, Products, Plan Features & Credits).
  - `Auth/`: Authentication, password resets, email verification, 2FA challenge.
  - `Settings/`: User settings (Profile, Password, Appearance, 2FA).
- **`app/Models/`**: Eloquent models representing domain entities (`User`, `Admin`, `Company`, `Plan`, `Subscription`, `Feature`, `CreditTransaction`, `Country`, `State`, `City`, etc.).
- **`app/Services/`**: Dedicated business logic services (`SystemHealthService`, `DatabaseManagementService`, `EnvManagementService`).

### 2. Frontend (`resources/js/`)
- **`pages/`**:
  - `admin/`: Super Admin portal pages (Dashboard, Companies, Subscriptions, Payments, Plans, Master data, System settings, Database/Env backups).
  - `company/`: Company-specific portal views.
  - `auth/`: Login, Register, Forgot Password, Reset Password, Two-Factor Authentication.
  - `settings/`: Account and application settings.
- **`components/`**: Reusable UI components (Metronic UI widgets, buttons, modal dialogs, tables, forms, icons).
- **`layouts/`**: Base layouts (`admin-layout`, `auth-layout`, `app-layout`, `settings-layout`).
- **`actions/` & `routes/`**: Laravel Wayfinder generated TypeScript bindings for seamless frontend-backend communication.
- **`hooks/`**: Custom React hooks (`use-appearance`, `use-initials`, `use-mobile`, `use-clipboard`, etc.).

### 3. Routing (`routes/`)
- `routes/web.php`: Root entry, marketing/guest routes, and app dashboard.
- `routes/admin.php`: Admin panel routes.
- `routes/admin/master.php`: Admin master configuration data routes.
- `routes/api.php`: REST API endpoints for external clients / SPA integrations.
- `routes/auth.php`: Authentication routes.
- `routes/settings.php`: Profile & security settings routes.

### 4. Tests (`tests/`)
- `tests/Feature/Admin/`: Super Admin CRUD & master tests.
- `tests/Feature/Api/`: API endpoints, authentication, company profile, employees, product & credit tests.
- `tests/Feature/Auth/`: Authentication lifecycle test suites.
- `tests/TestCase.php` & `tests/Pest.php`: Pest test configuration & helpers.