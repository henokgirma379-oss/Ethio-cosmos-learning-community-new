/**
 * Unified Design System for Ethio-Cosmos Learning Platform
 * Centralizes all design tokens, component styles, and layout patterns
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Backgrounds
  background: {
    primary: '#050a1a',      // space-black
    secondary: '#0a1628',    // deep-navy
    tertiary: '#0d1f3c',     // navy
  },

  // Accent Colors
  accent: {
    teal: '#00c8c8',
    gold: '#f5c542',
    purple: '#7c5cbf',
  },

  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: '#c8d0e0',
    muted: '#94a3b8',
    light: '#e2e8f0',
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Borders & Dividers
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
}

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  families: {
    display: '"Orbitron", sans-serif',
    body: '"Exo 2", sans-serif',
  },

  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
}

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '5rem',    // 80px
}

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const borderRadius = {
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  '3xl': '1.875rem', // 30px (custom for cards)
  full: '9999px',
}

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(0, 200, 200, 0.3)',
  'glow-gold': '0 0 20px rgba(245, 197, 66, 0.2)',
}

// ============================================================================
// COMPONENT STYLES (Tailwind Class Strings)
// ============================================================================

export const components = {
  // BUTTONS
  button: {
    base: 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg',
    
    primary: 'bg-teal text-slate-950 hover:scale-105 hover:brightness-110 active:scale-95',
    secondary: 'border border-white/20 bg-white/5 text-white hover:border-teal/40 hover:text-teal active:bg-white/10',
    tertiary: 'bg-transparent text-teal hover:text-white active:opacity-75',
    
    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
  },

  // CARDS
  card: {
    base: 'rounded-3xl border bg-deep-navy/85 shadow-lg shadow-black/20 transition-all duration-300',
    light: 'rounded-3xl border border-slate-200 bg-white shadow-xl shadow-black/10 transition-all duration-300',
    
    borders: {
      default: 'border-white/10',
      teal: 'border-teal/20',
      gold: 'border-gold/20',
      accent: 'border-white/20',
    },

    hover: 'hover:border-teal/30 hover:shadow-glow',
  },

  // BADGES / PILLS
  badge: {
    base: 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
    
    beginner: 'bg-teal/10 text-teal border-teal/30',
    intermediate: 'bg-gold/10 text-gold border-gold/30',
    advanced: 'bg-cosmos-purple/10 text-cosmos-purple border-cosmos-purple/30',
  },

  // INPUTS & FORMS
  input: {
    base: 'w-full rounded-lg border bg-navy/50 px-4 py-3 text-white placeholder-slate-400 transition-colors duration-200 border-white/10 focus:border-teal/50 focus:outline-none',
  },

  // SECTIONS
  section: {
    hero: 'min-h-[70vh] flex items-center',
    container: 'mx-auto max-w-7xl px-6',
    padded: 'py-12 md:py-16 lg:py-20',
  },

  // PAGE SHELL
  pageShell: {
    wrapper: 'relative min-h-screen overflow-hidden bg-space-black text-white',
    main: 'relative z-10 animate-fadeIn',
  },
}

// ============================================================================
// LAYOUT PATTERNS
// ============================================================================

export const layouts = {
  // Page background gradients
  gradients: {
    teal: 'bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.18),_transparent_35%),linear-gradient(180deg,_rgba(5,10,26,0.75),_rgba(5,10,26,0.92))]',
    gold: 'bg-[radial-gradient(circle_at_top,_rgba(245,197,66,0.14),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.78),_rgba(5,10,26,0.95))]',
    default: 'bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]',
  },

  // Grid patterns
  grid: {
    twoCol: 'grid gap-6 md:grid-cols-2',
    threeCol: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
    fourCol: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  },
}

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================

export const animations = {
  fadeIn: 'animate-fadeIn',
  transitions: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
}

// ============================================================================
// DIFFICULTY LEVEL STYLES
// ============================================================================

export const difficultyStyles = {
  Beginner: 'bg-teal/10 text-teal border-teal/30',
  Intermediate: 'bg-gold/10 text-gold border-gold/30',
  Advanced: 'bg-cosmos-purple/10 text-cosmos-purple border-cosmos-purple/30',
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combine multiple Tailwind class strings safely
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get difficulty badge styles
 */
export function getDifficultyStyles(difficulty: keyof typeof difficultyStyles): string {
  return difficultyStyles[difficulty]
}
