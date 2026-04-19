// Tweaks panel — floats bottom-right, toggles palette, type, density, mode, hero layout, copy tone
function TweaksPanel({ state, setState, visible }) {
  if (!visible) return null;

  const p = PALETTES[state.direction][state.mode];
  const t = TYPE_PAIRINGS[state.direction];

  const Row = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: '0.16em', color: '#8a7766',
        marginBottom: 8,
      }}>{label}</div>
      {children}
    </div>
  );

  const Pill = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      padding: '7px 12px',
      background: active ? '#1c1a16' : 'transparent',
      color: active ? '#f4efe4' : '#1c1a16',
      border: `1px solid ${active ? '#1c1a16' : '#d0cbbe'}`,
      fontFamily: 'ui-monospace, monospace', fontSize: 11,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      cursor: 'pointer', borderRadius: 0,
    }}>{children}</button>
  );

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 280,
      background: '#f4efe4', color: '#1c1a16',
      border: '1px solid #1c1a16',
      padding: 20, zIndex: 1000,
      fontFamily: 'ui-monospace, monospace',
      boxShadow: '0 24px 60px rgba(30,20,10,0.25)',
      maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        borderBottom: '1px solid #1c1a16', paddingBottom: 10, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tweaks</div>
        <div style={{ fontSize: 10, opacity: 0.6 }}>Strong Roots</div>
      </div>

      <Row label="Direction">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.keys(PALETTES).map(k => (
            <Pill key={k} active={state.direction === k} onClick={() => setState({ direction: k })}>
              {PALETTES[k].name} — {PALETTES[k].tag}
            </Pill>
          ))}
        </div>
      </Row>

      <Row label="Mode">
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill active={state.mode === 'light'} onClick={() => setState({ mode: 'light' })}>Light</Pill>
          <Pill active={state.mode === 'dark'} onClick={() => setState({ mode: 'dark' })}>Dark</Pill>
        </div>
      </Row>

      <Row label="Density">
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill active={state.density === 'editorial'} onClick={() => setState({ density: 'editorial' })}>Editorial</Pill>
          <Pill active={state.density === 'compact'} onClick={() => setState({ density: 'compact' })}>Compact</Pill>
        </div>
      </Row>

      <Row label="Hero layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Pill active={state.hero === 'editorial'} onClick={() => setState({ hero: 'editorial' })}>Editorial split</Pill>
          <Pill active={state.hero === 'stacked'} onClick={() => setState({ hero: 'stacked' })}>Centered stacked</Pill>
          <Pill active={state.hero === 'split-tri'} onClick={() => setState({ hero: 'split-tri' })}>Overlay triptych</Pill>
        </div>
      </Row>

      <Row label="Copy tone">
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill active={state.tone === 'quiet'} onClick={() => setState({ tone: 'quiet' })}>Quiet</Pill>
          <Pill active={state.tone === 'bold'} onClick={() => setState({ tone: 'bold' })}>Bold</Pill>
        </div>
      </Row>

      <Row label="Logo mark">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {(window.LOGO_LIST || []).map(([key, name]) => (
            <Pill key={key} active={state.mark === key} onClick={() => setState({ mark: key })}>
              {name}
            </Pill>
          ))}
        </div>
      </Row>

      <div style={{ borderTop: '1px solid #d0cbbe', paddingTop: 12, marginTop: 8 }}>
        <div style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.5 }}>
          Toggle <strong>Tweaks</strong> in the toolbar to hide.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel });
