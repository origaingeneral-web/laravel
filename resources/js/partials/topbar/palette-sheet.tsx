import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Search,
  RotateCcw,
  Paintbrush,
  Sliders,
  Wand2,
  Copy,
  Save,
  Layers,
  ChevronRight,
  Eye,
  Menu,
  Sun,
  Moon,
  LayoutGrid,
  Zap,
} from 'lucide-react';
import {
  COLOR_PALETTES,
  STUDIO_TEMPLATES,
  applyPalette,
  getSavedCustomPalette,
  saveAndApplyCustomPalette,
  ColorPalette,
  DualModeCustomPalette,
  PaletteColors,
  StudioTemplate,
  getContrastForeground,
} from '@/config/palette.config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function PaletteSheet({ trigger }: { trigger: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [activePalette, setActivePalette] = useState<string>('midnight-slate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom Studio: which mode is currently being edited & previewed ('dark' | 'light')
  const [customEditingMode, setCustomEditingMode] = useState<'dark' | 'light'>('dark');

  // Custom theme studio state (Dual-mode)
  const [customName, setCustomName] = useState<string>('My Custom Theme');
  const [customDarkColors, setCustomDarkColors] = useState<PaletteColors>({
    ...STUDIO_TEMPLATES[0].dark,
  });
  const [customLightColors, setCustomLightColors] = useState<PaletteColors>({
    ...STUDIO_TEMPLATES[0].light,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_palette') || 'midnight-slate';
      setActivePalette(saved);
      if (saved === 'custom') {
        const savedCustom = getSavedCustomPalette();
        if (savedCustom) {
          if ('dark' in savedCustom && 'light' in savedCustom) {
            setCustomDarkColors(savedCustom.dark);
            setCustomLightColors(savedCustom.light);
            setCustomName(savedCustom.name || 'My Custom Theme');
          } else if ('colors' in savedCustom) {
            setCustomDarkColors(savedCustom.colors);
            setCustomName((savedCustom as ColorPalette).name || 'My Custom Theme');
          }
        }
      }
    }
  }, []);

  const handleSelectPreset = (paletteId: string) => {
    setActivePalette(paletteId);
    applyPalette(paletteId);
  };

  const handleResetDefault = () => {
    handleSelectPreset('midnight-slate');
  };

  // Load any studio template
  const handleLoadTemplate = (template: StudioTemplate) => {
    setCustomDarkColors({ ...template.dark });
    setCustomLightColors({ ...template.light });
    setCustomName(`${template.name} (Custom)`);
    setActivePalette('custom');

    const customPal: DualModeCustomPalette = {
      id: 'custom',
      name: `${template.name} (Custom)`,
      category: 'Custom',
      description: template.description,
      dark: { ...template.dark },
      light: { ...template.light },
    };
    applyPalette(customPal);
  };

  // Load single preset into customizer
  const handleLoadPresetIntoCustom = (palette: ColorPalette) => {
    if (palette.category === 'Light') {
      setCustomLightColors({ ...palette.colors });
      setCustomDarkColors({
        background: '#0f1423',
        card: '#161f30',
        popover: '#1f2b44',
        border: '#24324f',
        primary: palette.colors.primary,
        sidebar: '#111522',
      });
      setCustomEditingMode('light');
    } else {
      setCustomDarkColors({ ...palette.colors });
      setCustomLightColors({
        background: '#f8fafc',
        card: '#ffffff',
        popover: '#ffffff',
        border: '#e2e8f0',
        primary: palette.colors.primary,
        sidebar: '#ffffff',
      });
      setCustomEditingMode('dark');
    }

    setCustomName(`${palette.name} (Custom)`);
    setActiveTab('custom');
    setActivePalette('custom');

    applyPalette({
      id: 'custom',
      name: `${palette.name} (Custom)`,
      category: 'Custom',
      dark:
        palette.category === 'Light'
          ? {
              background: '#0f1423',
              card: '#161f30',
              popover: '#1f2b44',
              border: '#24324f',
              primary: palette.colors.primary,
              sidebar: '#111522',
            }
          : { ...palette.colors },
      light:
        palette.category === 'Light'
          ? { ...palette.colors }
          : {
              background: '#f8fafc',
              card: '#ffffff',
              popover: '#ffffff',
              border: '#e2e8f0',
              primary: palette.colors.primary,
              sidebar: '#ffffff',
            },
    });
  };

  // Update a single color in the active editing mode (dark or light)
  const handleColorChange = (key: keyof PaletteColors, value: string) => {
    let updatedDark = { ...customDarkColors };
    let updatedLight = { ...customLightColors };

    if (customEditingMode === 'dark') {
      updatedDark = { ...updatedDark, [key]: value };
      // If primary is updated in dark mode, sync it to light mode as well for consistency
      if (key === 'primary') {
        updatedLight.primary = value;
      }
      setCustomDarkColors(updatedDark);
      if (key === 'primary') setCustomLightColors(updatedLight);
    } else {
      updatedLight = { ...updatedLight, [key]: value };
      // If primary is updated in light mode, sync it to dark mode as well
      if (key === 'primary') {
        updatedDark.primary = value;
      }
      setCustomLightColors(updatedLight);
      if (key === 'primary') setCustomDarkColors(updatedDark);
    }

    // Live update application styles in real-time
    const liveDualPalette: DualModeCustomPalette = {
      id: 'custom',
      name: customName,
      category: 'Custom',
      dark: updatedDark,
      light: updatedLight,
    };
    applyPalette(liveDualPalette);
    setActivePalette('custom');
  };

  const handleSaveCustom = () => {
    const customPalette: DualModeCustomPalette = {
      id: 'custom',
      name: customName || 'My Custom Theme',
      category: 'Custom',
      description: 'Personalized dual-mode theme with tailored light and dark palettes',
      dark: customDarkColors,
      light: customLightColors,
    };
    saveAndApplyCustomPalette(customPalette);
    setActivePalette('custom');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Helper to lighten/darken hex
  const adjustHex = (hex: string, amount: number) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    let num = parseInt(clean, 16) || 0;
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    let b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Auto-harmonize current mode
  const handleAutoHarmonizeCurrentMode = () => {
    if (customEditingMode === 'dark') {
      const bg = customDarkColors.background;
      const card = adjustHex(bg, 14);
      const popover = adjustHex(bg, 24);
      const border = adjustHex(bg, 38);
      const sidebar = adjustHex(bg, -4);
      const updated = { ...customDarkColors, card, popover, border, sidebar };
      setCustomDarkColors(updated);
      applyPalette({
        id: 'custom',
        name: customName,
        dark: updated,
        light: customLightColors,
      });
    } else {
      const bg = customLightColors.background;
      const card = '#ffffff';
      const popover = '#ffffff';
      const border = adjustHex(bg, -22);
      const sidebar = '#ffffff';
      const updated = { ...customLightColors, card, popover, border, sidebar };
      setCustomLightColors(updated);
      applyPalette({
        id: 'custom',
        name: customName,
        dark: customDarkColors,
        light: updated,
      });
    }
  };

  const handleCopyCss = () => {
    const lightFg = getContrastForeground(customLightColors.primary);
    const darkFg = getContrastForeground(customDarkColors.primary);

    const css = `:root {
  /* Light Mode Theme */
  --background: ${customLightColors.background};
  --card: ${customLightColors.card};
  --popover: ${customLightColors.popover};
  --border: ${customLightColors.border};
  --input: ${customLightColors.border};
  --primary: ${customLightColors.primary};
  --primary-foreground: ${lightFg};
}

.dark {
  /* Dark Mode Theme */
  --background: ${customDarkColors.background};
  --card: ${customDarkColors.card};
  --popover: ${customDarkColors.popover};
  --border: ${customDarkColors.border};
  --input: ${customDarkColors.border};
  --primary: ${customDarkColors.primary};
  --primary-foreground: ${darkFg};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['All', 'Modern', 'Cyber', 'Nature', 'Warm', 'Vibrant', 'Light'];

  const filteredPalettes = useMemo(() => {
    return COLOR_PALETTES.filter((palette) => {
      const matchesCategory =
        selectedCategory === 'All' || palette.category === selectedCategory;
      const matchesSearch =
        palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // The active colors based on what mode is currently being edited in custom tab
  const activeCustomEditingColors =
    customEditingMode === 'dark' ? customDarkColors : customLightColors;

  const currentThemeObj =
    activePalette === 'custom'
      ? {
          id: 'custom',
          name: customName || 'Custom Dual Theme',
          category: 'Custom',
          colors: customDarkColors,
        }
      : COLOR_PALETTES.find((p) => p.id === activePalette) || COLOR_PALETTES[0];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[580px] sm:max-w-none inset-4 start-auto h-auto rounded-2xl overflow-hidden shadow-2xl border border-border/80 [&_[data-slot=sheet-close]]:top-4 [&_[data-slot=sheet-close]]:end-5">
        {/* Gradient Header */}
        <SheetHeader className="p-4.5 border-b border-border/60 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-row items-center gap-3.5 space-y-0 shrink-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md shadow-inner">
            <Palette className="size-6" />
          </div>
          <div className="flex flex-col min-w-0 grow">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-bold text-white leading-tight">
                Theme Studio & Palettes
              </SheetTitle>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-[10px] px-2 py-0.5 font-medium">
                Light & Dark Mode Ready
              </Badge>
            </div>
            <p className="text-xs text-white/80 leading-normal mt-0.5">
              Choose curated presets or customize Light & Dark mode colors with live preview.
            </p>
          </div>
        </SheetHeader>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 border-b border-border/60 bg-muted/40 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            <Layers className="size-3.5" />
            <span>Preset Palettes ({COLOR_PALETTES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-background text-primary shadow-xs'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            <Sliders className="size-3.5" />
            <span>Custom Theme Studio</span>
            {activePalette === 'custom' && (
              <span className="size-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        </div>

        {/* Current Active Indicator Bar */}
        <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Paintbrush className="size-3.5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              Active: <strong className="text-foreground font-semibold">{currentThemeObj.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <span
                className="size-3.5 rounded-full border border-white/20 shadow-2xs"
                style={{ backgroundColor: currentThemeObj.colors.background }}
                title="Background"
              />
              <span
                className="size-3.5 rounded-full border border-white/20 shadow-2xs"
                style={{ backgroundColor: currentThemeObj.colors.card }}
                title="Card"
              />
              <span
                className="size-3.5 rounded-full border border-white/20 shadow-2xs"
                style={{ backgroundColor: currentThemeObj.colors.primary }}
                title="Primary Accent"
              />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground font-semibold">
              {currentThemeObj.colors.primary}
            </span>
          </div>
        </div>

        {/* TAB 1: PRESET PALETTES */}
        {activeTab === 'presets' && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Search & Categories */}
            <div className="p-3.5 border-b border-border/50 bg-muted/15 space-y-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative grow">
                  <Search className="size-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by theme name or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-8.5 h-8 text-xs bg-background rounded-lg"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefault}
                  title="Reset to default theme"
                  className="h-8 text-xs gap-1.5 shrink-0 px-2.5 rounded-lg"
                >
                  <RotateCcw className="size-3" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                          : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets List */}
            <SheetBody className="grow p-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-270px)]">
              {filteredPalettes.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No color palettes found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {filteredPalettes.map((palette: ColorPalette) => {
                    const isSelected = activePalette === palette.id;

                    return (
                      <div
                        key={palette.id}
                        className={`group relative rounded-xl border p-3 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/25 bg-primary/5 shadow-sm'
                            : 'border-border/60 hover:border-primary/40 hover:bg-muted/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            onClick={() => handleSelectPreset(palette.id)}
                            className="flex items-start gap-3 grow cursor-pointer min-w-0"
                          >
                            {/* Visual Color Pill */}
                            <div
                              className="size-9 rounded-xl border border-white/20 shadow-xs flex items-center justify-center shrink-0 mt-0.5 relative overflow-hidden"
                              style={{ backgroundColor: palette.previewBg }}
                            >
                              <div
                                className="size-4.5 rounded-full shadow-md transition-transform group-hover:scale-110"
                                style={{ backgroundColor: palette.previewPrimary }}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                  {palette.name}
                                </h3>
                                <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 font-normal">
                                  {palette.category}
                                </Badge>
                                {isSelected && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-2xs">
                                    <Check className="size-2.5" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                                {palette.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Swatches & Actions */}
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div
                                className="size-4 rounded-full border border-white/20 shadow-2xs"
                                style={{ backgroundColor: palette.colors.background }}
                                title="Background"
                              />
                              <div
                                className="size-4 rounded-full border border-white/20 shadow-2xs"
                                style={{ backgroundColor: palette.colors.card }}
                                title="Card Surface"
                              />
                              <div
                                className="size-4 rounded-full border border-white/20 shadow-2xs"
                                style={{ backgroundColor: palette.colors.popover }}
                                title="Popover Surface"
                              />
                              <div
                                className="size-4 rounded-full border border-white/20 shadow-2xs ring-1 ring-primary/30"
                                style={{ backgroundColor: palette.colors.primary }}
                                title="Primary Accent"
                              />
                              <div
                                className="size-4 rounded-full border border-white/20 shadow-2xs"
                                style={{ backgroundColor: palette.colors.sidebar }}
                                title="Sidebar Background"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground font-medium">
                              {palette.previewPrimary}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadPresetIntoCustom(palette)}
                              title="Customize this palette in Studio"
                              className="h-6.5 text-[11px] px-2 text-muted-foreground hover:text-foreground rounded-md"
                            >
                              <Sliders className="size-3 mr-1" />
                              Customize
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSelectPreset(palette.id)}
                              variant={isSelected ? 'default' : 'outline'}
                              className="h-6.5 text-[11px] px-2.5 rounded-md font-medium"
                            >
                              {isSelected ? (
                                <span className="flex items-center gap-1">
                                  <Check className="size-3" /> Selected
                                </span>
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SheetBody>
          </div>
        )}

        {/* TAB 2: CUSTOM DUAL-MODE THEME STUDIO */}
        {activeTab === 'custom' && (
          <SheetBody className="grow p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
            {/* Theme Name Header */}
            <div className="flex items-center gap-2">
              <div className="grow">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Custom Theme Name
                </label>
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. My Pro Dual Theme"
                  className="h-8.5 text-xs bg-background rounded-lg font-medium"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoHarmonizeCurrentMode}
                title="Auto-harmonize card, popover, border & sidebar for the selected mode"
                className="h-8.5 mt-5 text-xs gap-1.5 shrink-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-medium rounded-lg"
              >
                <Wand2 className="size-3.5" />
                Harmonize
              </Button>
            </div>

            {/* PREDEFINED BASE STARTER TEMPLATES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3 text-amber-500" />
                  Predefined Starter Templates
                </label>
                <span className="text-[10px] text-muted-foreground">Click to load base colors</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STUDIO_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleLoadTemplate(tpl)}
                    className="p-2.5 rounded-xl border border-border/80 bg-card/60 hover:bg-muted/30 hover:border-primary/50 text-left transition-all group flex flex-col justify-between gap-1.5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-foreground group-hover:text-primary truncate">
                        {tpl.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Dark preview dot */}
                      <div
                        className="size-3.5 rounded-full border border-white/20 shadow-2xs"
                        style={{ backgroundColor: tpl.dark.background }}
                        title="Dark Mode Bg"
                      />
                      {/* Light preview dot */}
                      <div
                        className="size-3.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: tpl.light.background }}
                        title="Light Mode Bg"
                      />
                      {/* Primary dot */}
                      <div
                        className="size-3.5 rounded-full border border-white/20 shadow-2xs ring-1 ring-primary/40 ml-auto"
                        style={{ backgroundColor: tpl.dark.primary }}
                        title="Primary Accent"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* LIGHT / DARK MODE CUSTOMIZER TOGGLE */}
            <div className="p-1 rounded-xl bg-muted/50 border border-border/70 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCustomEditingMode('dark')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  customEditingMode === 'dark'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="size-3.5 text-indigo-400" />
                <span>Customize Dark Mode Colors</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomEditingMode('light')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  customEditingMode === 'light'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="size-3.5 text-amber-500" />
                <span>Customize Light Mode Colors</span>
              </button>
            </div>

            {/* LIVE INTERACTIVE PREVIEW SANDBOX (shows currently selected mode) */}
            <div
              className="rounded-xl border border-border/80 p-3.5 shadow-sm space-y-2.5 transition-colors"
              style={{ backgroundColor: activeCustomEditingColors.background }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye className="size-3 text-primary" />
                  Live Preview: {customEditingMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <span className="text-[10px] text-muted-foreground">Applies to both modes upon save</span>
              </div>

              {/* Simulated Card */}
              <div
                className="rounded-lg p-3 border shadow-xs space-y-2.5 transition-colors"
                style={{
                  backgroundColor: activeCustomEditingColors.card,
                  borderColor: activeCustomEditingColors.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-6 rounded-md flex items-center justify-center font-bold text-xs shadow-xs"
                      style={{
                        backgroundColor: activeCustomEditingColors.primary,
                        color: getContrastForeground(activeCustomEditingColors.primary),
                      }}
                    >
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground leading-none">Dashboard Preview</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Card Surface ({activeCustomEditingColors.card})</div>
                    </div>
                  </div>
                  <Badge
                    className="text-[10px] font-semibold py-0.5 px-2 rounded-md shadow-2xs border-0"
                    style={{
                      backgroundColor: activeCustomEditingColors.primary,
                      color: getContrastForeground(activeCustomEditingColors.primary),
                    }}
                  >
                    Active Badge
                  </Badge>
                </div>

                {/* Simulated Sidebar Menu Link */}
                <div
                  className="rounded-md p-2 flex items-center justify-between text-xs font-semibold shadow-2xs transition-colors"
                  style={{
                    backgroundColor: activeCustomEditingColors.primary,
                    color: getContrastForeground(activeCustomEditingColors.primary),
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Menu className="size-3.5" />
                    <span>Sidebar Menu Active Color</span>
                  </div>
                  <ChevronRight className="size-3.5" />
                </div>

                {/* Simulated Popover Pill */}
                <div
                  className="rounded-md p-2 border flex items-center justify-between text-[11px] transition-colors"
                  style={{
                    backgroundColor: activeCustomEditingColors.popover,
                    borderColor: activeCustomEditingColors.border,
                  }}
                >
                  <span className="text-foreground font-medium">Popover / Dropdown Surface</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {activeCustomEditingColors.popover}
                  </span>
                </div>
              </div>
            </div>

            {/* COLOR CONTROLS GRID */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {customEditingMode === 'dark' ? 'Dark Mode Color Controls' : 'Light Mode Color Controls'}
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Primary syncs across both modes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Background */}
                <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Background Color</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeCustomEditingColors.background}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-border/80 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                {/* 2. Primary Accent */}
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-primary">Primary Accent</label>
                    <span className="text-[10px] text-primary font-mono font-bold">
                      {activeCustomEditingColors.primary}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-primary/40 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="h-8 text-xs font-mono bg-background font-semibold"
                    />
                  </div>
                </div>

                {/* 3. Card Surface */}
                <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Card Surface</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeCustomEditingColors.card}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.card}
                      onChange={(e) => handleColorChange('card', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-border/80 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.card}
                      onChange={(e) => handleColorChange('card', e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                {/* 4. Popover / Dropdown */}
                <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Popover / Dropdown</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeCustomEditingColors.popover}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.popover}
                      onChange={(e) => handleColorChange('popover', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-border/80 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.popover}
                      onChange={(e) => handleColorChange('popover', e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                {/* 5. Border / Divider */}
                <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Border / Divider</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeCustomEditingColors.border}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.border}
                      onChange={(e) => handleColorChange('border', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-border/80 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.border}
                      onChange={(e) => handleColorChange('border', e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                {/* 6. Sidebar Background */}
                <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Sidebar Background</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeCustomEditingColors.sidebar}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeCustomEditingColors.sidebar}
                      onChange={(e) => handleColorChange('sidebar', e.target.value)}
                      className="size-8 rounded-lg cursor-pointer border border-border/80 bg-transparent p-0.5 shrink-0"
                    />
                    <Input
                      value={activeCustomEditingColors.sidebar}
                      onChange={(e) => handleColorChange('sidebar', e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCss}
                  className="h-8.5 text-xs gap-1.5 rounded-lg"
                >
                  <Copy className="size-3.5" />
                  {copied ? 'Copied CSS!' : 'Copy Dual CSS'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLoadTemplate(STUDIO_TEMPLATES[0])}
                  className="h-8.5 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                >
                  Reset Studio
                </Button>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleSaveCustom}
                className="h-8.5 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs rounded-lg px-4"
              >
                {saveSuccess ? (
                  <>
                    <Check className="size-3.5" /> Saved & Applied!
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" /> Save Dual Theme
                  </>
                )}
              </Button>
            </div>
          </SheetBody>
        )}
      </SheetContent>
    </Sheet>
  );
}
