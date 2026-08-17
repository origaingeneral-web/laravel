export interface ColorPalette {
  id: string;
  name: string;
  category: 'Modern' | 'Cyber' | 'Nature' | 'Warm' | 'Vibrant';
  description: string;
  badgeColor: string;
  previewBg: string;
  previewCard: string;
  previewPrimary: string;
  colors: {
    background: string;
    card: string;
    popover: string;
    border: string;
    primary: string;
    sidebar: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
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
    id: 'arctic-frost',
    name: 'Arctic Sky',
    category: 'Modern',
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
];

export function applyPalette(paletteId: string): void {
  if (typeof window === 'undefined') return;

  const palette = COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];
  localStorage.setItem('theme_palette', palette.id);

  let styleTag = document.getElementById('custom-palette-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-palette-style';
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    :root {
      --primary: ${palette.colors.primary} !important;
      --ring: ${palette.colors.primary} !important;
    }
    .dark {
      --background: ${palette.colors.background} !important;
      --card: ${palette.colors.card} !important;
      --popover: ${palette.colors.popover} !important;
      --border: ${palette.colors.border} !important;
      --input: ${palette.colors.border} !important;
      --secondary: ${palette.colors.popover} !important;
      --accent: ${palette.colors.popover} !important;
      --primary: ${palette.colors.primary} !important;
      --ring: ${palette.colors.primary} !important;
    }
    html.dark {
      background-color: ${palette.colors.background} !important;
    }
    .dark .sidebar {
      background-color: ${palette.colors.sidebar} !important;
    }
  `;
}

export function initPalette(): void {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('theme_palette');
  applyPalette(saved || 'midnight-slate');
}
