---
title: "Panasonic Projector RS-232 Commands: The Complete Control Guide"
slug: "panasonic-projector-rs232-commands"
date: "date: "April 30, 2026"
description: "Complete RS-232 command reference for Panasonic projectors. Serial port settings, command format, power control, input switching, Crestron SIMPL+ and AMX NetLinx examples."
tags: ["Panasonic", "RS-232", "Projector", "Crestron", "SIMPL+", "AMX"]
---

If you've ever spent 20 minutes hunting through a Panasonic projector manual just to find the power-on command, this guide is for you.

Panasonic projectors are some of the most widely deployed in commercial AV — from boardrooms to lecture halls to large venues. They're reliable, bright, and well-supported. But their RS-232 protocol has a few quirks that catch integrators off guard, especially the STX/ETX framing and the post-power-on delay requirement.

This guide covers everything you need to control Panasonic projectors via RS-232: serial port settings, command format, the most commonly used commands, and the gotchas that cause most integration headaches.

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

**Note:** Some newer Panasonic models support higher baud rates via the projector menu. Always check your specific model's documentation, but 9600 8N1 is the safe default across the entire product line.

---

## Command Format

This is where most integrators get tripped up. Panasonic RS-232 commands are not plain ASCII strings — they use a structured format with header and terminator bytes.

### Basic Format

```
STX + ID + Command + ETX
```

Where:
- **STX** = `0x02` (Start of Text)
- **ID** = `ADZZ` (All projectors, ID designate — default for single-projector setups)
- **Command** = the actual command string (e.g. `PON`, `POF`, `IIS:HD1`)
- **ETX** = `0x03` (End of Text)

### Full Example — Power On

```
\x02ADZZ;PON\x03
```

**Important:** Panasonic uses STX/ETX framing, NOT a simple CR or LF terminator. If you're used to sending `PON\r` to a Sony or NEC display, that won't work here.

---

## Most Commonly Used Commands

### Power Control

| Function | Command |
|---|---|
| Power On | `\x02ADZZ;PON\x03` |
| Power Off | `\x02ADZZ;POF\x03` |
| Query Power Status | `\x02ADZZ;QPW\x03` |

**Critical timing note:** After sending Power On, do NOT send any other commands for at least 10–30 seconds while the lamp warms up. Always use `QPW` to confirm the projector is fully on before proceeding.

### Input Switching

| Function | Command |
|---|---|
| HDMI 1 | `\x02ADZZ;IIS:HD1\x03` |
| HDMI 2 | `\x02ADZZ;IIS:HD2\x03` |
| DVI | `\x02ADZZ;IIS:DVI\x03` |
| VGA/RGB | `\x02ADZZ;IIS:RG1\x03` |
| SDI | `\x02ADZZ;IIS:SD1\x03` |
| Query Input | `\x02ADZZ;QIN\x03` |

### Shutter / Blank Control

| Function | Command |
|---|---|
| Shutter Close (Blank On) | `\x02ADZZ;OSH:1\x03` |
| Shutter Open (Blank Off) | `\x02ADZZ;OSH:0\x03` |
| Query Shutter | `\x02ADZZ;QSH\x03` |

### Audio

| Function | Command |
|---|---|
| Mute On | `\x02ADZZ;OAM:1\x03` |
| Mute Off | `\x02ADZZ;OAM:0\x03` |
| Volume Up | `\x02ADZZ;VU\x03` |
| Volume Down | `\x02ADZZ;VD\x03` |

### Display

| Function | Command |
|---|---|
| Freeze On | `\x02ADZZ;OFZ:1\x03` |
| Freeze Off | `\x02ADZZ;OFZ:0\x03` |
| Query Lamp Hours | `\x02ADZZ;QST\x03` |

---

## Crestron SIMPL+ Example

```crestron
/***********************************
Panasonic Projector RS-232 Control
Baud: 9600, 8N1, No flow control
***********************************/

String_Parameter SP_PowerOn[12]  = "\x02ADZZ;PON\x03";
String_Parameter SP_PowerOff[12] = "\x02ADZZ;POF\x03";
String_Parameter SP_HDMI1[14]    = "\x02ADZZ;IIS:HD1\x03";
String_Parameter SP_ShutterClose[13] = "\x02ADZZ;OSH:1\x03";
String_Parameter SP_ShutterOpen[13]  = "\x02ADZZ;OSH:0\x03";

Digital_Input Power_On, Power_Off, Input_HDMI1;
Digital_Input Shutter_Close, Shutter_Open;
String_Output TX$;

PUSH Power_On       { TX$ = SP_PowerOn; }
PUSH Power_Off      { TX$ = SP_PowerOff; }
PUSH Input_HDMI1    { TX$ = SP_HDMI1; }
PUSH Shutter_Close  { TX$ = SP_ShutterClose; }
PUSH Shutter_Open   { TX$ = SP_ShutterOpen; }
```

---

## AMX NetLinx Example

```netlinx
DEFINE_CONSTANT
  CHAR PON[]           = {$02,'ADZZ;PON',$03}
  CHAR POFF[]          = {$02,'ADZZ;POF',$03}
  CHAR HDMI1[]         = {$02,'ADZZ;IIS:HD1',$03}
  CHAR SHUTTER_CLOSE[] = {$02,'ADZZ;OSH:1',$03}
  CHAR SHUTTER_OPEN[]  = {$02,'ADZZ;OSH:0',$03}

BUTTON_EVENT[dvTP, BTN_POWER_ON]
{
  PUSH: { SEND_STRING dvProjector, PON }
}
BUTTON_EVENT[dvTP, BTN_POWER_OFF]
{
  PUSH: { SEND_STRING dvProjector, POFF }
}
```

---

## Common Gotchas

**1. Forgetting STX/ETX framing**
`PON\r` will not work. The command must be wrapped in `\x02` and `\x03`.

**2. Sending commands too soon after power on**
The projector ignores commands for 10–60 seconds after the lamp starts lighting. Poll with `QPW` before sending input commands.

**3. Not waiting for acknowledgment**
Panasonic returns a 3-byte ACK for each command. Send commands back to back and some will get dropped.

**4. Wrong cable type**
Use a straight-through cable, not a null modem cable.

**5. RS-232 not enabled in projector menu**
Some models default to IR-only. Enable RS-232C control in the projector's on-screen menu.

**6. Case sensitivity**
`PON` works. `pon` does not.

---

## Quick Reference

| Task | Command |
|---|---|
| Power On | `\x02ADZZ;PON\x03` |
| Power Off | `\x02ADZZ;POF\x03` |
| Query Power | `\x02ADZZ;QPW\x03` |
| HDMI 1 | `\x02ADZZ;IIS:HD1\x03` |
| HDMI 2 | `\x02ADZZ;IIS:HD2\x03` |
| Blank On | `\x02ADZZ;OSH:1\x03` |
| Blank Off | `\x02ADZZ;OSH:0\x03` |
| Mute On | `\x02ADZZ;OAM:1\x03` |
| Lamp Hours | `\x02ADZZ;QST\x03` |

**Serial settings:** 9600 baud · 8N1 · No flow control · Straight-through cable

---

*Always verify commands against your specific model's official Panasonic RS-232C protocol documentation. Commands may vary between product generations.*

