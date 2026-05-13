---
title: "Biamp Tesira RS-232 and Telnet Control: Complete Command Reference"
slug: "biamp-tesira-rs232-commands"
date: "May 13, 2026"
description: "Complete Biamp Tesira serial and Telnet control reference for AV integrators. Device attribute commands, instance tags, feedback parsing, and Crestron SIMPL+ examples."
tags: ["Biamp", "Tesira", "RS-232", "Telnet", "DSP", "Crestron"]
---

Biamp Tesira DSPs are among the most common audio processors in commercial AV, and their control protocol is one of the more unusual ones integrators encounter. Unlike Extron's plain ASCII SIS or Sony's binary HEX, Tesira uses a text-based command language built around instance tags and attribute codes — the same model whether you're communicating over RS-232 or Telnet.

This guide covers the command structure, the most commonly used commands, feedback handling, and Crestron SIMPL+ implementation patterns.

---

## Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 115200 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Terminator | Line Feed (0x0A) |

**Important:** Tesira uses Line Feed (LF, 0x0A) as the command terminator — not the Carriage Return (0x0D) that most AV devices use. Sending CR instead of LF means commands will never execute. This is the single most common Tesira integration mistake.

**Telnet:** Port 23. The command syntax is identical over Telnet and RS-232. Most installations use Telnet since Tesira devices are always on the network anyway.

---

## Command Structure

Tesira commands follow this format:

```
INSTANCETAG set/get ATTRIBUTECODE [INDEX1] [INDEX2] [VALUE]
```

- **INSTANCETAG** — the name assigned to the block in Tesira software (e.g. "LevelControl1")
- **set/get** — set changes a value, get retrieves it
- **ATTRIBUTECODE** — the parameter to control (level, mute, minLevel, etc.)
- **INDEX1, INDEX2** — channel indexes, starting from 1
- **VALUE** — the value to set (for set commands only)

Success response: `+OK`
Error response: `! "message":"error description"`

---

## Level Control

| Function | Command |
|---|---|
| Set channel 1 to -10 dB | `LevelControl1 set level 1 1 -10.0` |
| Get channel 1 level | `LevelControl1 get level 1 1` |
| Get minimum level | `LevelControl1 get minLevel 1 1` |
| Get maximum level | `LevelControl1 get maxLevel 1 1` |

Level values are floating point dB. Response format: `+OK "value":-10.0`

---

## Mute Control

| Function | Command |
|---|---|
| Mute channel 1 | `MuteControl1 set mute 1 1 true` |
| Unmute channel 1 | `MuteControl1 set mute 1 1 false` |
| Get mute state | `MuteControl1 get mute 1 1` |
| Toggle mute | `MuteControl1 toggle mute 1 1` |

Response: `+OK "value":true`

---

## Router / Matrix Crosspoint

| Function | Command |
|---|---|
| Route input 1 to output 1 | `RouterControl1 set crossPointOn 1 1 true` |
| Remove crosspoint | `RouterControl1 set crossPointOn 1 1 false` |
| Get crosspoint state | `RouterControl1 get crossPointOn 1 1` |

---

## Source Selector

| Function | Command |
|---|---|
| Select source 2 | `SourceSelector1 set sourceSelection 1 2` |
| Get current source | `SourceSelector1 get sourceSelection 1` |

---

## Feedback Subscription

Tesira supports push feedback without polling. Subscribe to an attribute and the device sends changes automatically.

```
SUBSCRIBE MuteControl1 mute 1 1 "MuteToken" 0
```

When the mute state changes, Tesira pushes:
```
! MuteToken "value":true
```

The publish token is any string you define — use it to identify which attribute the feedback belongs to when parsing. To unsubscribe: `UNSUBSCRIBE MuteControl1 mute 1 1 "MuteToken"`

---

## Crestron SIMPL+ Notes

Set your COM port to 115200 baud with LF terminator (0x0A). Store instance tags as string parameters so they can be configured per project without recompiling.

Use GATHER with 0x0A as the terminator to collect complete response lines. Parse the first character — `+` means success, `!` means error or unsolicited feedback. Send SUBSCRIBE commands during module initialization after connection is established.

---

## Common Mistakes

- **Using CR (0x0D) instead of LF (0x0A)** — the single most common Tesira control issue
- **Wrong instance tag case** — "levelcontrol1" will not match "LevelControl1" — instance tags are case sensitive
- **Forgetting index parameters** — required even for single-channel blocks
- **Not handling Telnet negotiation bytes** — Tesira sends option negotiation on connect; your code needs to ignore these
- **Polling instead of subscribing** — subscription-based feedback is more efficient and faster

---

## Quick Reference

| Task | Command |
|---|---|
| Set level | `INSTANCETAG set level 1 1 VALUE` |
| Get level | `INSTANCETAG get level 1 1` |
| Mute on | `INSTANCETAG set mute 1 1 true` |
| Mute off | `INSTANCETAG set mute 1 1 false` |
| Subscribe | `SUBSCRIBE INSTANCETAG ATTRIBUTE 1 1 TOKEN 0` |

**Serial settings:** 115200 baud, 8N1, **LF terminator (0x0A)**

Need Tesira commands generated for your specific instance tags? AVCommand at av-command.com builds Tesira control code instantly.
