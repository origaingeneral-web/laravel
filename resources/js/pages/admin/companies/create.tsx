import { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Building2,
    KeyRound,
    User,
    FileText,
    CreditCard,
    Check,
    ChevronRight,
    ChevronLeft,
    UploadCloud,
    ArrowLeft,
    Send,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperPanel,
    StepperContent,
    StepperNav,
} from '@/components/ui/stepper';

export default function Create({ lookups, statusOptions }: any) {
    const { data, setData, post, processing, errors } = useForm({
        // 1. Company Details
        company_name: '',
        business_category_id: '',
        mobile: '',
        email: '',
        landline: '',
        address: '',
        country_id: '',
        state_id: '',
        city_id: '',
        area_id: '',
        pincode: '',

        // 2. Login Details
        company_code: '',
        admin_email: '', // Username (Email Id)
        admin_password: '', // Password
        calling_pin_code: '',
        create_admin: true,

        // 3. Allot Plan (Now Step 3)
        main_branch: 'Flash Force',
        plan_id: '',
        active_from: new Date().toISOString().split('T')[0],
        active_to: '',
        received_amount: '',
        number_of_branch: '',

        // 4. Owner Details (Now Step 4 - Optional)
        owner_name: '',
        owner_mobile: '',

        // 5. Document Details (Now Step 5 - Optional)
        profile_picture: null as File | null,
        document_number: '', // PAN Number
        id_type: '',
        id_proof: null as File | null,
        address_type: '',
        address_proof: null as File | null,
        remark: '',
        status: 1,
    });

    const [activeStep, setActiveStep] = useState(1);

    const handlePlanChange = (selectedPlanId: string) => {
        setData((prev) => {
            const plan = lookups?.plans?.find((p: any) => String(p.id) === String(selectedPlanId));
            if (!plan) {
                return { ...prev, plan_id: selectedPlanId };
            }

            const fromDate = prev.active_from ? new Date(prev.active_from) : new Date();
            const toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + (Number(plan.duration_in_days) || 30));

            return {
                ...prev,
                plan_id: selectedPlanId,
                received_amount: plan.price ? String(plan.price) : prev.received_amount,
                number_of_branch: plan.staff_limit ? String(plan.staff_limit) : prev.number_of_branch,
                active_to: toDate.toISOString().split('T')[0],
            };
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/companies');
    };

    const nextStep = () => setActiveStep((p) => Math.min(p + 1, 5));
    const prevStep = () => setActiveStep((p) => Math.max(p - 1, 1));

    // Helper for file inputs
    const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData(field as any, e.target.files[0]);
        }
    };

    return (
        <>
            <Head title="Add Company | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Add Company"
                        description="Quickly set up a new company. You can submit directly after selecting a plan in Step 3 or add more details."
                    />
                    <ToolbarActions>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/companies">
                                <ArrowLeft className="size-4" /> Back to Companies
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="">
                <Card className="border-none shadow-xl bg-background overflow-hidden ring-1 ring-border">
                    <Stepper
                        value={activeStep}
                        onValueChange={setActiveStep}
                        orientation="horizontal"
                        className="p-0"
                    >
                        {/* Premium Stepper Nav */}
                        <div className="bg-muted/30 border-b border-border p-6 overflow-x-auto">
                            <StepperNav className="min-w-max w-full justify-between gap-4">
                                {[
                                    { step: 1, title: 'Company', desc: 'Basic info', icon: Building2 },
                                    { step: 2, title: 'Login', desc: 'Access credentials', icon: KeyRound },
                                    { step: 3, title: 'Plan', desc: 'Subscription setup', icon: CreditCard },
                                    { step: 4, title: 'Owner', desc: 'Optional details', icon: User },
                                    { step: 5, title: 'Documents', desc: 'KYC & files (Optional)', icon: FileText },
                                ].map((s) => (
                                    <StepperItem key={s.step} step={s.step} className="flex-1 min-w-[150px]">
                                        <StepperTrigger className="w-full flex items-center justify-start gap-4 p-3 rounded-xl transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border hover:bg-muted/50">
                                            <StepperIndicator className="size-10 shadow-sm">
                                                {activeStep > s.step ? <Check className="size-5" /> : <s.icon className="size-5" />}
                                            </StepperIndicator>
                                            <div className="flex flex-col items-start text-left">
                                                <StepperTitle className="text-sm font-semibold">{s.title}</StepperTitle>
                                                <StepperDescription className="text-xs">{s.desc}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                    </StepperItem>
                                ))}
                            </StepperNav>
                        </div>

                        <StepperPanel className="p-6 sm:p-8">
                            <form onSubmit={submit}>
                                {/* STEP 1: Company Details */}
                                <StepperContent value={1}>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                <Building2 className="text-primary size-5" />
                                                1. Company Details
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Provide the general business information.</p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="company_name">Company Name <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="company_name"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="Enter Name Of Company"
                                                    className="bg-muted/20"
                                                    required
                                                />
                                                <p className="text-[11px] text-muted-foreground">Don't use special characters.</p>
                                                {errors.company_name && <p className="text-sm text-destructive">{errors.company_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="business_category_id">Business Category <span className="text-destructive">*</span></Label>
                                                <Select value={data.business_category_id} onValueChange={(v) => setData('business_category_id', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select Category" /></SelectTrigger>
                                                    <SelectContent>
                                                        {lookups?.businessCategories?.map((cat: any) => (
                                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.category}</SelectItem>
                                                        ))}
                                                        {!lookups?.businessCategories?.length && <SelectItem value="1">General Business</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                {errors.business_category_id && <p className="text-sm text-destructive">{errors.business_category_id}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="mobile">Mobile Number <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="mobile"
                                                    value={data.mobile}
                                                    onChange={(e) => setData('mobile', e.target.value)}
                                                    placeholder="Enter Mobile Number Of Company"
                                                    className="bg-muted/20"
                                                    required
                                                />
                                                {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Enter Email ID Of Company"
                                                    className="bg-muted/20"
                                                    required
                                                />
                                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="landline">Land Line Number</Label>
                                                <Input
                                                    id="landline"
                                                    value={data.landline}
                                                    onChange={(e) => setData('landline', e.target.value)}
                                                    placeholder="Enter Land Line Number Of Company"
                                                    className="bg-muted/20"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                                                <Textarea
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="Enter Address Of Company"
                                                    className="bg-muted/20 min-h-[100px]"
                                                    required
                                                />
                                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country_id">Country <span className="text-destructive">*</span></Label>
                                                <Select value={data.country_id} onValueChange={(v) => setData('country_id', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select Country" /></SelectTrigger>
                                                    <SelectContent>
                                                        {lookups?.countries?.map((c: any) => (
                                                            <SelectItem key={c.id} value={String(c.id)}>{c.country}</SelectItem>
                                                        ))}
                                                        {!lookups?.countries?.length && <SelectItem value="1">India</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                {errors.country_id && <p className="text-sm text-destructive">{errors.country_id}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state_id">State <span className="text-destructive">*</span></Label>
                                                <Select value={data.state_id} onValueChange={(v) => setData('state_id', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select State" /></SelectTrigger>
                                                    <SelectContent>
                                                        {lookups?.states?.map((s: any) => (
                                                            <SelectItem key={s.id} value={String(s.id)}>{s.state}</SelectItem>
                                                        ))}
                                                        {!lookups?.states?.length && <SelectItem value="1">State 1</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                {errors.state_id && <p className="text-sm text-destructive">{errors.state_id}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city_id">City <span className="text-destructive">*</span></Label>
                                                <Select value={data.city_id} onValueChange={(v) => setData('city_id', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select City" /></SelectTrigger>
                                                    <SelectContent>
                                                        {lookups?.cities?.map((c: any) => (
                                                            <SelectItem key={c.id} value={String(c.id)}>{c.city}</SelectItem>
                                                        ))}
                                                        {!lookups?.cities?.length && <SelectItem value="1">City 1</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                {errors.city_id && <p className="text-sm text-destructive">{errors.city_id}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="area_id">Area</Label>
                                                <Select value={data.area_id} onValueChange={(v) => setData('area_id', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select Area" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Default Area</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="pincode"
                                                    value={data.pincode}
                                                    onChange={(e) => setData('pincode', e.target.value)}
                                                    placeholder="Enter Pincode Of Area"
                                                    className="bg-muted/20"
                                                    required
                                                />
                                                {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </StepperContent>

                                {/* STEP 2: Login Details */}
                                <StepperContent value={2}>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                <KeyRound className="text-primary size-5" />
                                                2. Login Details
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Set up the primary administrative access for this company.</p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="company_code">Company Code</Label>
                                                <Input
                                                    id="company_code"
                                                    value={data.company_code}
                                                    onChange={(e) => setData('company_code', e.target.value)}
                                                    placeholder="Auto-generated if empty"
                                                    maxLength={4}
                                                    className="bg-muted/20 font-mono text-lg tracking-widest uppercase"
                                                />
                                                <p className="text-[11px] text-muted-foreground">Optional 4-letter unique identifier</p>
                                                {errors.company_code && <p className="text-sm text-destructive">{errors.company_code}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="admin_email">Admin Username (Email Id)</Label>
                                                <Input
                                                    id="admin_email"
                                                    type="email"
                                                    value={data.admin_email}
                                                    onChange={(e) => setData('admin_email', e.target.value)}
                                                    placeholder="e.g., admin@company.com"
                                                    className="bg-muted/20"
                                                />
                                                {errors.admin_email && <p className="text-sm text-destructive">{errors.admin_email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="admin_password">Admin Password</Label>
                                                <Input
                                                    id="admin_password"
                                                    type="text"
                                                    value={data.admin_password}
                                                    onChange={(e) => setData('admin_password', e.target.value)}
                                                    placeholder="Default: 123456"
                                                    className="bg-muted/20 font-mono tracking-widest"
                                                />
                                                {errors.admin_password && <p className="text-sm text-destructive">{errors.admin_password}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="calling_pin_code">Calling Pin Code</Label>
                                                <Input
                                                    id="calling_pin_code"
                                                    value={data.calling_pin_code}
                                                    onChange={(e) => setData('calling_pin_code', e.target.value)}
                                                    placeholder="Enter Calling Pin Code"
                                                    maxLength={5}
                                                    className="bg-muted/20 font-mono tracking-widest"
                                                />
                                                <p className="text-[11px] text-muted-foreground">Max 5 characters (Used for support & password reset verification)</p>
                                                {errors.calling_pin_code && <p className="text-sm text-destructive">{errors.calling_pin_code}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </StepperContent>

                                {/* STEP 3: Allot Plan (Now Step 3 with direct Submit option) */}
                                <StepperContent value={3}>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                                    <CreditCard className="text-primary size-5" />
                                                    3. Allot Plan & Subscription
                                                </h2>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Assign software subscription plan and limits. You can submit now or proceed to add owner & KYC details.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                                                <Sparkles className="size-3.5" /> Ready for Immediate Submission
                                            </div>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="plan_id">Select Plan <span className="text-destructive">*</span></Label>
                                                <Select value={data.plan_id} onValueChange={handlePlanChange}>
                                                    <SelectTrigger className="bg-muted/20">
                                                        <SelectValue placeholder="Choose a subscription plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {lookups?.plans?.map((p: any) => (
                                                            <SelectItem key={p.id} value={String(p.id)}>
                                                                {p.plan_name} ({p.duration_in_days} Days) - ₹{p.price} (Staff Limit: {p.staff_limit})
                                                            </SelectItem>
                                                        ))}
                                                        {!lookups?.plans?.length && (
                                                            <>
                                                                <SelectItem value="1">Standard Plan (30 Days)</SelectItem>
                                                                <SelectItem value="2">Enterprise Plan (365 Days)</SelectItem>
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.plan_id && <p className="text-sm text-destructive">{errors.plan_id}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="main_branch">Main Branch Name</Label>
                                                <Input
                                                    id="main_branch"
                                                    value={data.main_branch}
                                                    onChange={(e) => setData('main_branch', e.target.value)}
                                                    placeholder="Main Head Office"
                                                    className="bg-muted/20"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="active_from">Subscription Start Date</Label>
                                                <Input
                                                    id="active_from"
                                                    type="date"
                                                    value={data.active_from}
                                                    onChange={(e) => setData('active_from', e.target.value)}
                                                    className="bg-muted/20"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="active_to">Subscription Expiry Date</Label>
                                                <Input
                                                    id="active_to"
                                                    type="date"
                                                    value={data.active_to}
                                                    onChange={(e) => setData('active_to', e.target.value)}
                                                    className="bg-muted/20"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="received_amount">Received Amount (₹)</Label>
                                                <Input
                                                    id="received_amount"
                                                    type="number"
                                                    value={data.received_amount}
                                                    onChange={(e) => setData('received_amount', e.target.value)}
                                                    placeholder="0.00"
                                                    className="bg-muted/20"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="number_of_branch">Staff / Branch Limit</Label>
                                                <Input
                                                    id="number_of_branch"
                                                    type="number"
                                                    value={data.number_of_branch}
                                                    onChange={(e) => setData('number_of_branch', e.target.value)}
                                                    placeholder="e.g., 10"
                                                    className="bg-muted/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </StepperContent>

                                {/* STEP 4: Owner Details (Optional) */}
                                <StepperContent value={4}>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                <User className="text-primary size-5" />
                                                4. Owner Details <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Contact information for the company owner or key stakeholder.</p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="owner_name">Owner Name</Label>
                                                <Input
                                                    id="owner_name"
                                                    value={data.owner_name}
                                                    onChange={(e) => setData('owner_name', e.target.value)}
                                                    placeholder="Defaults to Company Name if empty"
                                                    className="bg-muted/20"
                                                />
                                                {errors.owner_name && <p className="text-sm text-destructive">{errors.owner_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="owner_mobile">Owner Mobile Number</Label>
                                                <Input
                                                    id="owner_mobile"
                                                    value={data.owner_mobile}
                                                    onChange={(e) => setData('owner_mobile', e.target.value)}
                                                    placeholder="Defaults to Company Mobile if empty"
                                                    className="bg-muted/20"
                                                />
                                                {errors.owner_mobile && <p className="text-sm text-destructive">{errors.owner_mobile}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </StepperContent>

                                {/* STEP 5: Document Details (Optional) */}
                                <StepperContent value={5}>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                <FileText className="text-primary size-5" />
                                                5. Document Details <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Upload KYC documentation, proofs, and remarks.</p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="profile_picture">Profile Picture</Label>
                                                <div className="flex items-center gap-3">
                                                    <Button type="button" variant="outline" className="shrink-0 relative overflow-hidden">
                                                        <UploadCloud className="mr-2 size-4" />
                                                        Choose File
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange('profile_picture')} accept="image/*" />
                                                    </Button>
                                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                        {data.profile_picture ? data.profile_picture.name : 'No file chosen'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">Owner photo or logo image</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="document_number">PAN Number</Label>
                                                <Input
                                                    id="document_number"
                                                    value={data.document_number}
                                                    onChange={(e) => setData('document_number', e.target.value)}
                                                    placeholder="Enter PAN Number"
                                                    className="bg-muted/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="id_type">ID Type</Label>
                                                <Select value={data.id_type} onValueChange={(v) => setData('id_type', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select ID Type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Aadhaar">Aadhaar Card</SelectItem>
                                                        <SelectItem value="Voter ID">Voter ID</SelectItem>
                                                        <SelectItem value="Passport">Passport</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="id_proof">ID Proof</Label>
                                                <div className="flex items-center gap-3">
                                                    <Button type="button" variant="outline" className="shrink-0 relative overflow-hidden">
                                                        <UploadCloud className="mr-2 size-4" />
                                                        Choose File
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange('id_proof')} />
                                                    </Button>
                                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                        {data.id_proof ? data.id_proof.name : 'No file chosen'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address_type">Address Type</Label>
                                                <Select value={data.address_type} onValueChange={(v) => setData('address_type', v)}>
                                                    <SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select Address Proof Type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Electricity Bill">Electricity Bill</SelectItem>
                                                        <SelectItem value="Rent Agreement">Rent Agreement</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address_proof">Address Proof</Label>
                                                <div className="flex items-center gap-3">
                                                    <Button type="button" variant="outline" className="shrink-0 relative overflow-hidden">
                                                        <UploadCloud className="mr-2 size-4" />
                                                        Choose File
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange('address_proof')} />
                                                    </Button>
                                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                        {data.address_proof ? data.address_proof.name : 'No file chosen'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="remark">Remarks</Label>
                                                <Textarea
                                                    id="remark"
                                                    value={data.remark}
                                                    onChange={(e) => setData('remark', e.target.value)}
                                                    placeholder="Any additional notes or instructions"
                                                    className="bg-muted/20 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </StepperContent>

                                {/* Responsive Stepper Action Controls */}
                                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        disabled={activeStep === 1}
                                        onClick={prevStep}
                                        className="gap-2"
                                    >
                                        <ChevronLeft className="size-4" /> Previous
                                    </Button>

                                    <div className="flex items-center gap-3">
                                        {/* Direct Submit button accessible right from Step 3 onwards */}
                                        {activeStep >= 3 && (
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={processing}
                                                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                                            >
                                                <Send className="size-4" />
                                                {processing ? 'Creating Company...' : 'Submit & Create Company'}
                                            </Button>
                                        )}

                                        {activeStep < 5 && (
                                            <Button
                                                type="button"
                                                variant={activeStep >= 3 ? 'outline' : 'default'}
                                                size="lg"
                                                onClick={nextStep}
                                                className="gap-2 px-6"
                                            >
                                                {activeStep === 3 ? 'More Details (Optional)' : 'Next'}
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </StepperPanel>
                    </Stepper>
                </Card>
            </Container>
        </>
    );
}
