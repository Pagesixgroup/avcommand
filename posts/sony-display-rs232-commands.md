---
title: "Sony BRAVIA Professional Display RS-232 Commands: Complete Control Guide"
slug: "sony-display-rs232-commands"
date: "May 1, 2026"
description: "RS-232 control guide for Sony BRAVIA Professional displays. HEX command format, serial port settings, power control, input switching, and Crestron SIMPL+ examples."
tags: ["Sony", "BRAVIA", "RS-232", "Display", "Crestron"]
---

Sony BRAVIA Professional displays are a staple of corporate AV — reliable, high quality, and well-supported. But their RS-232 protocol trips up integrators who expect plain ASCII commands. Sony uses a binary HEX protocol with checksums, which is more complex than Extron SIS or even Panasonic's STX/ETX format.

This guide covers the serial port settings, command structure, most commonly used commands, and the critical Standby Enable requirement that blocks most integrators on their first attempt.

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

**Note:** Newer BRAVIA BZ and BU series models use a 3.5mm stereo mini jack for RS-232 instead of a standard DB9. You will need a 3.5mm to DB9 adapter cable. Pin assignments: Tip = TX, Ring = RX, Sleeve = GND.

---

## Command Format

Sony BRAVIA Professional uses a binary HEX protocol. All commands must be sent as raw HEX bytes, not ASCII text. The command structure is:

Header + Category + Function + Data Length + Data + Checksum

The checksum is calculated by summing all bytes after the header and taking the lower 8 bits.

Sony responds with an ANSWER packet starting with 0x70.

---

## Critical: Standby Enable Requirement

This is the most common gotcha with Sony BRAVIA Professional displays. Many models will not respond to ANY RS-232 command — including Power On — until you send a Standby Enable command first.

Standby Enable command (HEX): 8C 00 00 02 03 91

Send this once after physical connection. After that the display will accept power on and other commands even from standby.

**Also note:** After powering on, wait at least 20 seconds before sending input switch or other commands. Always wait for the ACK response before sending the next command, and maintain at least 500ms between commands.

---

## Power Control

All commands shown as HEX bytes:

| Function | HEX Command |
|---|---|
| Standby Enable | 8C 00 00 02 03 91 |
| Power On | 8C 00 00 02 01 8F |
| Power Off | 8C 00 00 02 00 8E |
| Query Power Status | 83 00 00 FF FF 81 |

Power On response (normal): 70 00 70
Power query response when on: 70 00 02 01 73
Power query response when off: 70 00 02 00 72

---

## Input Switching

| Function | HEX Command |
|---|---|
| HDMI 1 | 8C 00 02 03 00 03 94 |
| HDMI 2 | 8C 00 02 03 00 04 95 |
| HDMI 3 | 8C 00 02 03 00 05 96 |
| DisplayPort | 8C 00 02 03 00 0F A0 |
| Query Input | 83 00 02 FF FF 84 |

---

## Volume Control

| Function | HEX Command |
|---|---|
| Volume Up | 8C 00 05 02 01 A4 |
| Volume Down | 8C 00 05 02 00 A3 |
| Mute On | 8C 00 06 02 01 A5 |
| Mute Off | 8C 00 06 02 00 A4 |

---

## RS-232 Enable in Menu

Before RS-232 control will work, you must enable it in the display's menu:

Go to Settings, then Professional, then Advanced, then RS-232C Control, and set it to On or Via Serial Port. The exact menu path varies by model year.

---

## Crestron SIMPL+ Notes

In SIMPL+, define your commands as string parameters with the raw HEX bytes. Set your COM port to 9600 8N1 with no flow control. Because Sony uses binary HEX, you cannot use ASCII string parameters directly. Use hex notation in your string definitions and send the Standby Enable command in your module initialization routine before any other commands.

The acknowledgment from Sony is 3 bytes for control commands. Your receive handler should check that byte 0 is 0x70 and byte 1 is 0x00 to confirm success.

---

## AMX NetLinx Notes

In NetLinx, define your commands as constant arrays using the dollar sign hex notation. Send the Standby Enable once in a DEFINE_START block after device connection. Use a timeline or wait function to enforce the 500ms minimum interval between commands.

---

## Common Gotchas

- **Not sending Standby Enable first** — the display will ignore all commands including Power On until this is sent
- **Sending ASCII instead of HEX** — Sony commands are binary. Sending the text characters 8C will not work. You must send the actual byte 0x8C
- **Not waiting after power on** — wait at least 20 seconds after power on before sending other commands
- **Wrong cable on newer models** — BZ and BU series use a 3.5mm jack, not DB9. Tip=TX, Ring=RX, Sleeve=GND
- **RS-232C not enabled in menu** — must be enabled under Professional settings before any serial control works
- **Not waiting for ACK** — Sony requires acknowledgment before the next command. Send too fast and commands get dropped

---

## Quick Reference

| Task | HEX Command |
|---|---|
| Standby Enable (send first) | 8C 00 00 02 03 91 |
| Power On | 8C 00 00 02 01 8F |
| Power Off | 8C 00 00 02 00 8E |
| Query Power | 83 00 00 FF FF 81 |
| HDMI 1 | 8C 00 02 03 00 03 94 |
| HDMI 2 | 8C 00 02 03 00 04 95 |
| Mute On | 8C 00 06 02 01 A5 |
| Mute Off | 8C 00 06 02 00 A4 |

**Serial settings:** 9600 baud, 8N1, no flow control, straight-through cable

---

Always verify commands against your specific Sony model's RS-232C protocol documentation available on Sony's BRAVIA Professional developer portal.

---

## Related Guides

- [Panasonic Projector RS-232 Commands](/blog/panasonic-projector-rs232-commands)
- [Extron RS-232 Control Guide](/blog/extron-rs232-commands)
- [Sony BRAVIA Professional RS-232 Commands](/blog/sony-display-rs232-commands)
- [NEC Display RS-232 Commands](/blog/nec-display-rs232-commands)
- [Kramer Switcher RS-232 Commands](/blog/kramer-switcher-rs232-commands)
- [Crestron SIMPL+ Serial Control Guide](/blog/crestron-simpl-plus-serial-control)
- [Biamp Tesira RS-232 and Telnet Control](/blog/biamp-tesira-rs232-commands)
- [QSC Q-SYS External Control Protocol](/blog/qsc-qsys-external-control)
- [AMX NetLinx Serial Control Guide](/blog/amx-netlinx-serial-control)
- [RS-232 vs IP Control in Commercial AV](/blog/rs232-vs-ip-control)
- [Crestron vs AMX vs Extron Comparison](/blog/crestron-vs-amx-vs-extron)

---

## Generate RS-232 Commands Instantly

Need commands for a device not covered here? **AVCommand** generates RS-232 commands, serial port settings, and Crestron SIMPL+ code for hundreds of AV devices. [Try it free at av-command.com](https://av-command.com)
