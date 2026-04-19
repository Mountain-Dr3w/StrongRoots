// Components — buttons, inputs, tags, cards, nav, toggles
// All driven by the active direction + mode.

// Shared: small arrow glyph using CSS only
function Arrow({ color = 'currentColor', size = 14, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <path d="M1 7h12M8 2l5 5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function ButtonsArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const type = TYPE_PAIRINGS[direction];

  // Button primary — direction-specific shape
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : 999;

  const Primary = ({ size = 'md', children }) => {
    const pad = size === 'lg' ? '18px 32px' : size === 'sm' ? '10px 18px' : '14px 26px';
    const fs = size === 'lg' ? 15 : size === 'sm' ? 12 : 13;
    return (
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: p.accent, color: p.accentInk,
        border: 'none', padding: pad, borderRadius: shape,
        fontFamily: type.label, fontSize: fs, fontWeight: 600,
        letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
        textTransform: direction === 'understory' ? 'uppercase' : 'none',
        cursor: 'pointer',
      }}>
        {children}<Arrow color={p.accentInk} size={12} />
      </button>
    );
  };

  const Secondary = ({ children }) => (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      background: 'transparent', color: p.ink,
      border: `1px solid ${p.ink}`, padding: '14px 26px', borderRadius: shape,
      fontFamily: type.label, fontSize: 13, fontWeight: 500,
      letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
      textTransform: direction === 'understory' ? 'uppercase' : 'none',
      cursor: 'pointer',
    }}>{children}</button>
  );

  const Ghost = ({ children }) => (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'transparent', color: p.ink,
      border: 'none', padding: '14px 4px', borderRadius: 0,
      borderBottom: `1px solid ${p.ink}`,
      fontFamily: type.label, fontSize: 13, fontWeight: 500,
      letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
      textTransform: direction === 'understory' ? 'uppercase' : 'none',
      cursor: 'pointer',
    }}>{children}<Arrow size={12} /></button>
  );

  const Label = ({ children }) => (
    <div style={{
      fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 16,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 1160, padding: 56, background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          Components · Buttons & Links
        </div>
        <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Actions.
        </div>
      </div>

      <Label>Primary · three sizes</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 40 }}>
        <Primary size="lg">Start training</Primary>
        <Primary size="md">Book a call</Primary>
        <Primary size="sm">Continue</Primary>
      </div>

      <Label>Secondary</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 40 }}>
        <Secondary>Read the approach</Secondary>
        <Secondary>View all plans</Secondary>
      </div>

      <Label>Tertiary · inline link</Label>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginBottom: 40 }}>
        <Ghost>Learn more</Ghost>
        <Ghost>Our method</Ghost>
      </div>

      <Label>States — rest · hover · pressed · disabled</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 40 }}>
        <button style={{
          background: p.accent, color: p.accentInk, border: 'none', padding: '14px 26px',
          borderRadius: shape, fontFamily: type.label, fontSize: 13, fontWeight: 600,
          letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
          textTransform: direction === 'understory' ? 'uppercase' : 'none',
        }}>Rest</button>
        <button style={{
          background: p.ink, color: p.bg, border: 'none', padding: '14px 26px',
          borderRadius: shape, fontFamily: type.label, fontSize: 13, fontWeight: 600,
          letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
          textTransform: direction === 'understory' ? 'uppercase' : 'none',
          transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(30,20,10,0.14)'}`,
        }}>Hover</button>
        <button style={{
          background: p.ink, color: p.bg, border: 'none', padding: '14px 26px',
          borderRadius: shape, fontFamily: type.label, fontSize: 13, fontWeight: 600,
          letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
          textTransform: direction === 'understory' ? 'uppercase' : 'none',
          transform: 'translateY(1px)', opacity: 0.9,
        }}>Pressed</button>
        <button disabled style={{
          background: p.line, color: p.inkMuted, border: 'none', padding: '14px 26px',
          borderRadius: shape, fontFamily: type.label, fontSize: 13, fontWeight: 600,
          letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
          textTransform: direction === 'understory' ? 'uppercase' : 'none',
          cursor: 'not-allowed',
        }}>Disabled</button>
      </div>

      <Label>Icon · utility</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {['←', '→', '＋', '✓', '⌕'].map(g => (
          <button key={g} style={{
            width: 44, height: 44, background: p.surface, color: p.ink,
            border: `1px solid ${p.line}`, borderRadius: direction === 'heartwood' ? 999 : SCALE.radius.md,
            fontSize: 16, cursor: 'pointer', fontFamily: type.body,
          }}>{g}</button>
        ))}
      </div>
    </div>
  );
}

function FormsArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const type = TYPE_PAIRINGS[direction];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : SCALE.radius.md;

  const FieldLabel = ({ children }) => (
    <div style={{
      fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
      textTransform: 'uppercase', color: p.inkSoft, marginBottom: 8,
    }}>{children}</div>
  );

  const Input = ({ value, placeholder, state = 'rest' }) => {
    const borderColor = state === 'focus' ? p.accent : state === 'error' ? '#b54836' : p.line;
    return (
      <input
        defaultValue={value}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '14px 16px', borderRadius: shape,
          background: 'transparent',
          border: `1px solid ${borderColor}`,
          borderWidth: state === 'focus' ? 2 : 1,
          fontFamily: type.body, fontSize: 15, color: p.ink,
          outline: 'none',
        }}
      />
    );
  };

  const Label = ({ children }) => (
    <div style={{
      fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 16,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 1160, padding: 56, background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          Components · Forms & Inputs
        </div>
        <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Enter.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <Label>Text input · states</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <FieldLabel>Your name</FieldLabel>
              <Input placeholder="Ashlyn Reed" />
            </div>
            <div>
              <FieldLabel>Email · focused</FieldLabel>
              <Input value="hello@strongroots.co" state="focus" />
            </div>
            <div>
              <FieldLabel>Invite code · error</FieldLabel>
              <Input value="STRONG-99" state="error" />
              <div style={{ fontSize: 12, color: '#b54836', marginTop: 6 }}>That code has already been used.</div>
            </div>
            <div>
              <FieldLabel>Goals · textarea</FieldLabel>
              <textarea defaultValue="Get strong enough to carry groceries and grandkids without thinking about it." style={{
                width: '100%', padding: '14px 16px', borderRadius: shape,
                background: 'transparent', border: `1px solid ${p.line}`,
                fontFamily: type.body, fontSize: 15, color: p.ink,
                minHeight: 96, outline: 'none', resize: 'vertical',
              }} />
            </div>
          </div>
        </div>

        <div>
          <Label>Choice · radio, check, toggle</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* radio group */}
            <div>
              <FieldLabel>Training frequency</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['3 days / week', false],
                  ['4 days / week', true],
                  ['5 days / week', false],
                ].map(([l, active]) => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${active ? p.accent : p.line}`,
                      position: 'relative', background: 'transparent',
                    }}>
                      {active && <span style={{ position: 'absolute', inset: 4, background: p.accent, borderRadius: 999 }} />}
                    </span>
                    <span style={{ fontSize: 15 }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* checkboxes */}
            <div>
              <FieldLabel>Focus areas</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Strength', true], ['Mobility', true], ['Endurance', false], ['Hypertrophy', false]].map(([l, active]) => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 2,
                      border: `1.5px solid ${active ? p.accent : p.line}`, background: active ? p.accent : 'transparent',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: p.accentInk, fontSize: 12,
                    }}>{active ? '✓' : ''}</span>
                    <span style={{ fontSize: 15 }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* toggle */}
            <div>
              <FieldLabel>Preferences</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[['Weekly check-ins', true], ['Daily nudges', false]].map(([l, active]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15 }}>{l}</span>
                    <span style={{
                      width: 40, height: 22, background: active ? p.accent : p.line, borderRadius: 999,
                      position: 'relative', transition: 'background 180ms',
                    }}>
                      <span style={{
                        position: 'absolute', top: 2, left: active ? 20 : 2, width: 18, height: 18,
                        background: p.surface, borderRadius: 999, transition: 'left 180ms',
                      }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgesArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const type = TYPE_PAIRINGS[direction];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : 999;

  const Label = ({ children }) => (
    <div style={{
      fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 16,
    }}>{children}</div>
  );

  const Tag = ({ children, variant = 'outline' }) => {
    const styles = {
      outline: { bg: 'transparent', fg: p.ink, bd: p.line },
      solid:   { bg: p.accent, fg: p.accentInk, bd: p.accent },
      soft:    { bg: p.surfaceAlt, fg: p.ink, bd: 'transparent' },
      signal:  { bg: p.signal, fg: mode === 'dark' ? p.bg : p.accentInk, bd: 'transparent' },
    }[variant];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: shape,
        background: styles.bg, color: styles.fg, border: `1px solid ${styles.bd}`,
        fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking,
        textTransform: 'uppercase', fontWeight: 600,
      }}>{children}</span>
    );
  };

  return (
    <div style={{
      width: 1160, padding: 56, background: p.bg, color: p.ink,
      fontFamily: type.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          Components · Tags & Meta
        </div>
        <div style={{ fontFamily: type.display, fontStyle: type.displayStyle, fontWeight: type.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Signals.
        </div>
      </div>

      <Label>Variants</Label>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Tag variant="outline">Beginner</Tag>
        <Tag variant="outline">Intermediate</Tag>
        <Tag variant="solid">New</Tag>
        <Tag variant="soft">12 weeks</Tag>
        <Tag variant="soft">Strength</Tag>
        <Tag variant="signal">Best seller</Tag>
      </div>

      <Label>Meta row · program header</Label>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '20px 0', borderTop: `1px solid ${p.lineSoft}`, borderBottom: `1px solid ${p.lineSoft}`, marginBottom: 40 }}>
        <span style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>
          Program №03
        </span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: p.inkMuted }} />
        <span style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>
          12 weeks
        </span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: p.inkMuted }} />
        <span style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>
          4 days / wk
        </span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: p.inkMuted }} />
        <span style={{ fontFamily: type.label, fontSize: 10, letterSpacing: type.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>
          All levels
        </span>
      </div>

      <Label>Progress · metric dots</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: type.label, fontSize: 11, letterSpacing: type.labelTracking, textTransform: 'uppercase' }}>Week 7 of 12</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: p.inkSoft }}>58%</span>
          </div>
          <div style={{ height: 2, background: p.line, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, right: '42%', background: p.accent }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: direction === 'understory' ? 0 : 999,
              background: i < 7 ? p.accent : p.line,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ButtonsArtboard, FormsArtboard, BadgesArtboard });
