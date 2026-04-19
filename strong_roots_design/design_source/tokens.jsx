// Strong Roots — Design Tokens
// Three aesthetic directions, all earthy/grounded but distinct in mood.
// Each palette has light + dark, same semantic roles.

const PALETTES = {
  heartwood: {
    name: 'Heartwood',
    tag: 'Editorial · Warm Clay',
    description: 'Terracotta + espresso. Magazine-editorial, warm and intimate. For portraits and long-form story.',
    light: {
      bg:        '#f5efe6',
      surface:   '#fbf7f0',
      surfaceAlt:'#eee4d3',
      ink:       '#2a1d14',
      inkSoft:   '#5a4636',
      inkMuted:  '#8a7766',
      line:      '#d9cab3',
      lineSoft:  '#e8dcc6',
      accent:    '#a84a28', // terracotta
      accentInk: '#fbf7f0',
      accentSoft:'#d98b6b',
      signal:    '#6b4423', // deep espresso
    },
    dark: {
      bg:        '#1a110a',
      surface:   '#231710',
      surfaceAlt:'#2d2018',
      ink:       '#f2e7d6',
      inkSoft:   '#c9b398',
      inkMuted:  '#8a7766',
      line:      '#3d2d22',
      lineSoft:  '#2d2018',
      accent:    '#d98b6b',
      accentInk: '#1a110a',
      accentSoft:'#a84a28',
      signal:    '#e8c49a',
    },
  },
  understory: {
    name: 'Understory',
    tag: 'Athletic · Forest Floor',
    description: 'Deep forest + moss + bone. Disciplined, outdoor, performance-minded. For data and training programs.',
    light: {
      bg:        '#f3f1ea',
      surface:   '#f9f8f2',
      surfaceAlt:'#e6e3d6',
      ink:       '#14251a',
      inkSoft:   '#3b4f3e',
      inkMuted:  '#6e7a66',
      line:      '#d0d2bf',
      lineSoft:  '#e2e3d3',
      accent:    '#2e4a2b', // forest
      accentInk: '#f3f1ea',
      accentSoft:'#6b8a5a',
      signal:    '#8a9a5b', // moss
    },
    dark: {
      bg:        '#0d1410',
      surface:   '#141c16',
      surfaceAlt:'#1c2820',
      ink:       '#e8ebd9',
      inkSoft:   '#b4bda0',
      inkMuted:  '#7a8570',
      line:      '#243028',
      lineSoft:  '#1c2820',
      accent:    '#8a9a5b',
      accentInk: '#0d1410',
      accentSoft:'#2e4a2b',
      signal:    '#c6d18a',
    },
  },
  loam: {
    name: 'Loam',
    tag: 'Quiet Luxury · Sand & Stone',
    description: 'Oat, sand, charcoal. Grounded and restrained. For premium product and consulting tiers.',
    light: {
      bg:        '#ebe6dc',
      surface:   '#f4efe4',
      surfaceAlt:'#dcd5c5',
      ink:       '#1c1a16',
      inkSoft:   '#4a463d',
      inkMuted:  '#867f70',
      line:      '#c9c1ad',
      lineSoft:  '#dcd5c5',
      accent:    '#1c1a16', // near-black itself is the accent
      accentInk: '#ebe6dc',
      accentSoft:'#867f70',
      signal:    '#b8955a', // aged brass
    },
    dark: {
      bg:        '#17150f',
      surface:   '#1f1c14',
      surfaceAlt:'#29251c',
      ink:       '#e6ddc8',
      inkSoft:   '#b3a88e',
      inkMuted:  '#857b67',
      line:      '#2d2920',
      lineSoft:  '#29251c',
      accent:    '#e6ddc8',
      accentInk: '#17150f',
      accentSoft:'#857b67',
      signal:    '#c9a66b',
    },
  },
};

// Typography pairings. Each direction picks a distinct character.
const TYPE_PAIRINGS = {
  heartwood: {
    display: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
    displayWeight: 500,
    displayStyle: 'italic',
    body: '"Fraunces", Georgia, serif',
    bodyWeight: 400,
    mono: '"JetBrains Mono", ui-monospace, monospace',
    label: '"Fraunces", Georgia, serif', // for small caps / labels
    labelTracking: '0.18em',
  },
  understory: {
    display: '"Archivo Narrow", "Oswald", "Helvetica Neue", sans-serif',
    displayWeight: 700,
    displayStyle: 'normal',
    body: '"Inter Tight", "Helvetica Neue", sans-serif',
    bodyWeight: 400,
    mono: '"JetBrains Mono", ui-monospace, monospace',
    label: '"Archivo Narrow", "Helvetica Neue", sans-serif',
    labelTracking: '0.22em',
  },
  loam: {
    display: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
    displayWeight: 400,
    displayStyle: 'normal',
    body: '"Manrope", "Helvetica Neue", sans-serif',
    bodyWeight: 400,
    mono: '"JetBrains Mono", ui-monospace, monospace',
    label: '"Manrope", "Helvetica Neue", sans-serif',
    labelTracking: '0.28em',
  },
};

// Spacing / radius / shadow scales — shared across directions,
// just reinterpreted with palette colors.
const SCALE = {
  space:  [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  radius: { none: 0, xs: 2, sm: 4, md: 6, lg: 10, xl: 16, pill: 999 },
  type:   {
    // mobile-first sizes in px
    micro: 11, caption: 12, small: 13, body: 15, lead: 17,
    h6: 18, h5: 22, h4: 28, h3: 36, h2: 48, h1: 64, display: 88,
  },
  lineHeight: { tight: 1.05, snug: 1.2, normal: 1.5, relaxed: 1.65 },
  tracking: { tight: '-0.02em', normal: '0', wide: '0.08em', wider: '0.18em' },
};

// Copy tone variants — quiet vs bold. Used in hero, tweakable.
const COPY = {
  quiet: {
    kicker: 'A training practice',
    headline: 'Strength for the\nlife you actually live.',
    sub: 'Programs, consulting, and nutrition built around one premise: what you do on Monday should still be working in a decade.',
    cta: 'Begin with a call',
    secondary: 'Read the approach',
  },
  bold: {
    kicker: 'No gimmicks. No fads.',
    headline: 'Train like it\nmatters.',
    sub: 'Custom programming, 1:1 coaching, and nutrition that actually moves the needle. Built by Ashlyn for people who are done guessing.',
    cta: 'Start training',
    secondary: 'See the plans',
  },
};

// Density presets — editorial (generous) vs compact (dense)
const DENSITY = {
  editorial: { unit: 1.0, radius: 1.0, type: 1.0 },
  compact:   { unit: 0.72, radius: 0.8, type: 0.92 },
};

Object.assign(window, { PALETTES, TYPE_PAIRINGS, SCALE, COPY, DENSITY });
