import { ReactNode } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { I18N_LANGUAGES } from '@/i18n/config';
import { Language } from '@/i18n/types';
import {
  AtSign,
  Briefcase,
  Building2,
  CreditCard,
  Globe,
  Moon,
  PanelLeft,
  Settings,
  UserCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useLanguage } from '@/providers/i18n-provider';
import { useSettings } from '@/providers/settings-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { logout, user } = useAuth();
  const { currenLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { settings, storeOption } = useSettings();

  const isDarkSidebar = settings?.layouts?.demo1?.sidebarTheme === 'dark';

  const handleSidebarThemeToggle = (checked: boolean) => {
    storeOption('layouts.demo1.sidebarTheme', checked ? 'dark' : 'light');
  };

  // User display metadata
  const displayName =
    user?.fullname ||
    (user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.name || user?.username || 'Demo Admin');

  const username = user?.username || 'demo';
  const displayEmail = user?.email || 'demo@kt.com';
  const displayAvatar = toAbsoluteUrl('/media/avatars/300-2.png');
  const department = user?.department || 'Engineering & Operations';
  const designation = user?.designation || user?.role || 'Lead Administrator';
  const companyName = user?.company?.company_name || user?.company_name || 'KeenThemes Demo Corp';
  const companyCode = user?.company?.company_code || user?.company_code || 'DEMO';
  const planName = user?.plan || 'Pro Plan';

  const handleLanguage = (lang: Language) => {
    changeLanguage(lang);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" side="bottom" align="end">
        {/* User Detailed Header Card */}
        <div className="p-3 bg-muted/40 rounded-t-md border-b border-border/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <img
                className="size-10 rounded-full border-2 border-primary/80 shrink-0"
                src={displayAvatar}
                alt="User avatar"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <AtSign className="size-3 text-muted-foreground/70" />
                  {username}
                </span>
              </div>
            </div>
            <Badge variant="primary" appearance="light" size="sm" className="shrink-0">
              {planName}
            </Badge>
          </div>

          <div className="mt-2.5 space-y-1 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-mono text-muted-foreground/80 truncate">
                {displayEmail}
              </span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Briefcase className="size-3 shrink-0 text-primary/70" />
              <span className="truncate">
                <strong className="text-foreground/90 font-medium">{designation}</strong> • {department}
              </span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="size-3 shrink-0 text-primary/70" />
              <span className="truncate">
                {companyName} <span className="font-mono text-xs opacity-75">({companyCode})</span>
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* 1. My Profile */}
        <DropdownMenuItem asChild>
          <Link
            to="/account/home/user-profile"
            className="flex items-center gap-2.5 cursor-pointer font-medium"
          >
            <UserCircle className="size-4 text-muted-foreground" />
            My Profile
          </Link>
        </DropdownMenuItem>

        {/* 2. Plan Details */}
        <DropdownMenuItem asChild>
          <Link
            to="/account/billing/basic"
            className="flex items-center gap-2.5 cursor-pointer font-medium"
          >
            <CreditCard className="size-4 text-muted-foreground" />
            Plan Details
          </Link>
        </DropdownMenuItem>

        {/* 3. Settings */}
        <DropdownMenuItem asChild>
          <Link
            to="/account/home/get-started"
            className="flex items-center gap-2.5 cursor-pointer font-medium"
          >
            <Settings className="size-4 text-muted-foreground" />
            Settings
          </Link>
        </DropdownMenuItem>

        {/* 4. Language Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 font-medium [&_[data-slot=dropdown-menu-sub-trigger-indicator]]:hidden">
            <Globe className="size-4 text-muted-foreground" />
            <span className="flex items-center justify-between gap-2 grow relative">
              Language
              <Badge
                variant="outline"
                className="absolute end-0 top-1/2 -translate-y-1/2 font-normal"
              >
                {currenLanguage.label}
                <img
                  src={currenLanguage.flag}
                  className="w-3.5 h-3.5 rounded-full ml-1"
                  alt={currenLanguage.label}
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup
              value={currenLanguage.code}
              onValueChange={(value) => {
                const selectedLang = I18N_LANGUAGES.find(
                  (lang) => lang.code === value,
                );
                if (selectedLang) handleLanguage(selectedLang);
              }}
            >
              {I18N_LANGUAGES.map((item) => (
                <DropdownMenuRadioItem
                  key={item.code}
                  value={item.code}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={item.flag}
                    className="w-4 h-4 rounded-full"
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="my-1" />

        {/* 5. Dark Mode & Dark Sidebar Switches */}
        <DropdownMenuItem
          className="flex items-center gap-2.5 cursor-pointer"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2 justify-between grow text-sm font-medium">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2.5 cursor-pointer"
          onSelect={(event) => event.preventDefault()}
        >
          <PanelLeft className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2 justify-between grow text-sm font-medium">
            Dark Sidebar
            <Switch
              size="sm"
              checked={isDarkSidebar}
              onCheckedChange={handleSidebarThemeToggle}
            />
          </div>
        </DropdownMenuItem>

        {/* Logout Button */}
        <div className="p-2 mt-1 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            className="w-full font-semibold"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
