import Head from 'next/head'
import { useState } from 'react'

export default function Tools() {
  return (
    <>
      <Head>
        <title>Free RS-232 Tools — AVCommand</title>
        <meta name="description" content="Free RS-232 tools for AV integrators. Baud rate calculator, serial port settings reference, terminator lookup, and cable pinout guide." />
        <link rel="canonical" href="https://av-command.com/tools" />
      </Head>
      <ToolsApp />
    </>
  )
}

function ToolsApp() {
  const [activeTab, setActiveTab] = useState('baudref')
  const [baudCalc, setBaudCalc] = useState({ baud: 9600, bits: 8, parity: 'N', stop: 1 })
  const [termSearch, setTermSearch] = useState('')

  const baudPresets = [
    { baud: 1200,   common: 'Legacy equipment' },
    { baud: 2400,   common: 'Some older displays' },
    { baud: 4800,   common: 'Rare AV use' },
    { baud: 9600,   common: 'Most common — displays, projectors, switchers' },
    { baud: 19200,  common: 'Some DSPs, video processors' },
    { baud: 38400,  common: 'Some Crestron modules, video walls' },
    { baud: 57600,  common: 'Some modern displays' },
    { baud: 115200, common: 'Biamp Tesira, Extron (some), QSC peripherals' },
  ]

  const deviceRef = [
    { mfr: 'Panasonic', model: 'PT Series Projectors', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'STX/ETX' },
    { mfr: 'Sony', model: 'BRAVIA Professional', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: '3.5mm adapter on newer models', term: 'Binary HEX' },
    { mfr: 'NEC', model: 'MultiSync Displays', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Null modem', term: 'Binary HEX packet' },
    { mfr: 'Extron', model: 'All SIS devices', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'Kramer', model: 'Protocol 3000', baud: 115200, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'Kramer', model: 'Protocol 2000', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: '4-byte HEX' },
    { mfr: 'Biamp', model: 'Tesira/TesiraFORTE', baud: 115200, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'LF (0x0A)' },
    { mfr: 'Samsung', model: 'Commercial Displays', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'Binary HEX' },
    { mfr: 'LG', model: 'Commercial Displays', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'ASCII with CR' },
    { mfr: 'Christie', model: 'Projectors', baud: 19200, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'Barco', model: 'Projectors', baud: 19200, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR/LF' },
    { mfr: 'Sharp', model: 'AQUOS Commercial', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'Philips', model: 'Professional Displays', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'Epson', model: 'Business Projectors', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: ':' colon prefix' },
    { mfr: 'Optoma', model: 'Projectors', baud: 9600, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
    { mfr: 'BenQ', model: 'Projectors', baud: 115200, parity: 'N', data: 8, stop: 1, flow: 'None', cable: 'Straight-through', term: 'CR (0x0D)' },
  ]

  const terminators = [
    { name: 'CR', hex: '0x0D', dec: 13, desc: 'Carriage Return. Most common AV terminator — Extron SIS, most displays and projectors.' },
    { name: 'LF', hex: '0x0A', dec: 10, desc: 'Line Feed. Used by Biamp Tesira. Very common in IP-based protocols.' },
    { name: 'CR+LF', hex: '0x0D 0x0A', dec: '13 10', desc: 'Carriage Return + Line Feed. Some AMX devices, HTTP headers, Windows line endings.' },
    { name: 'STX/ETX', hex: '0x02 ... 0x03', dec: '2 ... 3', desc: 'Start of Text + End of Text framing. Used by Panasonic projectors.' },
    { name: 'None', hex: '—', dec: '—', desc: 'No terminator — command is a fixed-length binary packet. NEC, Sony BRAVIA.' },
    { name: 'Colon prefix', hex: '0x3A', dec: 58, desc: 'Commands start with a colon. Used by some Epson projectors.' },
  ]

  const calcBitTime = () => {
    const totalBits = 1 + baudCalc.bits + (baudCalc.parity !== 'N' ? 1 : 0) + baudCalc.stop
    const bitTime = (1 / baudCalc.baud) * 1000000
    const charTime = (totalBits / baudCalc.baud) * 1000000
    return { bitTime: bitTime.toFixed(2), charTime: charTime.toFixed(2), totalBits }
  }

  const filtered = termSearch
    ? deviceRef.filter(d => d.mfr.toLowerCase().includes(termSearch.toLowerCase()) || d.model.toLowerCase().includes(termSearch.toLowerCase()))
    : deviceRef

  const { bitTime, charTime, totalBits } = calcBitTime()

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    background: activeTab === tab ? '#1a1510' : 'transparent',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #00ff88' : '2px solid transparent',
    color: activeTab === tab ? '#00ff88' : '#444',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#d0d0d0', fontFamily: "'Courier New', monospace" }}>
      {/* Header */}
      <div style={{ background: '#080808', borderBottom: '1px solid #1a1a1a', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>⚡ AVCommand</a>
          <span style={{ color: '#222' }}>/</span>
          <span style={{ color: '#444', fontSize: 11, letterSpacing: 2 }}>Free Tools</span>
        </div>
        <a href="/" style={{ fontSize: 10, letterSpacing: 2, color: '#333', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to App</a>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#e0e0e0', fontWeight: 700, marginBottom: 8 }}>Free RS-232 Tools</h1>
        <p style={{ color: '#444', fontSize: 12, letterSpacing: 1, marginBottom: 32 }}>REFERENCE TOOLS FOR AV INTEGRATORS — NO SIGNUP REQUIRED</p>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: 32, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button style={tabStyle('baudref')} onClick={() => setActiveTab('baudref')}>Device Reference</button>
          <button style={tabStyle('baudcalc')} onClick={() => setActiveTab('baudcalc')}>Baud Calculator</button>
          <button style={tabStyle('terminators')} onClick={() => setActiveTab('terminators')}>Terminators</button>
          <button style={tabStyle('pinout')} onClick={() => setActiveTab('pinout')}>DB9 Pinout</button>
        </div>

        {/* Device Reference */}
        {activeTab === 'baudref' && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                value={termSearch}
                onChange={e => setTermSearch(e.target.value)}
                placeholder="Search manufacturer or model..."
                style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a1a', borderRadius: 6, color: '#d0d0d0', fontFamily: "'Courier New', monospace", fontSize: 13, outline: 'none' }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#0d0d0d' }}>
                    {['Manufacturer','Model','Baud','8N1','Flow','Cable','Protocol/Term'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#00ff88', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                      <td style={{ padding: '9px 12px', color: '#e0e0e0', borderBottom: '1px solid #111' }}>{d.mfr}</td>
                      <td style={{ padding: '9px 12px', color: '#888', borderBottom: '1px solid #111' }}>{d.model}</td>
                      <td style={{ padding: '9px 12px', color: '#00ff88', borderBottom: '1px solid #111' }}>{d.baud}</td>
                      <td style={{ padding: '9px 12px', color: '#666', borderBottom: '1px solid #111' }}>8N1</td>
                      <td style={{ padding: '9px 12px', color: '#666', borderBottom: '1px solid #111' }}>{d.flow}</td>
                      <td style={{ padding: '9px 12px', color: '#666', borderBottom: '1px solid #111', fontSize: 11 }}>{d.cable}</td>
                      <td style={{ padding: '9px 12px', color: '#888', borderBottom: '1px solid #111', fontSize: 11 }}>{d.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Baud Calculator */}
        {activeTab === 'baudcalc' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 8 }}>Baud Rate</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[9600, 19200, 38400, 57600, 115200].map(b => (
                    <button key={b} onClick={() => setBaudCalc({...baudCalc, baud: b})}
                      style={{ padding: '6px 14px', background: baudCalc.baud === b ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${baudCalc.baud === b ? '#00ff88' : '#1a1a1a'}`, borderRadius: 4, color: baudCalc.baud === b ? '#00ff88' : '#444', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 8 }}>Data Bits</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[7, 8].map(b => (
                    <button key={b} onClick={() => setBaudCalc({...baudCalc, bits: b})}
                      style={{ padding: '6px 14px', background: baudCalc.bits === b ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${baudCalc.bits === b ? '#00ff88' : '#1a1a1a'}`, borderRadius: 4, color: baudCalc.bits === b ? '#00ff88' : '#444', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 8 }}>Parity</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['N','E','O'].map(p => (
                    <button key={p} onClick={() => setBaudCalc({...baudCalc, parity: p})}
                      style={{ padding: '6px 14px', background: baudCalc.parity === p ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${baudCalc.parity === p ? '#00ff88' : '#1a1a1a'}`, borderRadius: 4, color: baudCalc.parity === p ? '#00ff88' : '#444', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                      {p === 'N' ? 'None' : p === 'E' ? 'Even' : 'Odd'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 8 }}>Stop Bits</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2].map(s => (
                    <button key={s} onClick={() => setBaudCalc({...baudCalc, stop: s})}
                      style={{ padding: '6px 14px', background: baudCalc.stop === s ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${baudCalc.stop === s ? '#00ff88' : '#1a1a1a'}`, borderRadius: 4, color: baudCalc.stop === s ? '#00ff88' : '#444', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#00ff88', textTransform: 'uppercase', marginBottom: 20 }}>Calculated Values</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Config String</div>
                <div style={{ fontSize: 22, color: '#e0e0e0' }}>{baudCalc.baud} {baudCalc.bits}{baudCalc.parity}{baudCalc.stop}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Bit Time</div>
                <div style={{ fontSize: 22, color: '#00ff88' }}>{bitTime} µs</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Character Time ({totalBits} bits)</div>
                <div style={{ fontSize: 22, color: '#00ff88' }}>{charTime} µs</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Max Characters/Second</div>
                <div style={{ fontSize: 22, color: '#e0e0e0' }}>{Math.floor(baudCalc.baud / totalBits)}</div>
              </div>
              <div style={{ padding: '12px 14px', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 6, fontSize: 11, color: '#444', lineHeight: 1.7 }}>
                {baudCalc.parity !== 'N' ? '⚠ Most AV devices use No Parity (N). Verify your device requires parity.' : '✓ Standard 8N1 — compatible with most AV devices'}
              </div>
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Baud Rate Reference</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr><th style={{ padding: '8px 12px', textAlign: 'left', color: '#00ff88', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>Baud Rate</th><th style={{ padding: '8px 12px', textAlign: 'left', color: '#00ff88', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>Common Use</th></tr>
                </thead>
                <tbody>
                  {baudPresets.map((b, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                      <td style={{ padding: '8px 12px', color: b.baud === 9600 ? '#00ff88' : '#888', fontWeight: b.baud === 9600 ? 700 : 400, borderBottom: '1px solid #111' }}>{b.baud}</td>
                      <td style={{ padding: '8px 12px', color: '#555', borderBottom: '1px solid #111' }}>{b.common}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Terminators */}
        {activeTab === 'terminators' && (
          <div>
            {terminators.map((t, i) => (
              <div key={i} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, color: '#e0e0e0', fontWeight: 700, minWidth: 80 }}>{t.name}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: '#00ff88', background: 'rgba(0,255,136,0.06)', padding: '2px 10px', borderRadius: 4, border: '1px solid rgba(0,255,136,0.15)' }}>{t.hex}</span>
                  <span style={{ fontSize: 11, color: '#333' }}>decimal: {t.dec}</span>
                </div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* DB9 Pinout */}
        {activeTab === 'pinout' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#00ff88', textTransform: 'uppercase', marginBottom: 16 }}>DB9 Pin Reference</div>
              {[
                [1,'DCD','Data Carrier Detect','Rarely used in AV'],
                [2,'RXD','Receive Data','Receives data FROM device'],
                [3,'TXD','Transmit Data','Sends data TO device'],
                [4,'DTR','Data Terminal Ready','Sometimes needed for handshaking'],
                [5,'GND','Signal Ground','Required — always connect'],
                [6,'DSR','Data Set Ready','Rarely used in AV'],
                [7,'RTS','Request to Send','Hardware flow control — usually not needed'],
                [8,'CTS','Clear to Send','Hardware flow control — usually not needed'],
                [9,'RI','Ring Indicator','Not used in AV'],
              ].map(([pin, abbr, name, note]) => (
                <div key={pin} style={{ display: 'grid', gridTemplateColumns: '28px 48px 1fr', gap: 10, padding: '7px 0', borderBottom: '1px solid #111', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, color: [2,3,5].includes(pin) ? '#00ff88' : '#333', fontWeight: 700 }}>{pin}</div>
                  <div style={{ fontSize: 11, color: [2,3,5].includes(pin) ? '#e0e0e0' : '#555', fontFamily: "'Courier New', monospace" }}>{abbr}</div>
                  <div>
                    <div style={{ fontSize: 12, color: [2,3,5].includes(pin) ? '#888' : '#333' }}>{name}</div>
                    <div style={{ fontSize: 10, color: '#333', marginTop: 2 }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#00ff88', textTransform: 'uppercase', marginBottom: 16 }}>Straight-Through Cable</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Used by most AV devices: Extron, Panasonic, Sony (with adapter), Kramer, Samsung, LG</div>
                {[[2,2,'RXD→RXD'],[3,3,'TXD→TXD'],[5,5,'GND→GND']].map(([a,b,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid #111', fontSize: 12 }}>
                    <span style={{ color: '#00ff88', minWidth: 24 }}>Pin {a}</span>
                    <span style={{ color: '#333' }}>────────</span>
                    <span style={{ color: '#00ff88', minWidth: 24 }}>Pin {b}</span>
                    <span style={{ color: '#555' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#00ff88', textTransform: 'uppercase', marginBottom: 16 }}>Null Modem (Crossover) Cable</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Required by NEC displays. TX and RX are swapped.</div>
                {[[2,3,'RXD→TXD'],[3,2,'TXD→RXD'],[5,5,'GND→GND']].map(([a,b,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid #111', fontSize: 12 }}>
                    <span style={{ color: '#00ff88', minWidth: 24 }}>Pin {a}</span>
                    <span style={{ color: '#c97b7b' }}>────────</span>
                    <span style={{ color: '#00ff88', minWidth: 24 }}>Pin {b}</span>
                    <span style={{ color: '#555' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 48, padding: 24, background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#e0e0e0', marginBottom: 8 }}>Need exact RS-232 commands for a specific device?</div>
          <div style={{ fontSize: 12, color: '#444', marginBottom: 16 }}>AVCommand generates command strings, serial settings, and Crestron SIMPL+ code for hundreds of AV devices instantly.</div>
          <a href="/" style={{ display: 'inline-block', padding: '10px 28px', background: '#00ff88', color: '#000', borderRadius: 6, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700 }}>Try AVCommand Free →</a>
        </div>
      </div>
    </div>
  )
}
