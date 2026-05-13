---
title: "Kramer Switcher RS-232 Commands: Protocol 2000 and Protocol 3000 Guide"
slug: "kramer-switcher-rs232-commands"
date: "May 1, 2026"
description: "RS-232 control guide for Kramer matrix switchers. Covers both Protocol 2000 (HEX) and Protocol 3000 (ASCII) with serial settings, routing commands, and Crestron examples."
tags: ["Kramer", "RS-232", "Matrix Switcher", "Protocol 3000", "Crestron"]
---

Kramer switchers use two completely different RS-232 protocols depending on generation — Protocol 2000 (binary HEX, older) and Protocol 3000 (ASCII, newer). Using the wrong protocol results in no response.

---

## How to Tell Which Protocol Your Device Uses

**Protocol 3000 (ASCII):** Used on most Kramer products from ~2010 onwards. The manual shows commands like ROUTE, INFO, or MODEL. Baud rate is typically 115200.

**Protocol 2000 (HEX):** Used on older matrix switchers. The manual shows HEX byte tables. Baud rate is typically 9600.

---

## Protocol 3000 — Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | **115200** |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Terminator | CR (0x0D) |

---

## Protocol 3000 — Commands

| Function | Command |
|---|---|
| Route Input 1 to Output 1 (video) | `#ROUTE 1,1,1 + CR` |
| Route Input 2 to Output 3 (video) | `#ROUTE 1,3,2 + CR` |
| Query routing | `#ROUTE? 1,1 + CR` |
| Device info | `#INFO + CR` |
| Lock front panel | `#LOCK-FP 1 + CR` |

Format: `#ROUTE Layer,Output,Input` where Layer 1 = video, Layer 2 = audio.

---

## Protocol 2000 — Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |

---

## Protocol 2000 — Commands (HEX)

| Function | HEX Bytes |
|---|---|
| Route Video In1 to Out1 | `01 01 01 81` |
| Route Video In2 to Out3 | `01 02 03 81` |
| Route Video In1 to All | `01 01 00 81` |

---

## Crestron SIMPL+ — Protocol 3000

```
STRING_PARAMETER SP_Route_1_1[14] = "#ROUTE 1,1,1\x0D";
STRING_PARAMETER SP_Route_2_1[14] = "#ROUTE 1,1,2\x0D";
STRING_PARAMETER SP_Info[8]       = "#INFO \x0D";

DIGITAL_INPUT Input1, Input2;
STRING_OUTPUT TX$;

PUSH Input1 { TX$ = SP_Route_1_1; }
PUSH Input2 { TX$ = SP_Route_2_1; }
```

Set COM port to **115200 baud** for Protocol 3000.

---

## Common Mistakes

- **Wrong baud rate** — Protocol 3000 uses 115200, not 9600. This is the most common mistake
- **Wrong protocol for device** — check the manual before writing code
- **Missing layer parameter** in ROUTE command — Layer 1 = video, Layer 2 = audio
---

## Related Guides

- [Panasonic Projector RS-232 Commands](/blog/panasonic-projector-rs232-commands)
- [Extron RS-232 Control Guide — SIS Protocol](/blog/extron-rs232-commands)
- [Sony BRAVIA Professional RS-232 Commands](/blog/sony-display-rs232-commands)
- [NEC Display RS-232 Commands](/blog/nec-display-rs232-commands)
- [Kramer Switcher RS-232 Commands — Protocol 2000 & 3000]- [Crestron SIMPL+ Serial Control Guide](/blog/crestron-simpl-plus-serial-control)
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
