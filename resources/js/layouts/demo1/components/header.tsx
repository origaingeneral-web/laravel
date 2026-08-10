import { useEffect, useState } from 'react';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { AppsDropdownMenu } from '@/partials/topbar/apps-dropdown-menu';
import { PaletteSheet } from '@/partials/topbar/palette-sheet';
import { SubscriptionSheet } from '@/partials/topbar/subscription-sheet';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { AiIcon } from '@/components/ai-icon';
import {
    Bell,
    CreditCard,
    LayoutGrid,
    Menu,
    Palette,
    RefreshCw,
    Search,
    SquareChevronRight,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from '@/components/common/container';
import { Breadcrumb } from './breadcrumb';
import { MegaMenu } from './mega-menu';
import { MegaMenuMobile } from './mega-menu-mobile';
import { SidebarMenu } from './sidebar-menu';

export function Header() {
    const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
    const [isMegaMenuSheetOpen, setIsMegaMenuSheetOpen] = useState(false);

    const { pathname } = useLocation();
    const mobileMode = useIsMobile();

    const scrollPosition = useScrollPosition();
    const headerSticky: boolean = scrollPosition > 0;

    // Close sheet when route changes
    useEffect(() => {
        setIsSidebarSheetOpen(false);
        setIsMegaMenuSheetOpen(false);
    }, [pathname]);

    const handleClearCache = () => {
        router.post('/admin/clear-cache');
    };

    return (
        <header
            className={cn(
                'header fixed start-0 end-0 top-0 z-10 flex shrink-0 items-stretch border-b border-border bg-background pe-[var(--removed-body-scroll-bar-size,0px)]',
            )}
        >
            <Container className="flex items-stretch justify-between lg:gap-4">
                {/* HeaderLogo */}
                <div className="flex items-center gap-1 gap-2.5 lg:hidden">
                    <Link to="/" className="shrink-0">
                        <img
                            src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                            className="h-[25px] w-full"
                            alt="mini-logo"
                        />
                    </Link>
                    <div className="flex items-center">
                        {mobileMode && (
                            <Sheet
                                open={isSidebarSheetOpen}
                                onOpenChange={setIsSidebarSheetOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button variant="ghost" mode="icon">
                                        <Menu className="text-muted-foreground/70" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    className="w-[275px] gap-0 p-0"
                                    side="left"
                                    close={false}
                                >
                                    <SheetHeader className="space-y-0 p-0" />
                                    <SheetBody className="overflow-y-auto p-0">
                                        <SidebarMenu />
                                    </SheetBody>
                                </SheetContent>
                            </Sheet>
                        )}
                        {mobileMode && (
                            <Sheet
                                open={isMegaMenuSheetOpen}
                                onOpenChange={setIsMegaMenuSheetOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button variant="ghost" mode="icon">
                                        <SquareChevronRight className="text-muted-foreground/70" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    className="w-[275px] gap-0 p-0"
                                    side="left"
                                    close={false}
                                >
                                    <SheetHeader className="space-y-0 p-0" />
                                    <SheetBody className="overflow-y-auto p-0">
                                        <MegaMenuMobile />
                                    </SheetBody>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>

                {/* Main Content (MegaMenu or Breadcrumbs) */}
                {pathname.startsWith('/account') ? (
                    <Breadcrumb />
                ) : (
                    !mobileMode && <MegaMenu />
                )}

                {/* HeaderTopbar */}
                <div className="ms-auto flex items-center gap-3">
                    <Button
                        variant="ghost"
                        mode="icon"
                        shape="circle"
                        onClick={handleClearCache}
                        title="Clear Cache"
                        className="size-9 hover:bg-amber-500/10 hover:[&_svg]:text-amber-500 text-amber-500/80"
                    >
                        <RefreshCw className="size-4.5!" />
                    </Button>
                    {/* <PaletteSheet
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-purple-500/10 hover:[&_svg]:text-purple-500 text-purple-500/80"
                                title="Color Palette Themes"
                            >
                                <Palette className="size-4.5!" />
                            </Button>
                        }
                    /> */}
                    <SearchDialog
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            >
                                <Search className="size-4.5!" />
                            </Button>
                        }
                    />
                    <NotificationsSheet
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            >
                                <Bell className="size-4.5!" />
                            </Button>
                        }
                    />
                    <SubscriptionSheet
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                                title="Plan & Billing"
                            >
                                <CreditCard className="size-4.5!" />
                            </Button>
                        }
                    />
                    <AppsDropdownMenu
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            >
                                <LayoutGrid className="size-4.5!" />
                            </Button>
                        }
                    />
                    <Button
                        variant="ghost"
                        mode="icon"
                        shape="circle"
                        className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                        title="Rigel AI"
                        onClick={() => router.visit('/admin/ai-assistant')}
                    >
                        <AiIcon className="size-6!" />
                    </Button>
                    <UserDropdownMenu
                        trigger={
                            <img
                                className="size-9 shrink-0 cursor-pointer rounded-full border-2 border-green-500"
                                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                                alt="User Avatar"
                            />
                        }
                    />
                </div>
            </Container>
        </header>
    );
}
