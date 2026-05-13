import { useState, useRef, useEffect } from "react";

const CHECKLIST_DATA = {
  rs232: {
    title: "RS-232 Serial Control Troubleshooting",
    icon: "⚡",
    color: "#00ff88",
    sections: [
      {
        title: "Physical Layer",
        items: [
          "Verify cable is straight-through (not null modem/crossover) — most AV devices use straight-through",
          "Check DB9 pin assignments: Pin 2 (RX), Pin 3 (TX), Pin 5 (GND) — some devices swap 2/3",
          "Confirm cable is fully seated and screws tightened on both ends",
          "Test cable continuity with a multimeter (pin 2↔2, 3↔3, 5↔5)",
          "Inspect for bent or damaged pins in the DB9 connector",
          "Verify cable length is within spec (typically <15m/50ft at standard baud rates)",
          "Check if device uses DE9 (DB9) vs DB25 — confirm adapter if used"
        ]
      },
      {
        title: "Serial Port Settings",
        items: [
          "Match baud rate exactly to device spec (common: 9600, 19200, 38400, 115200)",
          "Verify data bits (almost always 8, occasionally 7)",
          "Confirm parity setting (None/Even/Odd — most AV devices use None)",
          "Check stop bits (almost always 1, occasionally 2)",
          "Disable hardware flow control (RTS/CTS) unless device explicitly requires it",
          "Disable software flow control (XON/XOFF) unless device explicitly requires it",
          "Confirm COM port number in Device Manager / system settings"
        ]
      },
      {
        title: "Command Format",
        items: [
          "Verify command terminator: CR (\\r / 0x0D), LF (\\n / 0x0A), CRLF, or none",
          "Check if commands are ASCII text vs. binary/HEX byte sequences",
          "Confirm correct capitalization — many protocols are case-sensitive",
          "Verify no extra spaces before/after command string",
          "Check if device requires a 'wake' or init command before accepting control",
          "Confirm correct command syntax from manufacturer protocol document (not third-party)",
          "Test with a known-good command first (e.g., power query) before complex commands"
        ]
      },
      {
        title: "Control System Side",
        items: [
          "Verify COM port is not claimed by another process or application",
          "Confirm control processor COM port is not set to RS-422 or RS-485 mode",
          "Check SIMPL/NetLinx/control code for correct port assignment",
          "Ensure serial module is initialized before sending commands",
          "Add appropriate delay after power-on before sending commands (typically 5–30 sec)",
          "Check that TX and RX signal logic is correct (not inverted)",
          "Verify 3-series Crestron COM port baud matches SIMPL Windows configuration"
        ]
      },
      {
        title: "Device Side",
        items: [
          "Confirm RS-232 control is enabled in device menu/settings",
          "Check if device requires RS-232 to be set to 'External Control' mode",
          "Verify device firmware version — some commands vary by firmware",
          "Confirm device is not locked to IR-only control mode",
          "Check if device has a separate RS-232 'Control' port vs. a 'Service' port",
          "Power cycle the device after changing RS-232 settings",
          "Check if device requires a specific warm-up period before accepting RS-232"
        ]
      }
    ]
  },
  network: {
    title: "IP / Network AV Control Troubleshooting",
    icon: "🌐",
    color: "#00aaff",
    sections: [
      {
        title: "Network Connectivity",
        items: [
          "Ping the device IP address from the control processor or PC",
          "Verify device IP, subnet mask, and gateway are correctly configured",
          "Confirm device and control system are on the same VLAN or routing is configured",
          "Check that the AV control VLAN has access to the device VLAN (firewall rules)",
          "Verify no IP address conflict — use ARP scan to check for duplicates",
          "Confirm device uses static IP or DHCP reservation (not dynamic DHCP)",
          "Check that the switch port is active and shows link (green LED)"
        ]
      },
      {
        title: "Telnet / TCP Control",
        items: [
          "Verify Telnet is enabled on the device (often disabled by default)",
          "Confirm correct TCP port number (Telnet typically 23, but varies by device)",
          "Test connection manually: telnet <ip> <port> from a PC",
          "Check if device requires login credentials after Telnet connection",
          "Verify device doesn't close connection after period of inactivity",
          "Confirm command format and terminators match IP protocol spec (may differ from RS-232)",
          "Check if device requires 'keep-alive' polling to maintain connection"
        ]
      },
      {
        title: "REST / HTTP API Control",
        items: [
          "Verify API is enabled in device web interface",
          "Confirm correct HTTP method (GET, POST, PUT) for each command",
          "Check authentication method (Basic Auth, Bearer Token, API Key, Digest)",
          "Verify JSON payload format matches API documentation exactly",
          "Test API calls with Postman or curl before integrating into control system",
          "Check Content-Type header is set correctly (application/json)",
          "Confirm device SSL/TLS certificate is trusted or self-signed certs are allowed"
        ]
      }
    ]
  },
  display: {
    title: "Display / Projector Control Troubleshooting",
    icon: "📺",
    color: "#ff6600",
    sections: [
      {
        title: "Power Control",
        items: [
          "Verify display accepts commands in standby — some require power-on before responding",
          "Add 15–30 second delay after Power ON before sending input switch commands",
          "Confirm Power OFF command vs. Standby command — many displays have both",
          "Check if display has 'Quick Start' mode that changes power-on behavior",
          "Test power toggle vs. discrete power on/off commands",
          "Verify display doesn't require two 'power off' commands (some Panasonic/Sony)",
          "Confirm display control mode is set to RS-232C (not RS-232B or IR)"
        ]
      },
      {
        title: "Input Switching",
        items: [
          "Verify input number/name matches protocol exactly (HDMI1 vs HDMI 1 vs hdmi1)",
          "Confirm input is available/unlocked in display settings",
          "Check if auto-input switching is overriding control commands",
          "Verify EDID is present on the target input (display may ignore switch to empty input)",
          "Test each input command individually to identify which are responding",
          "Check if display requires signal present on input before switching to it",
          "Confirm input labels haven't been renamed in display OSD (some protocols use label)"
        ]
      },
      {
        title: "Projector-Specific",
        items: [
          "Allow full lamp warm-up before sending commands (30–60 seconds)",
          "Confirm shutter/blank is not engaged when troubleshooting no-image issues",
          "Check lens memory settings if motorized lens is not in expected position",
          "Verify lamp hours — some projectors limit RS-232 functionality near end-of-life",
          "Confirm projector is not in 'Eco Standby' mode that disables RS-232",
          "Check if projector requires 'Control System' mode enabled in network settings",
          "Verify cooling fan cycle completes before re-sending power-on command"
        ]
      }
    ]
  }
};

function generateChecklistHTML(key) {
  const data = CHECKLIST_DATA[key];
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  let itemCount = 0;
  data.sections.forEach(s => { itemCount += s.items.length; });

  const sectionsHTML = data.sections.map(section => `
    <div class="section">
      <h3>${section.title}</h3>
      <ul>
        ${section.items.map(item => `
          <li><span class="checkbox">☐</span><span>${item}</span></li>
        `).join("")}
      </ul>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.title} — AVCommand</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #e0e0e0; padding: 40px; }
  .header { border-bottom: 2px solid ${data.color}; padding-bottom: 20px; margin-bottom: 30px; }
  .brand { font-size: 11px; letter-spacing: 4px; color: ${data.color}; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 22px; color: #fff; font-weight: 700; margin-bottom: 6px; }
  .meta { font-size: 11px; color: #666; }
  .section { margin-bottom: 28px; }
  h3 { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: ${data.color}; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #222; }
  ul { list-style: none; }
  li { display: flex; gap: 12px; padding: 7px 0; border-bottom: 1px solid #1a1a1a; font-size: 12px; line-height: 1.5; }
  .checkbox { color: #444; flex-shrink: 0; font-size: 14px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #222; font-size: 10px; color: #444; letter-spacing: 2px; text-transform: uppercase; }
  @media print { body { background: #fff; color: #000; } h3 { color: #000; } .checkbox { color: #999; } }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">AVCommand — Professional AV Reference</div>
    <h1>${data.icon} ${data.title}</h1>
    <div class="meta">Generated ${date} · ${itemCount} checkpoints across ${data.sections.length} categories</div>
  </div>
  ${sectionsHTML}
  <div class="footer">AVCommand · For professional AV integrators</div>
</body>
</html>`;
}

const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, padding: "14px 18px", background: "rgba(255,255,255,0.04)", borderRadius: 12, width: "fit-content", border: "1px solid rgba(255,255,255,0.06)" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%", background: "#00ff88",
        animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`, opacity: 0.7
      }} />
    ))}
  </div>
);

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", margin: "10px 0", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,255,136,0.2)" }}>
      <div style={{ background: "rgba(0,255,136,0.06)", padding: "6px 12px", fontSize: 10, letterSpacing: 2, color: "#00ff88", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Command / Code</span>
        <button onClick={copy} style={{ background: "none", border: "none", color: copied ? "#00ff88" : "#555", cursor: "pointer", fontSize: 10, letterSpacing: 1 }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre style={{ padding: "12px 14px", fontSize: 12, lineHeight: 1.6, color: "#e0ffe0", background: "#0a0f0a", overflowX: "auto", margin: 0 }}>{code}</pre>
    </div>
  );
};

function renderMessage(text) {
  const parts = [];
  const codeRegex = /```[\s\S]*?```/g;
  let last = 0, match;
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", content: match[0].replace(/^```[^\n]*\n?/, "").replace(/```$/, "").trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts.map((p, i) => p.type === "code"
    ? <CodeBlock key={i} code={p.content} />
    : <span key={i} style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>
  );
}

const QUICK_PROMPTS = [
  "RS-232 commands to power on/off a Panasonic PT-MZ projector",
  "Serial port settings for Extron matrix switchers",
  "SIMPL+ module to control a display via RS-232",
  "Kramer VS switcher input switch commands",
  "How do I enable Telnet on an Extron DTP transmitter?",
  "Sony FWD display RS-232 command format",
];

const LicenseGate = ({ onUnlock }) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const verify = async () => {
    if (!key.trim()) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem("avc_license", key.trim());
        onUnlock();
      } else {
        setError(data.error || "Invalid license key. Purchase Pro access to continue.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
    setChecking(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", gap: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 14, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔒</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, letterSpacing: 3, color: "#fff", textTransform: "uppercase", marginBottom: 8 }}>Pro Access Required</div>
        <div style={{ fontSize: 13, color: "#555", maxWidth: 340, lineHeight: 1.65 }}>Enter your Gumroad license key to unlock the AI Assistant. Purchase Pro access to get your key.</div>
      </div>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verify()}
          placeholder="Paste your license key here..."
          style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e0e0e0", fontSize: 13, fontFamily: "'Courier New', monospace", outline: "none" }}
        />
        {error && <div style={{ fontSize: 11, color: "#ff5555", fontFamily: "'Courier New', monospace", letterSpacing: 1 }}>{error}</div>}
        <button onClick={verify} disabled={!key.trim() || checking} style={{
          padding: "12px", background: key.trim() && !checking ? "#00ff88" : "#1a1a1a",
          border: "none", borderRadius: 8, cursor: key.trim() && !checking ? "pointer" : "default",
          color: key.trim() && !checking ? "#000" : "#333", fontFamily: "'Courier New', monospace",
          fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700
        }}>{checking ? "Verifying..." : "Unlock AI Assistant"}</button>
      </div>
      <a href="https://avcommand.gumroad.com/l/AV-Command-Pro" target="_blank" style={{
        fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 2,
        color: "#00ff88", textDecoration: "none", textTransform: "uppercase",
        padding: "8px 18px", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 6
      }}>Get Pro Access — $5.99/mo →</a>
    </div>
  );
};

export default function AVCommandAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "AVCommand online. I can generate RS-232 command strings, look up serial settings for specific devices, build Crestron SIMPL+ or AMX NetLinx control snippets, and help troubleshoot serial control issues.\n\nTell me the device make/model and what you need to control."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [licensed, setLicensed] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("avc_license");
    if (saved) setLicensed(true);
    if (window.location.hash === "#downloads") {
      setActiveTab("resources");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const storedKey = localStorage.getItem("avc_license") || "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          licenseKey: storedKey
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}. Please try again.` }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const downloadChecklist = (key) => {
    const html = generateChecklistHTML(key);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AVCommand-${key}-checklist.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "100vh", background: "#080808", color: "#e0e0e0", fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        textarea:focus { outline: none; }
        .tab-btn:hover { background: rgba(255,255,255,0.05) !important; }
        .quick-btn:hover { background: rgba(0,255,136,0.08) !important; border-color: rgba(0,255,136,0.4) !important; }
        .dl-btn:hover { opacity: 0.85 !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a0a0a", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#fff", textTransform: "uppercase" }}>AVCommand</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#00ff88", textTransform: "uppercase", opacity: 0.7 }}>RS-232 · Serial Control · AV Integration</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
          <span style={{ fontSize: 9, letterSpacing: 2, color: "#00ff88", textTransform: "uppercase" }}>Online</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a", flexShrink: 0 }}>
        <button className="tab-btn" onClick={() => setActiveTab("resources")} style={{
          padding: "12px 24px", background: "none", border: "none", cursor: "pointer",
          fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
          color: activeTab === "resources" ? "#00ff88" : "#555",
          borderBottom: activeTab === "resources" ? "2px solid #00ff88" : "2px solid transparent",
          transition: "all 0.15s", fontFamily: "'Courier New', monospace"
        }}>⬇ Downloads</button>
        <button className="tab-btn" onClick={() => setActiveTab("chat")} style={{
          padding: "12px 24px", background: "none", border: "none", cursor: "pointer",
          fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
          color: activeTab === "chat" ? "#00ff88" : "#444",
          borderBottom: activeTab === "chat" ? "2px solid #00ff88" : "2px solid transparent",
          transition: "all 0.15s", fontFamily: "'Courier New', monospace",
          display: "flex", alignItems: "center", gap: 6
        }}>{licensed ? "▸ AI Assistant" : "🔒 AI Assistant"} {!licensed && <span style={{fontSize:8, color:"#00ff88", border:"1px solid rgba(0,255,136,0.3)", padding:"2px 6px", borderRadius:10, letterSpacing:2}}>PRO</span>}</button>
        <a href="/blog" target="_blank" style={{ padding: "12px 20px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "#444", borderBottom: "2px solid transparent", fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>📝 Blog</a>
        <a href="/landing.html#newsletter" target="_blank" style={{ padding: "12px 20px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "#444", borderBottom: "2px solid transparent", fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>✉ Newsletter</a>
        <a href="/tools" target="_blank" style={{ padding: "12px 20px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "#444", borderBottom: "2px solid transparent", fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>🔧 Free Tools</a>
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && !licensed && <LicenseGate onUnlock={() => setLicensed(true)} />}
      {activeTab === "chat" && licensed && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #111", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} className="quick-btn" onClick={() => sendMessage(p)} style={{
                flexShrink: 0, padding: "5px 12px", background: "rgba(0,255,136,0.04)",
                border: "1px solid rgba(0,255,136,0.15)", borderRadius: 20, cursor: "pointer",
                fontSize: 10, color: "#888", letterSpacing: 0.5, whiteSpace: "nowrap",
                transition: "all 0.15s", fontFamily: "'Courier New', monospace"
              }}>{p}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.2s ease" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>⚡</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: 12, fontSize: 13, lineHeight: 1.65,
                  background: m.role === "user" ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.04)",
                  border: m.role === "user" ? "1px solid rgba(0,255,136,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  color: m.role === "user" ? "#c0ffd8" : "#d0d0d0"
                }}>
                  {renderMessage(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 12, animation: "fadeIn 0.2s ease" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "14px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Enter device make/model or describe what you need to control..."
                rows={1}
                style={{ flex: 1, background: "none", border: "none", color: "#e0e0e0", fontSize: 13, fontFamily: "'Courier New', monospace", resize: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto" }}
                onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                width: 32, height: 32, borderRadius: 8,
                background: input.trim() && !loading ? "#00ff88" : "#1a1a1a",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                color: input.trim() && !loading ? "#000" : "#333",
                fontSize: 14, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>▸</button>
            </div>
            <div style={{ fontSize: 9, color: "#333", letterSpacing: 1, textAlign: "center", marginTop: 8, textTransform: "uppercase" }}>
              Enter to send · Shift+Enter for new line · Always verify against manufacturer documentation
            </div>
          </div>
        </div>
      )}

      {/* Downloads Tab */}
      {activeTab === "resources" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#00ff88", textTransform: "uppercase", marginBottom: 8 }}>Downloadable Resources</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Professional troubleshooting checklists. Download as HTML — print or save as PDF from your browser.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(CHECKLIST_DATA).map(([key, data]) => {
              const totalItems = data.sections.reduce((n, s) => n + s.items.length, 0);
              return (
                <div key={key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${data.color}15`, border: `1px solid ${data.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{data.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{data.title}</div>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>{data.sections.length} CATEGORIES · {totalItems} CHECKPOINTS</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        {data.sections.map(s => (
                          <span key={s.title} style={{ fontSize: 9, padding: "2px 7px", background: `${data.color}10`, border: `1px solid ${data.color}20`, borderRadius: 4, color: data.color, letterSpacing: 1, textTransform: "uppercase" }}>{s.title}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="dl-btn" onClick={() => downloadChecklist(key)} style={{
                    flexShrink: 0, padding: "10px 18px", background: `${data.color}15`,
                    border: `1px solid ${data.color}40`, borderRadius: 8, cursor: "pointer",
                    color: data.color, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                    fontFamily: "'Courier New', monospace", transition: "all 0.15s", whiteSpace: "nowrap"
                  }}>⬇ Download</button>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 32, padding: "18px 20px", background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#00ff88", textTransform: "uppercase", marginBottom: 8 }}>💡 Pro Tip</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>Use the AI Assistant to get device-specific RS-232 commands, then cross-reference with the troubleshooting checklists when commands aren't responding as expected. Most RS-232 issues come down to serial port settings mismatches or missing command terminators.</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <a href="/blog" target="_blank" style={{ fontSize: 9, letterSpacing: 2, color: "#444", textDecoration: "none", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>Blog</a>
          <a href="/landing.html#newsletter" target="_blank" style={{ fontSize: 9, letterSpacing: 2, color: "#444", textDecoration: "none", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>Newsletter</a>
          <a href="/tools" target="_blank" style={{ fontSize: 9, letterSpacing: 2, color: "#444", textDecoration: "none", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>Free Tools</a>
          <a href="mailto:hello@av-command.com" style={{ fontSize: 9, letterSpacing: 2, color: "#444", textDecoration: "none", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>Contact</a>
          <a href="/landing.html" target="_blank" style={{ fontSize: 9, letterSpacing: 2, color: "#444", textDecoration: "none", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>About</a>
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: "#222", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>⚡ AVCommand</div>
      </div>
    </div>
  );
}
