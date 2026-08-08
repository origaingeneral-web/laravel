import { Head, usePage } from '@inertiajs/react';
import {
    CalendarCog,
    Check,
    Copy,
    FileText,
    LinkIcon,
    Mail,
    MapPin,
    Plus,
    ShieldCheck,
    SquarePen,
    Trash2,
    UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Container } from '@/components/common/container';
import {
    Toolbar,
    ToolbarActions,
    ToolbarHeading,
} from '@/layouts/demo1/components/toolbar';
import { toAbsoluteUrl } from '@/lib/helpers';
import type { Auth } from '@/types';

const profileRows = [
    ['Availability', 'Available now'],
    ['Birthday', '28 May 1996'],
    ['Gender', 'Not specified'],
    ['Address', 'Add your address'],
];

const calendarAccounts = [
    {
        logo: 'google-calendar.svg',
        title: 'Google',
        email: 'calendar@workspace.local',
    },
    {
        logo: 'monday.svg',
        title: 'Monday',
        email: 'planning@workspace.local',
    },
];

const connections = [
    { avatar: '300-3.png', name: 'Tyler Hero', count: 26, connected: true },
    {
        avatar: '300-1.png',
        name: 'Esther Howard',
        count: 639,
        connected: false,
    },
    { avatar: '300-11.png', name: 'Jacob Jones', count: 125, connected: false },
    { avatar: '300-2.png', name: 'Cody Fisher', count: 81, connected: true },
];

const uploads = [
    { name: 'Profile assets', type: 'Design file', size: '12.4 MB' },
    { name: 'Signed agreement', type: 'PDF document', size: '1.8 MB' },
    { name: 'Brand guidelines', type: 'Document', size: '4.2 MB' },
];

export default function UserProfile() {
    const { props } = usePage<{ auth?: Auth }>();
    const user = props.auth?.user;
    const company = user?.company as
        | { company_name?: string; company_code?: string; email?: string }
        | undefined;

    const displayName = String(user?.name ?? 'Jason Tatum');
    const displayEmail = String(user?.email ?? 'jasontt@studio.co');
    const avatar = user?.avatar || toAbsoluteUrl('/media/avatars/300-2.png');
    const companyName = company?.company_name ?? 'KeenThemes Demo Corp';
    const companyCode = company?.company_code ?? 'DEMO';

    return (
        <>
            <Head title="My Profile" />

            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="My Profile"
                        description="Central Hub for Personal Customization"
                    />
                    <ToolbarActions>
                        <Button variant="outline">Public Profile</Button>
                        <Button>Account Settings</Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <div className="grid grid-cols-1 gap-5 lg:gap-7.5 xl:grid-cols-2">
                    <div className="grid content-start gap-5 lg:gap-7.5">
                        <Card className="min-w-full">
                            <CardHeader>
                                <CardTitle>Personal Info</CardTitle>
                            </CardHeader>
                            <CardContent className="kt-scrollable-x-auto p-0 pb-3">
                                <Table className="align-middle text-sm text-muted-foreground">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="min-w-28 py-2 font-normal text-secondary-foreground">
                                                Photo
                                            </TableCell>
                                            <TableCell className="min-w-44 py-2 text-sm font-normal">
                                                150x150px JPEG, PNG Image
                                            </TableCell>
                                            <TableCell className="py-2 text-center">
                                                <img
                                                    src={avatar}
                                                    alt={displayName}
                                                    className="mx-auto size-14 rounded-full border-2 border-primary/70 object-cover"
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                Name
                                            </TableCell>
                                            <TableCell className="py-3 font-normal text-foreground">
                                                {displayName}
                                            </TableCell>
                                            <TableCell className="py-3 text-center">
                                                <Button
                                                    variant="ghost"
                                                    mode="icon"
                                                >
                                                    <SquarePen className="size-4 text-blue-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {profileRows.map(([label, value]) => (
                                            <TableRow key={label}>
                                                <TableCell className="py-3 font-normal text-secondary-foreground">
                                                    {label}
                                                </TableCell>
                                                <TableCell className="py-3 text-sm font-normal text-secondary-foreground">
                                                    {label ===
                                                    'Availability' ? (
                                                        <Badge
                                                            size="md"
                                                            variant="success"
                                                            appearance="light"
                                                        >
                                                            {value}
                                                        </Badge>
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        mode="icon"
                                                    >
                                                        <SquarePen className="size-4 text-blue-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="min-w-full">
                            <CardHeader>
                                <CardTitle>Basic Settings</CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-secondary-foreground">
                                        Public Profile
                                    </span>
                                    <SwitchWrapper>
                                        <Switch defaultChecked size="sm" />
                                    </SwitchWrapper>
                                </div>
                            </CardHeader>
                            <CardContent className="kt-scrollable-x-auto p-0 pb-3">
                                <Table className="align-middle text-sm text-muted-foreground">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="min-w-36 py-3 font-normal text-secondary-foreground">
                                                Email
                                            </TableCell>
                                            <TableCell className="min-w-60 py-3 font-normal text-foreground">
                                                {displayEmail}
                                            </TableCell>
                                            <TableCell className="py-3 text-end">
                                                <Button
                                                    variant="ghost"
                                                    mode="icon"
                                                >
                                                    <SquarePen className="size-4 text-blue-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                Password
                                            </TableCell>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                Password last changed 2 months
                                                ago
                                            </TableCell>
                                            <TableCell className="py-3 text-end">
                                                <Button
                                                    variant="ghost"
                                                    mode="icon"
                                                >
                                                    <SquarePen className="size-4 text-blue-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                2FA
                                            </TableCell>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                To be set
                                            </TableCell>
                                            <TableCell className="py-3 text-end">
                                                <Button
                                                    mode="link"
                                                    size="sm"
                                                    underlined="dashed"
                                                >
                                                    Setup
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                Referral Link
                                            </TableCell>
                                            <TableCell className="py-3 font-normal text-secondary-foreground">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-foreground">
                                                        https://studio.co/
                                                        {companyCode}
                                                    </span>
                                                    <Button
                                                        variant="dim"
                                                        mode="icon"
                                                    >
                                                        <Copy className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 text-end">
                                                <Button
                                                    mode="link"
                                                    underlined="dashed"
                                                >
                                                    Re-create
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Work</CardTitle>
                                <Badge variant="primary" appearance="light">
                                    Active
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="flex items-start gap-3">
                                        <UserRound className="mt-0.5 size-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium text-foreground">
                                                Lead Administrator
                                            </div>
                                            <div className="text-sm text-secondary-foreground">
                                                {companyName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 size-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium text-foreground">
                                                Remote first
                                            </div>
                                            <div className="text-sm text-secondary-foreground">
                                                Operations and product
                                                management
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid content-start gap-5 lg:gap-7.5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Start Now</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-foreground">
                                            Complete account protection
                                        </div>
                                        <p className="text-sm text-secondary-foreground">
                                            Add recovery methods, verify your
                                            public details, and keep connected
                                            accounts up to date.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button variant="outline">
                                    Review Settings
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Calendar Accounts{' '}
                                    <span className="text-sm font-medium text-secondary-foreground">
                                        1/5
                                    </span>
                                </CardTitle>
                                <Button variant="outline">
                                    <CalendarCog className="size-4" /> Add New
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2.5">
                                    {calendarAccounts.map((item) => (
                                        <div
                                            key={item.title}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <img
                                                    src={toAbsoluteUrl(
                                                        `/media/brand-logos/${item.logo}`,
                                                    )}
                                                    className="size-6 shrink-0"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-mono">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-sm text-secondary-foreground">
                                                        {item.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" mode="icon">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="min-w-full">
                            <CardHeader>
                                <CardTitle>Connections</CardTitle>
                                <Button variant="outline">
                                    <Plus className="size-4" /> Invite
                                </Button>
                            </CardHeader>
                            <CardContent className="kt-scrollable-x-auto p-0">
                                <Table className="align-middle text-sm text-secondary-foreground">
                                    <TableBody>
                                        {connections.map((connection) => (
                                            <TableRow key={connection.name}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        <img
                                                            src={toAbsoluteUrl(
                                                                `/media/avatars/${connection.avatar}`,
                                                            )}
                                                            className="size-9 shrink-0 rounded-full"
                                                            alt={
                                                                connection.name
                                                            }
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-mono">
                                                                {
                                                                    connection.name
                                                                }
                                                            </div>
                                                            <div className="text-xs text-secondary-foreground">
                                                                {
                                                                    connection.count
                                                                }{' '}
                                                                connections
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-end">
                                                    <Button
                                                        size="sm"
                                                        mode="icon"
                                                        variant={
                                                            connection.connected
                                                                ? 'primary'
                                                                : 'outline'
                                                        }
                                                        className="rounded-full"
                                                    >
                                                        {connection.connected ? (
                                                            <Check className="size-4" />
                                                        ) : (
                                                            <Plus className="size-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Button mode="link" underlined="dashed">
                                    View 64 more
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>My Files</CardTitle>
                                <Button variant="ghost" mode="icon">
                                    <LinkIcon className="size-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2.5">
                                    {uploads.map((upload) => (
                                        <div
                                            key={upload.name}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="size-5 text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">
                                                        {upload.name}
                                                    </div>
                                                    <div className="text-xs text-secondary-foreground">
                                                        {upload.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                appearance="light"
                                            >
                                                {upload.size}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <div className="flex items-center gap-3 text-sm text-secondary-foreground">
                                    <Mail className="size-4 text-muted-foreground" />
                                    Profile notifications are sent to{' '}
                                    {displayEmail}.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    );
}
