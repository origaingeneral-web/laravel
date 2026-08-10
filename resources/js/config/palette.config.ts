export interface ColorPalette {
  id: string;
  name: string;
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
    id: 'royal-velvet',
    name: 'Royal Purple',
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
    id: 'sunset-amber',
    name: 'Sunset Bronze',
    description: 'Warm espresso dark theme with glowing amber primary accents.',
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
    id: 'cyberpunk-rose',
    name: 'Neon Crimson',
    description: 'High contrast midnight rose theme with vivid crimson accents.',
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
    .dark {
      --background: ${palette.colors.background} !important;
      --card: ${palette.colors.card} !important;
      --popover: ${palette.colors.popover} !important;
      --border: ${palette.colors.border} !important;
      --input: ${palette.colors.border} !important;
      --secondary: ${palette.colors.popover} !important;
      --accent: ${palette.colors.popover} !important;
      --primary: ${palette.colors.primary} !important;
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
