---
title: "Sony BRAVIA Professional Display RS-232 Commands: Complete Control Guide"
slug: "sony-display-rs232-commands"
date: "May 1, 2026"
description: "RS-232 control guide for Sony BRAVIA Professional displays. HEX command format, serial port settings, power control, input switching, and Crestron SIMPL+ examples."
tags: ["Sony", "BRAVIA", "RS-232", "Display", "Crestron"]
---

Sony BRAVIA Professional displays use a binary HEX protocol with a critical Standby Enable requirement that trips up most integrators on the first attempt.

---

## Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Cable Type | Straight-through (3.5mm adapter on BZ/BU series) |

---

## Critical: Standby Enable

Sony BRAVIA Professional displays will not respond to any RS-232 command — including Power On — until you send a Standby Enable command first.

**Standby Enable (HEX):** `8C 00 00 02 03 91`

Send this once after physical connection is established.

Also enable RS-232 control in the display menu: Settings → Professional → Advanced → RS-232C Control → On.

---

## Power Control

| Function | HEX Command |
|---|---|
| Standby Enable (send first) | `8C 00 00 02 03 91` |
| Power On | `8C 00 00 02 01 8F` |
| Power Off | `8C 00 00 02 00 8E` |
| Query Power | `83 00 00 FF FF 81` |

---

## Input Switching

| Function | HEX Command |
|---|---|
| HDMI 1 | `8C 00 02 03 00 03 94` |
| HDMI 2 | `8C 00 02 03 00 04 95` |
| HDMI 3 | `8C 00 02 03 00 05 96` |
| DisplayPort | `8C 00 02 03 00 0F A0` |

---

## Volume / Mute

| Function | HEX Command |
|---|---|
| Mute On | `8C 00 06 02 01 A5` |
| Mute Off | `8C 00 06 02 00 A4` |

---

## Common Mistakes

- **Not sending Standby Enable first** — the display ignores all commands including Power On until this is sent
- **Sending ASCII instead of HEX** — all Sony commands are binary bytes
- **Not waiting after power on** — wait at least 20 seconds before sending other commands
- **3.5mm cable on newer models** — BZ and BU series use a 3.5mm jack. Tip=TX, Ring=RX, Sleeve=GND
---

## Related Guides

- [Panasonic Projector RS-232 Commands](/blog/panasonic-projector-rs232-commands)
- [Extron RS-232 Control Guide — SIS Protocol](/blog/extron-rs232-commands)
- [Sony BRAVIA Professional RS-232 Commands]- [NEC Display RS-232 Commands](/blog/nec-display-rs232-commands)
- [Kramer Switcher RS-232 Commands — Protocol 2000 & 3000](/blog/kramer-switcher-rs232-commands)
- [Crestron SIMPL+ Serial Control Guide](/blog/crestron-simpl-plus-serial-control)
- [Biamp Tesira RS-232 and Telnet Control](/blog/biamp-tesira-rs232-commands)
- [QSC Q-SYS External Control Protocol](/blog/qsc-qsys-external-control)
- [AMX NetLinx Serial Control Guide](/blog/amx-netlinx-serial-control)
- [RS-232 vs IP Control in Commercial AV](/blog/rs232-vs-ip-control)
- [Crestron vs AMX vs Extron: Control System Comparison](/blog/crestron-vs-amx-vs-extron)

---

## Free RS-232 Tools

Baud rate reference, device settings table, terminator guide, and DB9 pinout — all free, no signup required.

[Open Free RS-232 Tools →](https://av-command.com/tools)

---

## Generate RS-232 Commands Instantly

Need exact command strings for a device not covered here? **[AV-Command](https://av-command.com)** includes free RS-232 troubleshooting checklists and a free tools reference — no signup required. The AI Assistant generates exact command strings, serial port settings, and Crestron SIMPL+ code for hundreds of devices instantly.

[Try AV-Command Free — upgrade anytime for AI commands →](https://av-command.com)
