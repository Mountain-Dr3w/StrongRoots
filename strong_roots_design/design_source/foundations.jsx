// Foundations — color, type, spacing, radii, shadows, motion
// Each component renders an "artboard" content. The canvas wraps it.

// Small helper: a swatch
function Swatch({ color, name, value, ink = '#000' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        width: 140, height: 88, background: color,
        borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)',
      }} />
      <div style={{ fontSize: 11, color: ink, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{name}</div>
      <div style={{ fontSize: 11, color: ink, opacity: 0.5, fontFamily: 'ui-monospace, monospace' }}>{value}</div>
    </div>
  );
}

function ColorSystemArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const meta = PALETTES[direction];
  const type = TYPE_PAIRINGS[direction];
  return (
    <div style={{
      width: 1160, padding: 56,
      background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div>
          <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            {meta.tag} · {mode}
          </div>
          <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
            {meta.name}
          </div>
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, maxWidth: 360, textAlign: 'right', lineHeight: 1.5 }}>
          {meta.description}
        </div>
      </div>

      {/* surfaces */}
      <div style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted, marginBottom: 14 }}>Surfaces</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 36 }}>
        <Swatch color={p.bg} name="bg" value={p.bg} ink={p.ink} />
        <Swatch color={p.surface} name="surface" value={p.surface} ink={p.ink} />
        <Swatch color={p.surfaceAlt} name="surface-alt" value={p.surfaceAlt} ink={p.ink} />
        <Swatch color={p.line} name="line" value={p.line} ink={p.ink} />
        <Swatch color={p.lineSoft} name="line-soft" value={p.lineSoft} ink={p.ink} />
      </div>

      <div style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted, marginBottom: 14 }}>Ink</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 36 }}>
        <Swatch color={p.ink} name="ink" value={p.ink} ink={p.ink} />
        <Swatch color={p.inkSoft} name="ink-soft" value={p.inkSoft} ink={p.ink} />
        <Swatch color={p.inkMuted} name="ink-muted" value={p.inkMuted} ink={p.ink} />
      </div>

      <div style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted, marginBottom: 14 }}>Accent & Signal</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <Swatch color={p.accent} name="accent" value={p.accent} ink={p.ink} />
        <Swatch color={p.accentSoft} name="accent-soft" value={p.accentSoft} ink={p.ink} />
        <Swatch color={p.signal} name="signal" value={p.signal} ink={p.ink} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Typography artboard
// ─────────────────────────────────────────────────────────────
function TypographyArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const type = TYPE_PAIRINGS[direction];
  const meta = PALETTES[direction];

  const row = (label, size, family, weight, style, lh, tracking, text) => (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'baseline', padding: '18px 0', borderTop: `1px solid ${p.lineSoft}` }}>
      <div style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
        {label}<br />
        <span style={{ color: p.inkMuted, opacity: 0.7 }}>{size}px</span>
      </div>
      <div style={{
        fontFamily: family, fontSize: size, fontWeight: weight, fontStyle: style,
        lineHeight: lh, letterSpacing: tracking, color: p.ink,
      }}>{text}</div>
    </div>
  );

  return (
    <div style={{
      width: 1160, padding: 56,
      background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 32, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          Typography · {meta.name}
        </div>
        <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Words that move the body.
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 10, fontFamily: 'ui-monospace, monospace' }}>
          display: {type.display.split(',')[0]} &nbsp;·&nbsp; body: {type.body.split(',')[0]}
        </div>
      </div>

      {row('Display', SCALE.type.display, type.display, type.displayWeight, type.displayStyle, 1.02, '-0.02em', 'Strong Roots')}
      {row('H1', SCALE.type.h1, type.display, type.displayWeight, type.displayStyle, 1.05, '-0.02em', 'Train for the long arc.')}
      {row('H2', SCALE.type.h2, type.display, type.displayWeight, type.displayStyle, 1.1, '-0.015em', 'A quiet, serious practice.')}
      {row('H3', SCALE.type.h3, type.display, type.displayWeight, type.displayStyle, 1.15, '-0.01em', 'Programs & Consulting')}
      {row('H4', SCALE.type.h4, type.body, 600, 'normal', 1.25, '-0.005em', 'What to expect inside the app')}
      {row('H5', SCALE.type.h5, type.body, 600, 'normal', 1.3, '0', 'Twelve weeks, fully guided')}
      {row('Lead', SCALE.type.lead, type.body, 400, 'normal', 1.55, '0', 'Ashlyn builds programs you can sustain for years — not six weeks of maximum effort before you disappear.')}
      {row('Body', SCALE.type.body, type.body, 400, 'normal', 1.6, '0', 'Every plan includes adaptive progression, video demos, and weekly check-ins with a real human reviewing your form.')}
      {row('Small', SCALE.type.small, type.body, 400, 'normal', 1.5, '0', 'Fine print lives here. Supporting info, secondary labels, and UI microcopy.')}
      {row('Caption / Eyebrow', SCALE.type.caption, type.label, 500, 'normal', 1.4, type.labelTracking, 'PROGRAM · 12 WEEKS · ALL LEVELS')}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Spacing, Radius, Shadow, Motion — the "system" artboard
// ─────────────────────────────────────────────────────────────
function SystemArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const type = TYPE_PAIRINGS[direction];

  const Label = ({ children }) => (
    <div style={{
      fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 14,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 1160, padding: 56,
      background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 32, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          System · spacing · radius · elevation · motion
        </div>
        <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Structure.
        </div>
      </div>

      {/* spacing */}
      <Label>Spacing (4pt base)</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap' }}>
        {SCALE.space.slice(1).map((s, i) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: s, height: s, background: p.accent, borderRadius: 1 }} />
            <div style={{ fontSize: 10, color: p.inkMuted, fontFamily: 'ui-monospace, monospace' }}>{s}</div>
          </div>
        ))}
      </div>

      {/* radius */}
      <Label>Radius</Label>
      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        {Object.entries(SCALE.radius).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 72, height: 72, background: p.surface, border: `1px solid ${p.line}`,
              borderRadius: v === 999 ? 999 : v,
            }} />
            <div style={{ fontSize: 11, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{k}</div>
            <div style={{ fontSize: 10, color: p.inkMuted, fontFamily: 'ui-monospace, monospace' }}>{v === 999 ? 'full' : v + 'px'}</div>
          </div>
        ))}
      </div>

      {/* elevation */}
      <Label>Elevation</Label>
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        {[
          { name: 'flat', shadow: 'none' },
          { name: 'whisper', shadow: `0 1px 2px ${mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(30,20,10,0.06)'}` },
          { name: 'rest', shadow: `0 2px 4px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(30,20,10,0.06)'}, 0 8px 24px ${mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(30,20,10,0.04)'}` },
          { name: 'lift', shadow: `0 4px 8px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(30,20,10,0.08)'}, 0 16px 48px ${mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(30,20,10,0.08)'}` },
          { name: 'float', shadow: `0 8px 16px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(30,20,10,0.1)'}, 0 32px 80px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(30,20,10,0.12)'}` },
        ].map(e => (
          <div key={e.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 120, height: 80, background: p.surface, borderRadius: SCALE.radius.md,
              boxShadow: e.shadow,
            }} />
            <div style={{ fontSize: 11, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{e.name}</div>
          </div>
        ))}
      </div>

      {/* motion */}
      <Label>Motion</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[
          ['instant', '80ms', 'ease-out', 'State echoes'],
          ['quick', '180ms', 'cubic-bezier(0.2,0,0,1)', 'Hover · press'],
          ['settle', '320ms', 'cubic-bezier(0.2,0,0,1)', 'Panels · nav'],
          ['breathe', '640ms', 'cubic-bezier(0.4,0,0.2,1)', 'Reveal · hero'],
        ].map(([name, dur, ease, use]) => (
          <div key={name} style={{
            padding: 16, background: p.surface, borderRadius: SCALE.radius.md,
            border: `1px solid ${p.lineSoft}`,
          }}>
            <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 24, marginBottom: 4 }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: p.inkMuted, fontFamily: 'ui-monospace, monospace', marginBottom: 8 }}>
              {dur} · {ease}
            </div>
            <div style={{ fontSize: 12, color: p.inkSoft }}>{use}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ColorSystemArtboard, TypographyArtboard, SystemArtboard });
