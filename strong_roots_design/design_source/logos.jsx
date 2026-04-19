// Logo system — reductive literal marks for Strong Roots.
// Theme: tree / root / seed / sprout, executed as geometric primitives.
// Each mark is a pure SVG function that takes (size, color, bgColor).

const LOGO_MARKS = {
  // 01 — The Horizon Seed. A single seed sitting on a horizon line.
  // A circle cradled by a ground-line. Most minimal.
  seed: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <line x1="4" y1="34" x2="44" y2="34" stroke={color} strokeWidth="1.5" />
      <circle cx="24" cy="28" r="6" fill={color} />
    </svg>
  ),

  // 02 — The Sprout. Two leaves on a stem. Austere.
  sprout: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <line x1="24" y1="10" x2="24" y2="40" stroke={color} strokeWidth="1.5" />
      <path d="M24 22 Q 14 20 12 14" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M24 22 Q 34 20 36 14" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // 03 — The Taproot. A vertical line splitting into a root crown below ground.
  taproot: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      <line x1="24" y1="8" x2="24" y2="24" stroke={color} strokeWidth="1.5" />
      <path d="M24 24 L 16 40" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 24 L 32 40" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="24" x2="24" y2="42" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // 04 — The Crown. Three trees on a line. Grove.
  grove: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="12" cy="24" r="4" fill={color} />
      <circle cx="24" cy="20" r="5" fill={color} />
      <circle cx="36" cy="24" r="4" fill={color} />
      <line x1="12" y1="28" x2="12" y2="36" stroke={color} strokeWidth="1.5" />
      <line x1="24" y1="25" x2="24" y2="36" stroke={color} strokeWidth="1.5" />
      <line x1="36" y1="28" x2="36" y2="36" stroke={color} strokeWidth="1.5" />
      <line x1="6" y1="36" x2="42" y2="36" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  // 05 — The Arch. A single rooted arch — architectural, like a sequoia silhouette.
  arch: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M10 40 L 10 18 Q 10 8 24 8 Q 38 8 38 18 L 38 40" stroke={color} strokeWidth="1.5" fill="none" />
      <line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  // 06 — The Rings. Tree rings. Concentric circles.
  rings: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="24" cy="24" r="1.5" fill={color} />
    </svg>
  ),

  // 07 — Monogram 'SR' with a ground line.
  monogram: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <text x="24" y="28" textAnchor="middle" fill={color}
        fontFamily="'Instrument Serif', 'Cormorant Garamond', Georgia, serif"
        fontSize="26" fontStyle="italic" fontWeight="400">SR</text>
      <line x1="12" y1="36" x2="36" y2="36" stroke={color} strokeWidth="1" />
    </svg>
  ),

  // 08 — The Split. A vertical line with a sprout, mirrored below as root.
  mirror: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <line x1="24" y1="6" x2="24" y2="42" stroke={color} strokeWidth="1.5" />
      <line x1="4" y1="24" x2="44" y2="24" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M24 16 L 18 10 M24 16 L 30 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 32 L 18 38 M24 32 L 30 38" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // 09 — The Point. A single stacked diamond, like a compressed seed cotyledon.
  point: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 8 L 34 24 L 24 40 L 14 24 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="1" />
    </svg>
  ),

  // 10 — The Stamp. A block-serif R inside a circle. Apothecary feel.
  stamp: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1.5" fill="none" />
      <text x="24" y="32" textAnchor="middle" fill={color}
        fontFamily="'Instrument Serif', Georgia, serif"
        fontSize="24" fontWeight="400">R</text>
    </svg>
  ),

  // 11 — Ascender. A wordmark-dot. The 'i' of a wordmark, standalone.
  // Used when you need just a bullet-like favicon.
  ascender: (s, color) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <line x1="24" y1="12" x2="24" y2="36" stroke={color} strokeWidth="3" strokeLinecap="square" />
      <circle cx="24" cy="6" r="3" fill={color} />
    </svg>
  ),

  // 12 — Wordmark only — no glyph. The pure Loam take.
  none: () => null,
};

const LOGO_LIST = [
  ['seed', 'Seed', 'A seed on the horizon. The most reductive possible.'],
  ['sprout', 'Sprout', 'A stem with two symmetric leaves. Austere botanical.'],
  ['taproot', 'Taproot', 'Above and below the ground line. Literal to the name.'],
  ['grove', 'Grove', 'Three trees on a line. Quiet, grounded, plural.'],
  ['arch', 'Arch', 'A rooted arch. Architectural, sequoia silhouette.'],
  ['rings', 'Rings', 'Concentric tree rings. Annual growth made visible.'],
  ['monogram', 'Monogram', 'Italic SR with a rule underneath. Editorial masthead.'],
  ['mirror', 'Mirror', 'Shoots above, roots below, divided by horizon.'],
  ['point', 'Point', 'Diamond seed-form, compressed and structural.'],
  ['stamp', 'Stamp', 'R inside a circle. Apothecary, hand-set.'],
  ['ascender', 'Ascender', 'A typographic I — the dot tells the whole story.'],
  ['none', 'Wordmark only', 'No mark. Trust the type. Most quiet-luxury.'],
];

// A LogoLockup renders a chosen mark + the Strong Roots wordmark,
// in one of three configurations.
function LogoLockup({ mark = 'seed', variant = 'horizontal', palette, type, size = 1, onDark = false }) {
  const p = palette;
  const color = onDark ? p.bg : p.ink;
  const muted = onDark ? p.inkMuted : p.inkMuted;
  const drawMark = LOGO_MARKS[mark];

  const wordmark = (
    <div style={{
      fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight,
      fontSize: 28 * size, letterSpacing: '-0.005em', color, lineHeight: 0.95,
    }}>Strong Roots</div>
  );

  if (variant === 'mark') {
    return drawMark ? drawMark(56 * size, color) : wordmark;
  }

  if (variant === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {drawMark && drawMark(48 * size, color)}
        {wordmark}
        <div style={{
          fontFamily: type.label, fontSize: 9 * size, letterSpacing: type.labelTracking,
          textTransform: 'uppercase', color: muted,
        }}>Training · Consulting · Nutrition</div>
      </div>
    );
  }

  // horizontal
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      {drawMark && drawMark(40 * size, color)}
      {wordmark}
    </div>
  );
}

// Logo lab artboard — all 12 marks at once, in both light + dark.
function LogoLabArtboard({ direction, mode, selected = 'seed', onSelect }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const pLight = PALETTES[direction].light;
  const pDark = PALETTES[direction].dark;

  const Label = ({ children }) => (
    <div style={{
      fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 20,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 1320, padding: 56, background: p.bg, color: p.ink,
      fontFamily: t.body, minHeight: 720,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            Logo lab · 12 reductive marks
          </div>
          <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
            Pick the one that feels right.
          </div>
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, maxWidth: 380, textAlign: 'right', lineHeight: 1.55 }}>
          Each mark explored at 48px. Click a card to set it as the live logo across the whole system — hero, nav, mobile, brand. Cycle with the Tweaks panel too.
        </div>
      </div>

      <Label>All marks · {direction} · {mode}</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
        {LOGO_LIST.map(([key, name, desc]) => {
          const active = selected === key;
          const draw = LOGO_MARKS[key];
          return (
            <button
              key={key}
              onClick={() => onSelect && onSelect(key)}
              style={{
                padding: '28px 20px 18px', background: p.surface, cursor: 'pointer',
                border: `1px solid ${active ? p.ink : p.lineSoft}`, borderRadius: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                position: 'relative', fontFamily: t.body, color: p.ink, textAlign: 'center',
                outlineOffset: -1, outline: active ? `1px solid ${p.ink}` : 'none',
              }}
            >
              {active && (
                <span style={{
                  position: 'absolute', top: 10, right: 10, fontSize: 9,
                  fontFamily: t.label, letterSpacing: t.labelTracking,
                  textTransform: 'uppercase', color: p.accent, fontWeight: 700,
                }}>Selected</span>
              )}
              <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {draw ? draw(48, p.ink) : (
                  <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontSize: 22, color: p.ink }}>
                    Strong Roots
                  </div>
                )}
              </div>
              <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 20, lineHeight: 1, color: p.ink }}>
                {name}
              </div>
              <div style={{ fontSize: 11, color: p.inkSoft, lineHeight: 1.45, minHeight: 32 }}>
                {desc}
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                №{(LOGO_LIST.findIndex(x => x[0] === key) + 1).toString().padStart(2, '0')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected logo in context */}
      <Label>Selected · shown at scale · light + dark · lockup variants</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: '48px 32px', background: pLight.bg, border: `1px solid ${pLight.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LogoLockup mark={selected} variant="horizontal" palette={pLight} type={t} size={1.3} />
        </div>
        <div style={{ padding: '48px 32px', background: pDark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LogoLockup mark={selected} variant="horizontal" palette={pDark} type={t} size={1.3} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div style={{ padding: '36px 28px', background: pLight.surface, border: `1px solid ${pLight.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <LogoLockup mark={selected} variant="mark" palette={pLight} type={t} size={1.5} />
        </div>
        <div style={{ padding: '36px 28px', background: pLight.bg, border: `1px solid ${pLight.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <LogoLockup mark={selected} variant="stacked" palette={pLight} type={t} />
        </div>
        <div style={{ padding: '36px 28px', background: pLight.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <LogoLockup mark={selected} variant="horizontal" palette={pLight} type={t} onDark />
        </div>
      </div>

      {/* small sizes — favicon row */}
      <div style={{ marginTop: 32, padding: 20, background: p.surfaceAlt, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>Scale test</div>
        {[64, 40, 28, 20, 16].map(sz => (
          <div key={sz} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {LOGO_MARKS[selected] && LOGO_MARKS[selected](sz, p.ink)}
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: p.inkMuted }}>{sz}px</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { LOGO_MARKS, LOGO_LIST, LogoLockup, LogoLabArtboard });
