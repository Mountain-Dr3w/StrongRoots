// Applications — brand marks, plan cards, consulting tiers,
// mobile patterns, hero layouts, navigation.

// LogoLockup lives in logos.jsx — imported via window globals.

function BrandArtboard({ direction, mode, mark = 'seed' }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const meta = PALETTES[direction];

  const Label = ({ children }) => (
    <div style={{
      fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking,
      textTransform: 'uppercase', color: p.inkMuted, marginBottom: 20,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 1160, padding: 56, background: p.bg, color: p.ink,
      fontFamily: t.body, minHeight: 720,
    }}>
      <div style={{ marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
          Brand · Mark · Wordmark
        </div>
        <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
          Identity.
        </div>
      </div>

      <Label>Mark · stacked · horizontal</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 48 }}>
        <div style={{ padding: 40, background: p.surface, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240, border: `1px solid ${p.lineSoft}` }}>
          <LogoLockup mark={mark} variant="mark" palette={p} type={t} size={1.3} />
        </div>
        <div style={{ padding: 40, background: p.surface, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240, border: `1px solid ${p.lineSoft}` }}>
          <LogoLockup mark={mark} variant="stacked" palette={p} type={t} />
        </div>
        <div style={{ padding: 40, background: p.surface, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240, border: `1px solid ${p.lineSoft}` }}>
          <LogoLockup mark={mark} variant="horizontal" palette={p} type={t} />
        </div>
      </div>

      <Label>Inverse · on accent · on dark</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
        <div style={{ padding: 40, background: p.accent, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <LogoLockup mark={mark} variant="horizontal" palette={{ ...p, ink: p.accentInk, inkMuted: p.accentInk, bg: p.accent }} type={t} />
        </div>
        <div style={{ padding: 40, background: p.ink, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <LogoLockup mark={mark} variant="horizontal" palette={p} type={t} onDark />
        </div>
      </div>

      <Label>Voice · language system</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft, marginBottom: 12 }}>We say</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['training practice', 'long arc', 'sustainable strength', 'Ashlyn', 'check-in', 'block'].map(w => (
              <li key={w} style={{ fontSize: 15, color: p.ink }}>— {w}</li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft, marginBottom: 12 }}>We don't</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['shred', 'crush it', 'beast mode', 'hack', 'transformation', 'guru'].map(w => (
              <li key={w} style={{ fontSize: 15, color: p.inkMuted, textDecoration: 'line-through' }}>— {w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Hero variants ─────────────────────────────────────────
function HeroArtboard({ direction, mode, layout = 'editorial', tone = 'quiet', mark = 'seed' }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const c = COPY[tone];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : 999;

  const PrimaryBtn = ({ label }) => (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      background: p.accent, color: p.accentInk, border: 'none',
      padding: '16px 28px', borderRadius: shape, cursor: 'pointer',
      fontFamily: t.label, fontSize: 13, fontWeight: 600,
      letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
      textTransform: direction === 'understory' ? 'uppercase' : 'none',
    }}>{label}
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke={p.accentInk} strokeWidth="1.5" /></svg>
    </button>
  );

  const SecondaryBtn = ({ label }) => (
    <button style={{
      background: 'transparent', color: p.ink, border: `1px solid ${p.ink}`,
      padding: '16px 28px', borderRadius: shape, cursor: 'pointer',
      fontFamily: t.label, fontSize: 13, fontWeight: 500,
      letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
      textTransform: direction === 'understory' ? 'uppercase' : 'none',
    }}>{label}</button>
  );

  // Placeholder "photo" tile — stripy earthy texture
  const Placeholder = ({ w, h, label, ratio }) => {
    const stripes = direction === 'heartwood' ? p.accentSoft : direction === 'understory' ? p.signal : p.surfaceAlt;
    return (
      <div style={{
        width: w, height: h, aspectRatio: ratio, position: 'relative',
        background: `repeating-linear-gradient(135deg, ${p.surfaceAlt} 0 14px, ${stripes} 14px 28px)`,
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${p.ink}33)`,
        }} />
        <div style={{
          position: 'absolute', bottom: 12, left: 14,
          fontFamily: 'ui-monospace, monospace', fontSize: 10, color: p.bg,
          background: p.ink, padding: '3px 8px',
        }}>{label}</div>
      </div>
    );
  };

  const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: `1px solid ${p.lineSoft}` }}>
      <LogoLockup mark={mark} variant="horizontal" palette={p} type={t} size={0.85} />
      <div style={{ display: 'flex', gap: 32, fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>
        <span>Programs</span><span>Consulting</span><span>Nutrition</span><span>Journal</span>
      </div>
      <button style={{
        background: 'transparent', color: p.ink, border: `1px solid ${p.ink}`,
        padding: '8px 16px', borderRadius: shape,
        fontFamily: t.label, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
      }}>Sign in</button>
    </div>
  );

  // Three layouts:
  // editorial — asymmetric split, huge display type left, portrait right
  // stacked — centered, caption → big head → sub → ctas, full-bleed photo below
  // split-tri — three vertical panes, overlapping photo

  let inner;
  if (layout === 'editorial') {
    inner = (
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, padding: '60px 40px 60px', alignItems: 'end', minHeight: 620 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft, marginBottom: 24 }}>
            {c.kicker}
          </div>
          <h1 style={{
            fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
            fontSize: 96, lineHeight: 0.98, letterSpacing: '-0.025em', color: p.ink,
            margin: 0, whiteSpace: 'pre-line', textWrap: 'balance',
          }}>{c.headline}</h1>
          <p style={{
            fontFamily: t.body, fontSize: 17, lineHeight: 1.55, color: p.inkSoft,
            margin: '28px 0 32px', maxWidth: 440,
          }}>{c.sub}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <PrimaryBtn label={c.cta} />
            <SecondaryBtn label={c.secondary} />
          </div>
        </div>
        <Placeholder w="100%" h={520} label="portrait · ashlyn" />
      </div>
    );
  } else if (layout === 'stacked') {
    inner = (
      <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 620 }}>
        <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft, marginBottom: 20 }}>
          {c.kicker}
        </div>
        <h1 style={{
          fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
          fontSize: 104, lineHeight: 0.96, letterSpacing: '-0.025em', color: p.ink,
          margin: 0, whiteSpace: 'pre-line', maxWidth: 1000, textWrap: 'balance',
        }}>{c.headline}</h1>
        <p style={{
          fontFamily: t.body, fontSize: 18, lineHeight: 1.55, color: p.inkSoft,
          margin: '24px 0 28px', maxWidth: 620,
        }}>{c.sub}</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <PrimaryBtn label={c.cta} />
          <SecondaryBtn label={c.secondary} />
        </div>
        <Placeholder w="100%" h={260} label="training floor · wide" />
      </div>
    );
  } else {
    // split-tri — overlapping diagonal
    inner = (
      <div style={{ position: 'relative', padding: '60px 40px', minHeight: 620 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, height: 480 }}>
          <Placeholder w="100%" h="100%" label="01 · warmup" ratio="3 / 4" />
          <Placeholder w="100%" h="100%" label="02 · lift" ratio="3 / 4" />
          <Placeholder w="100%" h="100%" label="03 · recover" ratio="3 / 4" />
        </div>
        <div style={{
          position: 'absolute', bottom: 40, left: 40, right: 40,
          background: p.bg, padding: '28px 32px', maxWidth: 720,
        }}>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft, marginBottom: 16 }}>
            {c.kicker}
          </div>
          <h1 style={{
            fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
            fontSize: 72, lineHeight: 0.98, letterSpacing: '-0.02em', color: p.ink,
            margin: 0, whiteSpace: 'pre-line',
          }}>{c.headline}</h1>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <PrimaryBtn label={c.cta} />
            <SecondaryBtn label={c.secondary} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 1320, background: p.bg, color: p.ink, fontFamily: t.body }}>
      <Header />
      {inner}
    </div>
  );
}

// ── Plan cards (digital workout plans) ───────────────────────
function PlansArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : SCALE.radius.md;

  const Placeholder = ({ label, h = 220 }) => {
    const stripes = direction === 'heartwood' ? p.accentSoft : direction === 'understory' ? p.signal : p.surfaceAlt;
    return (
      <div style={{
        width: '100%', height: h,
        background: `repeating-linear-gradient(135deg, ${p.surfaceAlt} 0 14px, ${stripes} 14px 28px)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          fontFamily: 'ui-monospace, monospace', fontSize: 10, color: p.bg,
          background: p.ink, padding: '3px 8px',
        }}>{label}</div>
      </div>
    );
  };

  const PlanCard = ({ no, title, weeks, level, price, tags, imgLabel }) => (
    <div style={{
      background: p.surface, borderRadius: shape, overflow: 'hidden',
      border: `1px solid ${p.lineSoft}`, display: 'flex', flexDirection: 'column',
    }}>
      <Placeholder label={imgLabel} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            Program №{no}
          </span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: p.inkMuted }}>
            {weeks}w · {level}
          </span>
        </div>
        <h3 style={{
          fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
          fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.01em', margin: 0, color: p.ink,
        }}>{title}</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              padding: '4px 10px', border: `1px solid ${p.line}`,
              borderRadius: shape === 0 ? 0 : 999,
              fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking,
              textTransform: 'uppercase', color: p.inkSoft,
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: `1px solid ${p.lineSoft}` }}>
          <span style={{
            fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
            fontSize: 24, color: p.ink,
          }}>${price}</span>
          <span style={{
            fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking,
            textTransform: 'uppercase', color: p.ink, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600,
          }}>
            View plan
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke={p.ink} strokeWidth="1.5" /></svg>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      width: 1320, padding: 56, background: p.bg, color: p.ink,
      fontFamily: t.body, minHeight: 720,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            Applications · Digital plans
          </div>
          <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
            Programs, on demand.
          </div>
        </div>
        <div style={{
          fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase',
          color: p.ink, display: 'flex', alignItems: 'center', gap: 6,
        }}>See all <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke={p.ink} strokeWidth="1.5" /></svg></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <PlanCard no="01" title="Built to Last" weeks={12} level="All levels" price={129} tags={['Strength', 'Longevity']} imgLabel="rack work" />
        <PlanCard no="02" title="Return to Lifting" weeks={8} level="Beginner" price={89} tags={['Foundations', 'Mobility']} imgLabel="onboarding" />
        <PlanCard no="03" title="Off-Season Build" weeks={16} level="Advanced" price={179} tags={['Hypertrophy', 'Strength']} imgLabel="back work" />
      </div>
    </div>
  );
}

// ── Consulting tiers ─────────────────────────────────────────
function TiersArtboard({ direction, mode }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : SCALE.radius.md;

  const Tier = ({ name, price, per, subtitle, features, featured }) => (
    <div style={{
      padding: 32, borderRadius: shape,
      background: featured ? p.ink : p.surface,
      color: featured ? p.bg : p.ink,
      border: `1px solid ${featured ? p.ink : p.lineSoft}`,
      display: 'flex', flexDirection: 'column', gap: 20, minHeight: 520,
    }}>
      <div>
        <div style={{
          fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking,
          textTransform: 'uppercase', color: featured ? p.inkMuted : p.inkMuted, marginBottom: 12,
        }}>{subtitle}</div>
        <div style={{
          fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
          fontSize: 40, lineHeight: 1, letterSpacing: '-0.01em',
        }}>{name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight,
          fontSize: 56, lineHeight: 1,
        }}>${price}</span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>/ {per}</span>
      </div>
      <div style={{ height: 1, background: featured ? p.inkSoft : p.lineSoft, opacity: 0.5 }} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ color: featured ? p.accent : p.accent, fontWeight: 700 }}>—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button style={{
        background: featured ? p.accent : 'transparent', color: featured ? p.accentInk : p.ink,
        border: `1px solid ${featured ? p.accent : p.ink}`,
        padding: '14px 20px', borderRadius: shape,
        fontFamily: t.label, fontSize: 12, fontWeight: 600,
        letterSpacing: direction === 'understory' ? '0.18em' : '0.06em',
        textTransform: direction === 'understory' ? 'uppercase' : 'none',
        cursor: 'pointer',
      }}>Book intake call →</button>
    </div>
  );

  return (
    <div style={{
      width: 1320, padding: 56, background: p.bg, color: p.ink,
      fontFamily: t.body, minHeight: 720,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            Applications · 1:1 Consulting
          </div>
          <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
            Work with Ashlyn.
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <Tier
          name="Foundation"
          subtitle="Self-directed · guided"
          price="89"
          per="month"
          features={[
            'Custom 12-week program',
            'Weekly async video check-in',
            'In-app form review (3 / week)',
            'Nutrition framework',
          ]}
        />
        <Tier
          featured
          name="Practice"
          subtitle="Most chosen · 1:1"
          price="249"
          per="month"
          features={[
            'Everything in Foundation',
            'Bi-weekly 45-min live call',
            'Unlimited form review',
            'Custom macro targets',
            'Direct message access M–F',
          ]}
        />
        <Tier
          name="Performance"
          subtitle="Athletic · season-based"
          price="495"
          per="month"
          features={[
            'Everything in Practice',
            'Weekly 60-min live call',
            'Periodized block design',
            'Sport-specific testing',
            'Rehab coordination',
          ]}
        />
      </div>
    </div>
  );
}

// ── Mobile patterns ──────────────────────────────────────────
function MobileArtboard({ direction, mode, mark = 'seed' }) {
  const p = PALETTES[direction][mode];
  const t = TYPE_PAIRINGS[direction];
  const shape = direction === 'understory' ? 0 : direction === 'heartwood' ? 2 : SCALE.radius.md;

  const Phone = ({ children, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: t.label, fontSize: 10, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
        {label}
      </div>
      <div style={{
        width: 320, height: 680, background: p.ink, borderRadius: 44,
        padding: 10, boxShadow: `0 20px 48px ${mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(30,20,10,0.14)'}`,
      }}>
        <div style={{
          width: '100%', height: '100%', background: p.bg, borderRadius: 36,
          overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', color: p.ink, fontSize: 12, fontFamily: t.body, fontWeight: 600 }}>
            <span>9:41</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10 }}>●●● ▲ ⚡</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  const Placeholder = ({ label, h = 180 }) => {
    const stripes = direction === 'heartwood' ? p.accentSoft : direction === 'understory' ? p.signal : p.surfaceAlt;
    return (
      <div style={{
        width: '100%', height: h,
        background: `repeating-linear-gradient(135deg, ${p.surfaceAlt} 0 10px, ${stripes} 10px 20px)`,
        position: 'relative', borderRadius: 2,
      }}>
        <div style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'ui-monospace, monospace', fontSize: 9, color: p.bg, background: p.ink, padding: '2px 6px' }}>{label}</div>
      </div>
    );
  };

  // Screen 1: Home feed
  const Home = (
    <div style={{ padding: '8px 20px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>Thursday</div>
          <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 28, lineHeight: 1, marginTop: 4, color: p.ink }}>Good morning, Maya.</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: p.surfaceAlt }} />
      </div>
      <div style={{ padding: 16, background: p.surface, borderRadius: shape, border: `1px solid ${p.lineSoft}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>Today · Day 24</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: p.inkMuted }}>45 min</span>
        </div>
        <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 22, lineHeight: 1.1, color: p.ink }}>Lower · Heavy</div>
        <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 4 }}>Back squat · RDL · split squat</div>
        <button style={{ width: '100%', marginTop: 14, background: p.accent, color: p.accentInk, border: 'none', padding: '12px', borderRadius: shape, fontFamily: t.label, fontSize: 11, fontWeight: 600, letterSpacing: direction === 'understory' ? '0.18em' : '0.06em', textTransform: direction === 'understory' ? 'uppercase' : 'none' }}>Start session →</button>
      </div>
      <div>
        <div style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted, marginBottom: 10 }}>This week</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 10, color: p.inkMuted }}>{d}</div>
              <div style={{ width: 24, height: 24, borderRadius: direction === 'understory' ? 0 : 999, background: i < 3 ? p.accent : i === 3 ? p.ink : p.lineSoft }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, background: p.surface, borderRadius: shape, border: `1px solid ${p.lineSoft}` }}>
        <div style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>From Ashlyn</div>
        <div style={{ fontSize: 12, color: p.ink, marginTop: 6, lineHeight: 1.5 }}>“Nice work on Tuesday's squats — the depth is locking in. Let's push load +5 lb this block.”</div>
      </div>
      {/* bottom nav */}
      <div style={{ marginTop: 'auto', padding: '14px 20px 22px', display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${p.lineSoft}`, margin: '0 -20px' }}>
        {['Home', 'Train', 'Eat', 'You'].map((l, i) => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: direction === 'understory' ? 0 : 999, background: i === 0 ? p.accent : 'transparent' }} />
            <span style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: i === 0 ? p.ink : p.inkMuted, fontWeight: i === 0 ? 600 : 400 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Screen 2: Workout in progress
  const Workout = (
    <div style={{ padding: '8px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 18, color: p.ink }}>←</span>
        <span style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>Exercise 2 of 6</span>
        <span style={{ fontSize: 14, color: p.ink }}>⋯</span>
      </div>
      <Placeholder label="demo video" h={180} />
      <div>
        <div style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>A2 · Primary</div>
        <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 26, lineHeight: 1, marginTop: 4, color: p.ink }}>Back squat</div>
        <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 6 }}>4 sets × 5 reps · RPE 7 · 3 min rest</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { set: 1, weight: 185, reps: 5, done: true },
          { set: 2, weight: 195, reps: 5, done: true },
          { set: 3, weight: 205, reps: 5, done: false, active: true },
          { set: 4, weight: 205, reps: 5, done: false },
        ].map(s => (
          <div key={s.set} style={{
            display: 'grid', gridTemplateColumns: '28px 1fr 1fr 24px', gap: 10, alignItems: 'center',
            padding: 12, background: s.active ? p.surfaceAlt : 'transparent',
            border: `1px solid ${s.done ? p.accent : p.lineSoft}`, borderRadius: shape,
          }}>
            <span style={{ fontFamily: t.label, fontSize: 10, color: p.inkMuted, letterSpacing: t.labelTracking }}>SET {s.set}</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, color: p.ink }}>{s.weight} lb</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, color: p.ink }}>{s.reps} reps</span>
            <span style={{ fontSize: 14, color: s.done ? p.accent : p.inkMuted, textAlign: 'right' }}>{s.done ? '✓' : '○'}</span>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 'auto', background: p.accent, color: p.accentInk, border: 'none', padding: '14px', borderRadius: shape, fontFamily: t.label, fontSize: 11, fontWeight: 600, letterSpacing: direction === 'understory' ? '0.18em' : '0.06em', textTransform: direction === 'understory' ? 'uppercase' : 'none' }}>Log set →</button>
    </div>
  );

  // Screen 3: Plan detail
  const Detail = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Placeholder label="hero · program cover" h={220} />
      <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>Program №01 · 12 weeks</span>
        <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 32, lineHeight: 1, color: p.ink }}>Built to Last</div>
        <p style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5, margin: 0 }}>
          A foundational strength program for the long arc. Four days a week, full-body, built around four lifts you'll repeat for years.
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Strength', 'Longevity', '4 days/wk', 'All levels'].map(x => (
            <span key={x} style={{ padding: '4px 10px', border: `1px solid ${p.line}`, borderRadius: shape === 0 ? 0 : 999, fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkSoft }}>{x}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${p.lineSoft}`, borderBottom: `1px solid ${p.lineSoft}`, marginTop: 6 }}>
          <span style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 24, color: p.ink }}>$129</span>
          <span style={{ fontFamily: t.label, fontSize: 9, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>One-time · lifetime</span>
        </div>
        <button style={{ width: '100%', background: p.accent, color: p.accentInk, border: 'none', padding: '14px', borderRadius: shape, fontFamily: t.label, fontSize: 11, fontWeight: 600, letterSpacing: direction === 'understory' ? '0.18em' : '0.06em', textTransform: direction === 'understory' ? 'uppercase' : 'none' }}>Begin program →</button>
      </div>
    </div>
  );

  return (
    <div style={{
      width: 1320, padding: 56, background: p.bg, color: p.ink,
      fontFamily: t.body, minHeight: 720,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, borderBottom: `1px solid ${p.line}`, paddingBottom: 20 }}>
        <div>
          <div style={{ fontFamily: t.label, fontSize: 11, letterSpacing: t.labelTracking, textTransform: 'uppercase', color: p.inkMuted }}>
            Applications · Mobile · iOS
          </div>
          <div style={{ fontFamily: t.display, fontStyle: t.displayStyle, fontWeight: t.displayWeight, fontSize: 56, lineHeight: 1.05, marginTop: 8 }}>
            In the pocket.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <Phone label="Home · daily">{Home}</Phone>
        <Phone label="Workout · in progress">{Workout}</Phone>
        <Phone label="Plan · detail">{Detail}</Phone>
      </div>
    </div>
  );
}

Object.assign(window, { BrandArtboard, HeroArtboard, PlansArtboard, TiersArtboard, MobileArtboard });
