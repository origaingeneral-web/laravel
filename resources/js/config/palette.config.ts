export interface PaletteColors {
  background: string;
  card: string;
  popover: string;
  border: string;
  primary: string;
  sidebar: string;
  primaryForeground?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  category: 'Modern' | 'Cyber' | 'Nature' | 'Warm' | 'Vibrant' | 'Light';
  description: string;
  badgeColor: string;
  previewBg: string;
  previewCard: string;
  previewPrimary: string;
  colors: PaletteColors;
}

export interface DualModeCustomPalette {
  id: 'custom';
  name: string;
  category?: string;
  description?: string;
  dark: PaletteColors;
  light: PaletteColors;
}

export interface StudioTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  dark: PaletteColors;
  light: PaletteColors;
}

/**
 * Calculates high contrast text color (dark vs white) based on hex color luminance
 */
export function getContrastForeground(hexColor: string): string {
  if (!hexColor || !hexColor.startsWith('#')) return '#ffffff';
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  // Perceived brightness formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 170 ? '#09090b' : '#ffffff';
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: 'tpl-midnight-arctic',
    name: 'Midnight & Arctic Pro',
    description: 'Electric blue accent with midnight navy dark mode and clean daylight light mode.',
    badge: 'Popular',
    dark: {
      background: '#0f1423',
      card: '#161f30',
      popover: '#1f2b44',
      border: '#24324f',
      primary: '#2563eb',
      sidebar: '#111522',
    },
    light: {
      background: '#f8fafc',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#e2e8f0',
      primary: '#2563eb',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-obsidian-indigo',
    name: 'Obsidian & Slate Indigo',
    description: 'Vibrant indigo accents with matte carbon dark and smooth cloud light.',
    badge: 'Modern',
    dark: {
      background: '#090a0f',
      card: '#12131a',
      popover: '#1b1c26',
      border: '#262836',
      primary: '#6366f1',
      sidebar: '#0d0e14',
    },
    light: {
      background: '#f8f9fc',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#e0e4f0',
      primary: '#4f46e5',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-emerald-mint',
    name: 'Emerald Forest & Mint',
    description: 'Fresh botanical green accents across deep forest dark and crisp mint light.',
    badge: 'Nature',
    dark: {
      background: '#07120e',
      card: '#0e1f18',
      popover: '#162c23',
      border: '#1f3d31',
      primary: '#10b981',
      sidebar: '#091611',
    },
    light: {
      background: '#f0fdf4',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#dcfce7',
      primary: '#059669',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-oceanic-cyan',
    name: 'Oceanic Teal & Sky',
    description: 'Luminous cyan highlights on abyssal oceanic dark and glacial breeze light.',
    badge: 'Cyber',
    dark: {
      background: '#061318',
      card: '#0c1e26',
      popover: '#132c38',
      border: '#1b3d4f',
      primary: '#06b6d4',
      sidebar: '#08171e',
    },
    light: {
      background: '#f0fdfa',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#ccfbf1',
      primary: '#0891b2',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-sunset-amber',
    name: 'Sunset Bronze & Honey',
    description: 'Warm glowing amber on rich espresso dark and ivory sandstone light.',
    badge: 'Warm',
    dark: {
      background: '#140e0b',
      card: '#1f1612',
      popover: '#2b1f1a',
      border: '#3d2c25',
      primary: '#f59e0b',
      sidebar: '#17100d',
    },
    light: {
      background: '#fcfbf9',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#f3eee4',
      primary: '#d97706',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-cyberpunk-rose',
    name: 'Neon Crimson & Blush',
    description: 'Vivid crimson & ruby highlights on obsidian black and rose porcelain light.',
    badge: 'Vibrant',
    dark: {
      background: '#14090d',
      card: '#1f0f16',
      popover: '#2b161e',
      border: '#3d1f2b',
      primary: '#f43f5e',
      sidebar: '#170b10',
    },
    light: {
      background: '#fff1f2',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#ffe4e6',
      primary: '#e11d48',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-royal-purple',
    name: 'Royal Velvet & Lilac',
    description: 'Regal violet tones with dark amethyst velvet and soft lavender daylight.',
    badge: 'Royal',
    dark: {
      background: '#110a1c',
      card: '#1b122b',
      popover: '#271b3d',
      border: '#352652',
      primary: '#8b5cf6',
      sidebar: '#140d21',
    },
    light: {
      background: '#faf5ff',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#f3e8ff',
      primary: '#7c3aed',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'tpl-oled-monochrome',
    name: 'Pure OLED & Titanium',
    description: 'True zero-light black dark mode and ultra-clean high clarity white light mode.',
    badge: 'Minimal',
    dark: {
      background: '#000000',
      card: '#0c0c0e',
      popover: '#16161a',
      border: '#24242c',
      primary: '#38bdf8',
      sidebar: '#050506',
    },
    light: {
      background: '#ffffff',
      card: '#f8fafc',
      popover: '#ffffff',
      border: '#e2e8f0',
      primary: '#0284c7',
      sidebar: '#f8fafc',
    },
  },
];

export const COLOR_PALETTES: ColorPalette[] = [
  // ================= MODERN DARK =================
  {
    id: 'midnight-slate',
    name: 'Midnight Navy',
    category: 'Modern',
    description: 'Deep navy-slate dark theme with electric blue primary accents.',
    badgeColor: 'bg-blue-500',
    previewBg: '#0f1423',
    previewCard: '#161f30',
    previewPrimary: '#2563eb',
    colors: {
      background: '#0f1423',
      card: '#161f30',
      popover: '#1f2b44',
      border: '#24324f',
      primary: '#2563eb',
      sidebar: '#111522',
    },
  },
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian',
    category: 'Modern',
    description: 'Matte carbon graphite theme with vibrant indigo accents.',
    badgeColor: 'bg-indigo-500',
    previewBg: '#090a0f',
    previewCard: '#12131a',
    previewPrimary: '#6366f1',
    colors: {
      background: '#090a0f',
      card: '#12131a',
      popover: '#1b1c26',
      border: '#262836',
      primary: '#6366f1',
      sidebar: '#0d0e14',
    },
  },
  {
    id: 'titanium-mono',
    name: 'Titanium Slate',
    category: 'Modern',
    description: 'Monochromatic titanium dark theme with clean platinum silver accents.',
    badgeColor: 'bg-zinc-400',
    previewBg: '#09090b',
    previewCard: '#141417',
    previewPrimary: '#e4e4e7',
    colors: {
      background: '#09090b',
      card: '#141417',
      popover: '#1c1c21',
      border: '#27272e',
      primary: '#e4e4e7',
      sidebar: '#0e0e11',
    },
  },
  {
    id: 'oled-pitch-black',
    name: 'OLED Pitch Black',
    category: 'Modern',
    description: 'True zero-light black theme with vivid electric blue highlights.',
    badgeColor: 'bg-sky-500',
    previewBg: '#000000',
    previewCard: '#0a0a0c',
    previewPrimary: '#38bdf8',
    colors: {
      background: '#000000',
      card: '#0a0a0c',
      popover: '#141418',
      border: '#202026',
      primary: '#38bdf8',
      sidebar: '#040405',
    },
  },
  {
    id: 'deep-space-nebula',
    name: 'Nebula Purple',
    category: 'Modern',
    description: 'Cosmic twilight dark theme with luminous periwinkle indigo.',
    badgeColor: 'bg-indigo-400',
    previewBg: '#080b14',
    previewCard: '#101626',
    previewPrimary: '#818cf8',
    colors: {
      background: '#080b14',
      card: '#101626',
      popover: '#172038',
      border: '#233054',
      primary: '#818cf8',
      sidebar: '#0b0f1c',
    },
  },
  {
    id: 'graphite-carbon',
    name: 'Graphite Carbon',
    category: 'Modern',
    description: 'Industrial charcoal gray surface with cyan laser accents.',
    badgeColor: 'bg-cyan-400',
    previewBg: '#111317',
    previewCard: '#181b22',
    previewPrimary: '#22d3ee',
    colors: {
      background: '#111317',
      card: '#181b22',
      popover: '#222731',
      border: '#303745',
      primary: '#22d3ee',
      sidebar: '#14171d',
    },
  },

  // ================= CYBER & NEON =================
  {
    id: 'oceanic-cyan',
    name: 'Oceanic Teal',
    category: 'Cyber',
    description: 'Abyssal deep teal theme with luminous cyan & turquoise accents.',
    badgeColor: 'bg-cyan-500',
    previewBg: '#061318',
    previewCard: '#0c1e26',
    previewPrimary: '#06b6d4',
    colors: {
      background: '#061318',
      card: '#0c1e26',
      popover: '#132c38',
      border: '#1b3d4f',
      primary: '#06b6d4',
      sidebar: '#08171e',
    },
  },
  {
    id: 'cyberpunk-rose',
    name: 'Neon Crimson',
    category: 'Cyber',
    description: 'High contrast midnight rose theme with vivid crimson & ruby accents.',
    badgeColor: 'bg-rose-500',
    previewBg: '#14090d',
    previewCard: '#1f0f16',
    previewPrimary: '#f43f5e',
    colors: {
      background: '#14090d',
      card: '#1f0f16',
      popover: '#2b161e',
      border: '#3d1f2b',
      primary: '#f43f5e',
      sidebar: '#170b10',
    },
  },
  {
    id: 'cyber-lime',
    name: 'Cyber Lime',
    category: 'Cyber',
    description: 'Dark anthracite coal theme with electric neon lime accents.',
    badgeColor: 'bg-lime-500',
    previewBg: '#0d1209',
    previewCard: '#141d0e',
    previewPrimary: '#84cc16',
    colors: {
      background: '#0d1209',
      card: '#141d0e',
      popover: '#1d2a14',
      border: '#2c3d1f',
      primary: '#84cc16',
      sidebar: '#10160b',
    },
  },
  {
    id: 'matrix-neon-green',
    name: 'Matrix Neon',
    category: 'Cyber',
    description: 'Futuristic hacker green accents on pitch black carbon.',
    badgeColor: 'bg-emerald-400',
    previewBg: '#050c07',
    previewCard: '#0a170e',
    previewPrimary: '#10b981',
    colors: {
      background: '#050c07',
      card: '#0a170e',
      popover: '#102417',
      border: '#193824',
      primary: '#10b981',
      sidebar: '#07100a',
    },
  },
  {
    id: 'synthwave-sunset',
    name: 'Synthwave Glow',
    category: 'Cyber',
    description: 'Retro 80s arcade neon pink with dark midnight violet.',
    badgeColor: 'bg-pink-500',
    previewBg: '#130819',
    previewCard: '#1e0f26',
    previewPrimary: '#ec4899',
    colors: {
      background: '#130819',
      card: '#1e0f26',
      popover: '#2b1537',
      border: '#3e1e4f',
      primary: '#ec4899',
      sidebar: '#170a1e',
    },
  },
  {
    id: 'electric-ultraviolet',
    name: 'Ultraviolet',
    category: 'Cyber',
    description: 'Deep abyss with high-voltage violet laser reflections.',
    badgeColor: 'bg-purple-400',
    previewBg: '#0b0716',
    previewCard: '#140e24',
    previewPrimary: '#a855f7',
    colors: {
      background: '#0b0716',
      card: '#140e24',
      popover: '#1e1536',
      border: '#2c1e4f',
      primary: '#a855f7',
      sidebar: '#0e091b',
    },
  },

  // ================= NATURE & EARTH =================
  {
    id: 'emerald-forest',
    name: 'Emerald Tech',
    category: 'Nature',
    description: 'Deep dark emerald theme with mint green primary accents.',
    badgeColor: 'bg-emerald-500',
    previewBg: '#07120e',
    previewCard: '#0e1f18',
    previewPrimary: '#10b981',
    colors: {
      background: '#07120e',
      card: '#0e1f18',
      popover: '#162c23',
      border: '#1f3d31',
      primary: '#10b981',
      sidebar: '#091611',
    },
  },
  {
    id: 'forest-pine',
    name: 'Forest Pine',
    category: 'Nature',
    description: 'Deep woodland pine theme with crisp leaf green accents.',
    badgeColor: 'bg-green-500',
    previewBg: '#08130a',
    previewCard: '#0f2012',
    previewPrimary: '#22c55e',
    colors: {
      background: '#08130a',
      card: '#0f2012',
      popover: '#162e1a',
      border: '#214227',
      primary: '#22c55e',
      sidebar: '#0b180d',
    },
  },
  {
    id: 'nordic-moss',
    name: 'Nordic Moss',
    category: 'Nature',
    description: 'Earthy Scandinavian moss dark theme with seafoam sage accents.',
    badgeColor: 'bg-teal-400',
    previewBg: '#091412',
    previewCard: '#11221f',
    previewPrimary: '#2dd4bf',
    colors: {
      background: '#091412',
      card: '#11221f',
      popover: '#18302c',
      border: '#23443e',
      primary: '#2dd4bf',
      sidebar: '#0c1a17',
    },
  },
  {
    id: 'abyssal-ocean',
    name: 'Abyssal Ocean',
    category: 'Nature',
    description: 'Deep oceanic blue trench with bright sapphire accents.',
    badgeColor: 'bg-blue-600',
    previewBg: '#060d17',
    previewCard: '#0d1828',
    previewPrimary: '#0284c7',
    colors: {
      background: '#060d17',
      card: '#0d1828',
      popover: '#13243c',
      border: '#1b3354',
      primary: '#0284c7',
      sidebar: '#08111e',
    },
  },
  {
    id: 'terracotta-earth',
    name: 'Terracotta Earth',
    category: 'Nature',
    description: 'Rich clay and volcanic earth tones with warm russet accents.',
    badgeColor: 'bg-orange-600',
    previewBg: '#150c09',
    previewCard: '#22140f',
    previewPrimary: '#ea580c',
    colors: {
      background: '#150c09',
      card: '#22140f',
      popover: '#301c16',
      border: '#452920',
      primary: '#ea580c',
      sidebar: '#190e0b',
    },
  },

  // ================= WARM & SUNSET =================
  {
    id: 'sunset-amber',
    name: 'Sunset Bronze',
    category: 'Warm',
    description: 'Warm espresso dark theme with glowing amber & gold primary accents.',
    badgeColor: 'bg-amber-500',
    previewBg: '#140e0b',
    previewCard: '#1f1612',
    previewPrimary: '#f59e0b',
    colors: {
      background: '#140e0b',
      card: '#1f1612',
      popover: '#2b1f1a',
      border: '#3d2c25',
      primary: '#f59e0b',
      sidebar: '#17100d',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Tangerine',
    category: 'Warm',
    description: 'Warm obsidian theme with energetic electric orange accents.',
    badgeColor: 'bg-orange-500',
    previewBg: '#140d07',
    previewCard: '#1f150c',
    previewPrimary: '#f97316',
    colors: {
      background: '#140d07',
      card: '#1f150c',
      popover: '#2d1e12',
      border: '#422c1b',
      primary: '#f97316',
      sidebar: '#181008',
    },
  },
  {
    id: 'scarlet-ruby',
    name: 'Scarlet Flame',
    category: 'Warm',
    description: 'Deep Bordeaux velvet black theme with bold fiery red accents.',
    badgeColor: 'bg-red-500',
    previewBg: '#150808',
    previewCard: '#210d0d',
    previewPrimary: '#ef4444',
    colors: {
      background: '#150808',
      card: '#210d0d',
      popover: '#2f1313',
      border: '#451c1c',
      primary: '#ef4444',
      sidebar: '#190a0a',
    },
  },
  {
    id: 'cherry-bordeaux',
    name: 'Cherry Bordeaux',
    category: 'Warm',
    description: 'Opulent dark ruby wine with sweet cherry rose highlights.',
    badgeColor: 'bg-rose-400',
    previewBg: '#16080d',
    previewCard: '#240d16',
    previewPrimary: '#fb7185',
    colors: {
      background: '#16080d',
      card: '#240d16',
      popover: '#331320',
      border: '#471a2c',
      primary: '#fb7185',
      sidebar: '#1a090f',
    },
  },
  {
    id: 'coffee-espresso',
    name: 'Mocha Espresso',
    category: 'Warm',
    description: 'Rich dark roast coffee with golden caramel foam accents.',
    badgeColor: 'bg-amber-600',
    previewBg: '#120d0a',
    previewCard: '#1c1510',
    previewPrimary: '#d97706',
    colors: {
      background: '#120d0a',
      card: '#1c1510',
      popover: '#281e17',
      border: '#382a20',
      primary: '#d97706',
      sidebar: '#150f0c',
    },
  },

  // ================= VIBRANT =================
  {
    id: 'royal-velvet',
    name: 'Royal Purple',
    category: 'Vibrant',
    description: 'Deep royal purple theme with vibrant violet primary accents.',
    badgeColor: 'bg-purple-500',
    previewBg: '#110a1c',
    previewCard: '#1b122b',
    previewPrimary: '#8b5cf6',
    colors: {
      background: '#110a1c',
      card: '#1b122b',
      popover: '#271b3d',
      border: '#352652',
      primary: '#8b5cf6',
      sidebar: '#140d21',
    },
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Fuchsia',
    category: 'Vibrant',
    description: 'Dark magenta night theme with vibrant fuchsia blossom accents.',
    badgeColor: 'bg-fuchsia-500',
    previewBg: '#140815',
    previewCard: '#200f22',
    previewPrimary: '#d946ef',
    colors: {
      background: '#140815',
      card: '#200f22',
      popover: '#2d1630',
      border: '#422047',
      primary: '#d946ef',
      sidebar: '#170a19',
    },
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Sky',
    category: 'Vibrant',
    description: 'Nordic glacial slate with vibrant sky blue accents.',
    badgeColor: 'bg-sky-500',
    previewBg: '#0a121c',
    previewCard: '#111d2e',
    previewPrimary: '#0ea5e9',
    colors: {
      background: '#0a121c',
      card: '#111d2e',
      popover: '#192b42',
      border: '#223a59',
      primary: '#0ea5e9',
      sidebar: '#0d1624',
    },
  },

  // ================= LIGHT & CLEAN =================
  {
    id: 'pure-snow-light',
    name: 'Clean Arctic Light',
    category: 'Light',
    description: 'Crisp, high-clarity daylight theme with vibrant cobalt blue accents.',
    badgeColor: 'bg-blue-600',
    previewBg: '#f8fafc',
    previewCard: '#ffffff',
    previewPrimary: '#2563eb',
    colors: {
      background: '#f8fafc',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#e2e8f0',
      primary: '#2563eb',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'soft-lavender-light',
    name: 'Soft Lavender Light',
    category: 'Light',
    description: 'Gentle pastel lilac surface with royal amethyst accents.',
    badgeColor: 'bg-purple-600',
    previewBg: '#faf5ff',
    previewCard: '#ffffff',
    previewPrimary: '#9333ea',
    colors: {
      background: '#faf5ff',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#f3e8ff',
      primary: '#9333ea',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'mint-breeze-light',
    name: 'Mint Breeze Light',
    category: 'Light',
    description: 'Fresh crisp morning mint with emerald green accents.',
    badgeColor: 'bg-emerald-600',
    previewBg: '#f0fdf4',
    previewCard: '#ffffff',
    previewPrimary: '#059669',
    colors: {
      background: '#f0fdf4',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#dcfce7',
      primary: '#059669',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'rose-quartz-light',
    name: 'Rose Quartz Light',
    category: 'Light',
    description: 'Subtle blush porcelain surface with vibrant rose accents.',
    badgeColor: 'bg-rose-500',
    previewBg: '#fff1f2',
    previewCard: '#ffffff',
    previewPrimary: '#e11d48',
    colors: {
      background: '#fff1f2',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#ffe4e6',
      primary: '#e11d48',
      sidebar: '#ffffff',
    },
  },
  {
    id: 'sandstone-minimal-light',
    name: 'Sandstone Minimal',
    category: 'Light',
    description: 'Warm natural ivory cardstock with warm honey gold accents.',
    badgeColor: 'bg-amber-600',
    previewBg: '#fcfbf9',
    previewCard: '#ffffff',
    previewPrimary: '#d97706',
    colors: {
      background: '#fcfbf9',
      card: '#ffffff',
      popover: '#ffffff',
      border: '#f3eee4',
      primary: '#d97706',
      sidebar: '#ffffff',
    },
  },
];

/**
 * Applies a theme palette (preset ID or custom dual-mode object) dynamically into document CSS variables
 */
export function applyPalette(paletteOrId: string | ColorPalette | DualModeCustomPalette): void {
  if (typeof window === 'undefined') return;

  let lightColors: PaletteColors;
  let darkColors: PaletteColors;

  if (typeof paletteOrId === 'object' && paletteOrId !== null) {
    if ('dark' in paletteOrId && 'light' in paletteOrId) {
      // Dual-mode custom palette
      darkColors = paletteOrId.dark;
      lightColors = paletteOrId.light;
      localStorage.setItem('theme_palette', 'custom');
      localStorage.setItem('custom_theme_palette', JSON.stringify(paletteOrId));
    } else {
      // Single color palette object
      const p = paletteOrId as ColorPalette;
      if (p.category === 'Light') {
        lightColors = p.colors;
        darkColors = {
          background: '#0f1423',
          card: '#161f30',
          popover: '#1f2b44',
          border: '#24324f',
          primary: p.colors.primary,
          sidebar: '#111522',
        };
      } else {
        darkColors = p.colors;
        lightColors = {
          background: '#f8fafc',
          card: '#ffffff',
          popover: '#ffffff',
          border: '#e2e8f0',
          primary: p.colors.primary,
          sidebar: '#ffffff',
        };
      }
      localStorage.setItem('theme_palette', p.id);
    }
  } else if (paletteOrId === 'custom') {
    const custom = getSavedCustomPalette();
    if (custom && 'dark' in custom && 'light' in custom) {
      darkColors = custom.dark;
      lightColors = custom.light;
    } else if (custom && 'colors' in custom) {
      darkColors = (custom as ColorPalette).colors;
      lightColors = {
        background: '#f8fafc',
        card: '#ffffff',
        popover: '#ffffff',
        border: '#e2e8f0',
        primary: darkColors.primary,
        sidebar: '#ffffff',
      };
    } else {
      const def = STUDIO_TEMPLATES[0];
      darkColors = def.dark;
      lightColors = def.light;
    }
    localStorage.setItem('theme_palette', 'custom');
  } else {
    const p = COLOR_PALETTES.find((cp) => cp.id === paletteOrId) || COLOR_PALETTES[0];
    if (p.category === 'Light') {
      lightColors = p.colors;
      darkColors = {
        background: '#0f1423',
        card: '#161f30',
        popover: '#1f2b44',
        border: '#24324f',
        primary: p.colors.primary,
        sidebar: '#111522',
      };
    } else {
      darkColors = p.colors;
      lightColors = {
        background: '#f8fafc',
        card: '#ffffff',
        popover: '#ffffff',
        border: '#e2e8f0',
        primary: p.colors.primary,
        sidebar: '#ffffff',
      };
    }
    localStorage.setItem('theme_palette', p.id);
  }

  let styleTag = document.getElementById('custom-palette-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-palette-style';
    document.head.appendChild(styleTag);
  }

  const lightPrimaryFg = lightColors.primaryForeground || getContrastForeground(lightColors.primary);
  const darkPrimaryFg = darkColors.primaryForeground || getContrastForeground(darkColors.primary);

  styleTag.innerHTML = `
    :root {
      --background: ${lightColors.background} !important;
      --card: ${lightColors.card} !important;
      --popover: ${lightColors.popover} !important;
      --border: ${lightColors.border} !important;
      --input: ${lightColors.border} !important;
      --secondary: ${lightColors.popover} !important;
      --accent: ${lightColors.popover} !important;
      --primary: ${lightColors.primary} !important;
      --primary-foreground: ${lightPrimaryFg} !important;
      --ring: ${lightColors.primary} !important;
    }
    html:not(.dark) {
      background-color: ${lightColors.background} !important;
    }
    :not(.dark) .sidebar,
    .sidebar:not(.dark) {
      background-color: ${lightColors.sidebar} !important;
    }
    :not(.dark) .header,
    .header:not(.dark),
    :not(.dark) .footer,
    .footer:not(.dark) {
      background-color: ${lightColors.card} !important;
    }

    .dark {
      --background: ${darkColors.background} !important;
      --card: ${darkColors.card} !important;
      --popover: ${darkColors.popover} !important;
      --border: ${darkColors.border} !important;
      --input: ${darkColors.border} !important;
      --secondary: ${darkColors.popover} !important;
      --accent: ${darkColors.popover} !important;
      --primary: ${darkColors.primary} !important;
      --primary-foreground: ${darkPrimaryFg} !important;
      --ring: ${darkColors.primary} !important;
    }
    html.dark {
      background-color: ${darkColors.background} !important;
    }
    .dark .sidebar,
    .sidebar.dark {
      background-color: ${darkColors.sidebar} !important;
    }
    .dark .header,
    .header.dark,
    .dark .footer,
    .footer.dark {
      background-color: ${darkColors.card} !important;
    }
  `;
}

/**
 * Retrieves the user's saved custom theme from localStorage
 */
export function getSavedCustomPalette(): DualModeCustomPalette | ColorPalette | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('custom_theme_palette');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves a user-created custom dual-mode theme and applies it
 */
export function saveAndApplyCustomPalette(palette: DualModeCustomPalette): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('custom_theme_palette', JSON.stringify(palette));
  applyPalette(palette);
}

/**
 * Initializes the saved palette on page load
 */
export function initPalette(): void {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('theme_palette') || 'midnight-slate';
  if (saved === 'custom') {
    const custom = getSavedCustomPalette();
    if (custom) {
      applyPalette(custom);
    } else {
      applyPalette(STUDIO_TEMPLATES[0]);
    }
  } else {
    applyPalette(saved);
  }
}
