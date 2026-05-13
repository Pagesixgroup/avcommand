---
title: "Panasonic Projector RS-232 Commands: Complete Control Guide"
slug: "panasonic-projector-rs232-commands"
date: "May 1, 2026"
description: "Complete RS-232 control guide for Panasonic PT series projectors. Serial port settings, power commands, input switching, shutter control, and Crestron SIMPL+ examples."
tags: ["Panasonic", "Projector", "RS-232", "Crestron", "AMX"]
---

Panasonic PT series projectors use a well-documented RS-232 protocol with STX/ETX framing. Once you understand the packet structure, the same format works across the entire PT series — PT-RZ, PT-MZ, PT-VZ, and most other commercial Panasonic models.

---

## Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Cable Type | Straight-through |

---

## Command Format

Panasonic uses STX/ETX framing:

`0x02` + Command + `0x03`

STX (0x02) starts the command, ETX (0x03) ends it. The command itself is plain ASCII text between these bytes.

---

## Power Control

| Function | Command |
|---|---|
| Power On | `0x02 PON 0x03` |
| Power Off | `0x02 POF 0x03` |
| Query Power | `0x02 QPW 0x03` |

Power On response: `0x02 PON 0x03`
Power query response when on: `0x02 001 0x03`
Power query response when off: `0x02 000 0x03`

Wait at least 30 seconds after Power On before sending other commands while the lamp warms up.

---

## Input Switching

| Function | Command |
|---|---|
| HDMI 1 | `0x02 IIS:HD1 0x03` |
| HDMI 2 | `0x02 IIS:HD2 0x03` |
| DisplayPort | `0x02 IIS:DP1 0x03` |
| DVI | `0x02 IIS:DV1 0x03` |
| VGA (Computer 1) | `0x02 IIS:RG1 0x03` |
| Query Input | `0x02 QIN 0x03` |

---

## Shutter Control

| Function | Command |
|---|---|
| Shutter Close (blank) | `0x02 OSH:1 0x03` |
| Shutter Open | `0x02 OSH:0 0x03` |
| Query Shutter | `0x02 QSH 0x03` |

---

## Freeze

| Function | Command |
|---|---|
| Freeze On | `0x02 OFZ:1 0x03` |
| Freeze Off | `0x02 OFZ:0 0x03` |

---

## Crestron SIMPL+ Example

```
STRING_PARAMETER SP_PowerOn[6]  = "\x02PON\x03";
STRING_PARAMETER SP_PowerOff[6] = "\x02POF\x03";
STRING_PARAMETER SP_HDMI1[10]   = "\x02IIS:HD1\x03";
STRING_PARAMETER SP_Query[6]    = "\x02QPW\x03";

DIGITAL_INPUT PowerOn, PowerOff, Input_HDMI1;
STRING_OUTPUT TX$;

PUSH PowerOn  { TX$ = SP_PowerOn; }
PUSH PowerOff { TX$ = SP_PowerOff; }
PUSH Input_HDMI1 { TX$ = SP_HDMI1; }
```

---

## Common Mistakes

- **Forgetting STX/ETX** — sending plain ASCII without the framing bytes results in no response
- **Not waiting after power on** — send commands too soon and the projector ignores them while the lamp starts
- **Wrong input code** — input codes vary slightly between PT series models. Always verify against your specific model's RS-232 documentation
- **RS-232 not enabled** — some Panasonic models require enabling serial control in the projector's menu under Network/Serial settings
---

## Related Guides

- [Panasonic Projector RS-232 Commands]- [Extron RS-232 Control Guide — SIS Protocol](/blog/extron-rs232-commands)
- [Sony BRAVIA Professional RS-232 Commands](/blog/sony-display-rs232-commands)
- [NEC Display RS-232 Commands](/blog/nec-display-rs232-commands)
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
