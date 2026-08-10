import { ReactNode, useEffect, useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import {
  COLOR_PALETTES,
  applyPalette,
  ColorPalette,
} from '@/config/palette.config';
import { Button } from '@/components/ui/button';
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

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[460px] sm:max-w-none inset-5 start-auto h-auto rounded-lg overflow-hidden [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="p-4 border-b border-border bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-row items-center gap-3 space-y-0 shrink-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
            <Palette className="size-5" />
          </div>
          <div>
            <SheetTitle className="text-base font-bold text-white leading-tight">Theme Color Palettes</SheetTitle>
            <p className="text-[11px] text-purple-100/90 leading-normal">
              Select your favorite dark theme palette & accent color scheme.
            </p>
          </div>
        </SheetHeader>

        <SheetBody className="grow p-5 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Curated Ideal Themes</h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {COLOR_PALETTES.map((palette: ColorPalette) => {
              const isSelected = activePalette === palette.id;

              return (
                <div
                  key={palette.id}
                  onClick={() => handleSelectPalette(palette.id)}
                  className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md'
                      : 'border-border/70 hover:border-primary/50 hover:bg-muted/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-full ${palette.badgeColor}`} />
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {palette.name}
                        </h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {palette.description}
                      </p>
                    </div>
                  </div>

                  {/* Color Swatch Previews */}
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="size-5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: palette.previewBg }}
                          title="Background"
                        />
                        <div
                          className="size-5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: palette.previewCard }}
                          title="Card Surface"
                        />
                        <div
                          className="size-5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: palette.previewPrimary }}
                          title="Primary Accent"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {palette.previewPrimary}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      className="h-7 text-xs px-3 rounded-lg"
                    >
                      {isSelected ? 'Selected' : 'Apply Theme'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
