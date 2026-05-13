---
title: "Extron RS-232 Control Guide: SIS Commands for Switchers and Displays"
slug: "extron-rs232-commands"
date: "May 1, 2026"
description: "Complete guide to Extron SIS RS-232 commands for matrix switchers and displays. Serial port settings, input switching, status queries, and Crestron SIMPL+ examples."
tags: ["Extron", "RS-232", "SIS", "Matrix Switcher", "Crestron"]
---

Extron's Simple Instruction Set (SIS) is one of the most integrator-friendly RS-232 protocols in commercial AV. Unlike Panasonic's STX/ETX framing or Sony's binary HEX protocol, Extron SIS commands are plain ASCII text you can type directly from a keyboard. Once you learn a handful of commands, they work across most Extron products.

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
| Terminator | CR (0x0D) |

---

## SIS Command Format

Extron SIS commands are plain ASCII with a carriage return terminator. The device responds with a status message followed by CR+LF. If an invalid command is sent, Extron returns an error code like E01 (invalid input number) or E13 (invalid command).

---

## Power Control

| Function | Command |
|---|---|
| Power On | `< + CR` |
| Power Off | `> + CR` |
| Query Status | `I + CR` |

---

## Input Switching

Single-output switchers:

| Function | Command |
|---|---|
| Switch to Input 1 | `1! + CR` |
| Switch to Input 2 | `2! + CR` |
| Query Current Input | `I + CR` |

Matrix switchers (tie input to output):

| Function | Command |
|---|---|
| Tie Input 1 to Output 1 | `1*1! + CR` |
| Tie Input 2 to Output 3 | `2*3! + CR` |
| Tie Input 1 to All Outputs | `1*0! + CR` |
| Disconnect Output 2 | `0*2! + CR` |
| Query All Ties | `0LS + CR` |

---

## Video Mute

| Function | Command |
|---|---|
| Video Mute On | `B + CR` |
| Video Mute Off | `b + CR` (lowercase) |
| Audio Mute On | `Z + CR` |
| Audio Mute Off | `z + CR` (lowercase) |

---

## Crestron SIMPL+ Example

```
STRING_PARAMETER SP_PowerOn[3]  = "<\x0D";
STRING_PARAMETER SP_PowerOff[3] = ">\x0D";
STRING_PARAMETER SP_Input1[4]   = "1!\x0D";
STRING_PARAMETER SP_Input2[4]   = "2!\x0D";

DIGITAL_INPUT PowerOn, PowerOff, Input1, Input2;
STRING_OUTPUT TX$;

PUSH PowerOn  { TX$ = SP_PowerOn; }
PUSH PowerOff { TX$ = SP_PowerOff; }
PUSH Input1   { TX$ = SP_Input1; }
PUSH Input2   { TX$ = SP_Input2; }
```

---

## Common Mistakes

- **Forgetting the CR terminator** — without it the device waits and never executes
- **Using wrong cable** — Extron uses straight-through, not null modem
- **Not reading the response** — Extron ACKs every command. Send too fast and the buffer fills, dropping commands silently
- **Front panel lockout** — some Extron products have a lock mode that also blocks RS-232
---

## Related Guides

- [Panasonic Projector RS-232 Commands](/blog/panasonic-projector-rs232-commands)
- [Extron RS-232 Control Guide — SIS Protocol]- [Sony BRAVIA Professional RS-232 Commands](/blog/sony-display-rs232-commands)
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
