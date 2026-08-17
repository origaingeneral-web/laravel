import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Palette, Check, Sparkles, Search, RotateCcw, Paintbrush } from 'lucide-react';
import {
  COLOR_PALETTES,
  applyPalette,
  ColorPalette,
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
  const [activePalette, setActivePalette] = useState<string>('midnight-slate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_palette') || 'midnight-slate';
      setActivePalette(saved);
      applyPalette(saved);
    }
  }, []);

  const handleSelectPalette = (paletteId: string) => {
    setActivePalette(paletteId);
    applyPalette(paletteId);
  };

  const handleReset = () => {
    handleSelectPalette('midnight-slate');
  };

  const categories = ['All', 'Modern', 'Cyber', 'Nature', 'Warm', 'Vibrant'];

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

  const currentThemeObj = COLOR_PALETTES.find((p) => p.id === activePalette) || COLOR_PALETTES[0];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-xl overflow-hidden shadow-2xl border border-border/80 [&_[data-slot=sheet-close]]:top-4 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="p-5 border-b border-border/60 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-row items-center gap-3.5 space-y-0 shrink-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md shadow-inner">
            <Palette className="size-6" />
          </div>
          <div className="flex flex-col min-w-0 grow">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-bold text-white leading-tight">
                Theme Color Customizer
              </SheetTitle>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-[10px] px-1.5 py-0 h-4.5 font-medium">
                {COLOR_PALETTES.length} Schemes
              </Badge>
            </div>
            <p className="text-xs text-white/80 leading-normal mt-0.5">
              Select your favorite curated dark palette & accent color scheme
            </p>
          </div>
        </SheetHeader>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-border/50 bg-muted/20 space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative grow">
              <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search color theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-8.5 text-xs bg-background"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Reset to default theme"
              className="h-8.5 text-xs gap-1.5 shrink-0 px-2.5"
            >
              <RotateCcw className="size-3.5" />
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Preview Header */}
        <div className="px-5 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paintbrush className="size-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">
              Current Active: <strong className="text-foreground font-semibold">{currentThemeObj.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="size-3.5 rounded-full shadow-xs border border-white/20"
              style={{ backgroundColor: currentThemeObj.colors.primary }}
            />
            <span className="text-[11px] font-mono text-muted-foreground">
              {currentThemeObj.colors.primary}
            </span>
          </div>
        </div>

        <SheetBody className="grow p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
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
                    onClick={() => handleSelectPalette(palette.id)}
                    className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/25 bg-primary/5 shadow-sm'
                        : 'border-border/60 hover:border-primary/40 hover:bg-muted/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
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

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {palette.name}
                            </h3>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                              {palette.category}
                            </Badge>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-xs">
                                <Check className="size-2.5" />
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {palette.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Color Swatch Previews */}
                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div
                            className="size-4.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: palette.previewBg }}
                            title="Background Color"
                          />
                          <div
                            className="size-4.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: palette.previewCard }}
                            title="Card & Popover Surface"
                          />
                          <div
                            className="size-4.5 rounded-full border border-white/20 shadow-xs ring-1 ring-primary/30"
                            style={{ backgroundColor: palette.previewPrimary }}
                            title="Primary Accent"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground font-medium">
                          {palette.previewPrimary}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        className="h-7 text-xs px-3 rounded-lg font-medium"
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
                );
              })}
            </div>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
