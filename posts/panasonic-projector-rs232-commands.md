---
title: "Panasonic Projector RS-232 Commands: The Complete Control Guide"
slug: "panasonic-projector-rs232-commands"
date: "April 30, 2026"
description: "Complete RS-232 command reference for Panasonic projectors including serial port settings, power control, input switching, and Crestron SIMPL+ examples."
tags: ["Panasonic", "RS-232", "Projector", "Crestron"]
---

If you've ever spent 20 minutes hunting through a Panasonic projector manual just to find the power-on command, this guide is for you.

Panasonic projectors are some of the most widely deployed in commercial AV. Their RS-232 protocol has a few quirks that catch integrators off guard — especially the STX/ETX framing and the post-power-on delay requirement.

---

## Serial Port Settings

Before sending a single command, get these right. Mismatched settings are the number one cause of RS-232 failures.

| Parameter | Value |
|---|---|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Cable Type | Straight-through (not null modem) |

---

## Command Format

This is where most integrators get tripped up. Panasonic RS-232 commands use STX/ETX framing — not a simple CR or LF terminator like most other AV devices.

The format is: STX + ID + Command + ETX

Where STX is 0x02, ID is ADZZ (all projectors), and ETX is 0x03.

So the Power On command looks like this in ASCII: .ADZZ;PON.

Or in hex: 02 41 44 5A 5A 3B 50 4F 4E 03

**Important:** If you are used to sending PON with a carriage return to a Sony or NEC display, that will not work here. The STX and ETX bytes are required.

---

## Power Control

| Function | Command (hex) |
|---|---|
| Power On | 02 41 44 5A 5A 3B 50 4F 4E 03 |
| Power Off | 02 41 44 5A 5A 3B 50 4F 46 03 |
| Query Power Status | 02 41 44 5A 5A 3B 51 50 57 03 |

**Critical timing note:** After sending Power On, do NOT send any other commands for at least 10 to 30 seconds while the lamp warms up. Always use QPW (Query Power) to confirm the projector is fully on before proceeding.

---

## Input Switching

| Function | Command |
|---|---|
| HDMI 1 | ADZZ;IIS:HD1 (wrapped in STX/ETX) |
| HDMI 2 | ADZZ;IIS:HD2 (wrapped in STX/ETX) |
| DVI | ADZZ;IIS:DVI (wrapped in STX/ETX) |
| VGA/RGB | ADZZ;IIS:RG1 (wrapped in STX/ETX) |
| SDI | ADZZ;IIS:SD1 (wrapped in STX/ETX) |
| Query Input | ADZZ;QIN (wrapped in STX/ETX) |

---

## Shutter and Blank Control

| Function | Command |
|---|---|
| Blank On (Shutter Close) | ADZZ;OSH:1 (wrapped in STX/ETX) |
| Blank Off (Shutter Open) | ADZZ;OSH:0 (wrapped in STX/ETX) |
| Query Shutter | ADZZ;QSH (wrapped in STX/ETX) |

---

## Audio Control

| Function | Command |
|---|---|
| Mute On | ADZZ;OAM:1 (wrapped in STX/ETX) |
| Mute Off | ADZZ;OAM:0 (wrapped in STX/ETX) |
| Volume Up | ADZZ;VU (wrapped in STX/ETX) |
| Volume Down | ADZZ;VD (wrapped in STX/ETX) |

---

## Crestron SIMPL+ Notes

In SIMPL+, define your strings with the STX and ETX bytes explicitly using hex notation. Set your COM port to 9600 baud, 8 data bits, no parity, 1 stop bit, and no flow control. Send each command as a String_Output and wait for the acknowledgment response before sending the next command.

---

## AMX NetLinx Notes

In NetLinx, define your constants using the $02 and $03 syntax for the STX and ETX bytes. Use SEND_STRING to transmit to the device port. Set the baud rate in your DEFINE_DEVICE section to 9600,8,1,N.

---

## Common Gotchas

- **Forgetting STX/ETX framing** — PON alone will not work. The command must be wrapped in 0x02 and 0x03
- **Sending commands too soon after power on** — the projector ignores all commands for 10 to 60 seconds after the lamp starts lighting
- **Not waiting for acknowledgment** — Panasonic returns a 3-byte ACK for each command. Send commands back to back and some will get dropped
- **Wrong cable type** — use a straight-through cable, not a null modem cable
- **RS-232 not enabled in projector menu** — some models default to IR-only control. Enable RS-232C in the on-screen menu
- **Case sensitivity** — PON works. pon does not

---

## Need Commands for a Different Device?

AVCommand generates RS-232 command strings, serial port settings, and Crestron SIMPL+ code for hundreds of AV devices instantly. Describe what you need in plain English and get exact commands ready to use.
