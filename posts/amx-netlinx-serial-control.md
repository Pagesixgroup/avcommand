---
title: "AMX NetLinx Serial Control: RS-232 Programming Guide for AV Integrators"
slug: "amx-netlinx-serial-control"
date: "May 13, 2026"
description: "Complete AMX NetLinx RS-232 serial control guide. SEND_STRING commands, STRING_EVENT parsing, device definitions, and real-world examples for displays and switchers."
tags: ["AMX", "NetLinx", "RS-232", "Serial Control", "AV Programming"]
---

AMX NetLinx is the programming language powering AMX control processors, and its approach to RS-232 device control is one of the more readable in commercial AV. Where Crestron uses graphical symbols and compiled modules, NetLinx lets you write straightforward procedural code — define a device, send strings, handle responses. For integrators comfortable with programming, it flows naturally.

This guide covers device definitions, COM port configuration, sending RS-232 commands, parsing feedback, and real-world examples.

---

## COM Port Device Definition

In NetLinx, every device — touchpanel, RS-232 port, relay output — is defined with a device number, port, and system number. COM ports follow the same model:

```
DEFINE_DEVICE
dvComPort = 5001:1:0   // COM port 1 on the local controller
dvDisplay  = 5001:2:0   // COM port 2
```

The format is DeviceNumber:Port:System. For local COM ports on the NX series processors, device numbers start at 5001. Check your specific processor's documentation for the correct device numbers.

---

## COM Port Configuration

Configure the COM port settings in a DEFINE_START block:

```
DEFINE_START
  // 9600 baud, 8N1, no flow control
  SEND_COMMAND dvComPort, "'SET BAUD 9600,N,8,1'"
  SEND_COMMAND dvComPort, "'SET MODE RS232'"
```

Common baud rate settings:
- `'SET BAUD 9600,N,8,1'` — 9600 baud, no parity, 8 data bits, 1 stop bit
- `'SET BAUD 115200,N,8,1'` — 115200 baud
- `'SET BAUD 38400,N,8,1'` — 38400 baud

---

## Sending Commands — SEND_STRING

SEND_STRING transmits data out the COM port:

```
// Send a simple ASCII command with CR terminator
SEND_STRING dvComPort, "'PON',$0D"

// Send with CRLF terminator
SEND_STRING dvComPort, "'VOL50',$0D,$0A"

// Send binary HEX bytes (Sony BRAVIA power on)
SEND_STRING dvComPort, "$8C,$00,$00,$02,$01,$8F"

// Build command with variable
DEFINE_VARIABLE
  INTEGER nInput

SEND_STRING dvComPort, "'IIS:HD',ITOA(nInput),$0D"
```

The string inside SEND_STRING uses AMX's string concatenation syntax — comma-separated values, single-quoted ASCII strings, and dollar-sign hex bytes.

---

## Receiving Data — STRING_EVENT and DATA_EVENT

NetLinx handles incoming serial data with event handlers:

```
DATA_EVENT[dvComPort]
{
  STRING:
  {
    LOCAL_VAR CHAR cBuffer[256]
    cBuffer = DATA.TEXT

    // Check for power on acknowledgment
    IF(FIND_STRING(cBuffer,"'PON'",1))
    {
      // Display confirmed power on
      nPowerState = 1
    }
    IF(FIND_STRING(cBuffer,"'POF'",1))
    {
      nPowerState = 0
    }
  }
}
```

For binary protocols where you need to accumulate bytes until you have a complete packet, use a module-level buffer and check length or look for a terminating byte.

---

## Button Event Example — Display Control

```
DEFINE_CONSTANT
  INTEGER BTN_POWER_ON  = 1
  INTEGER BTN_POWER_OFF = 2
  INTEGER BTN_INPUT_1   = 11
  INTEGER BTN_INPUT_2   = 12

BUTTON_EVENT[dvTP, BTN_POWER_ON]
{
  PUSH:
  {
    SEND_STRING dvComPort, "'PON',$0D"
  }
}

BUTTON_EVENT[dvTP, BTN_POWER_OFF]
{
  PUSH:
  {
    SEND_STRING dvComPort, "'POF',$0D"
  }
}

BUTTON_EVENT[dvTP, BTN_INPUT_1]
{
  PUSH:
  {
    SEND_STRING dvComPort, "'IIS:HD1',$0D"
  }
}
```

---

## Matrix Switcher Example — Extron SIS

For an Extron matrix switcher using SIS protocol:

```
DEFINE_FUNCTION SendExtronRoute(INTEGER nInput, INTEGER nOutput)
{
  // SIS format: Input*Output! + CR
  SEND_STRING dvSwitcher, "ITOA(nInput),'*',ITOA(nOutput),'!',$0D"
}

BUTTON_EVENT[dvTP, BTN_ROUTE_IN1_OUT1]
{
  PUSH: { SendExtronRoute(1, 1) }
}

BUTTON_EVENT[dvTP, BTN_ROUTE_IN2_OUT1]
{
  PUSH: { SendExtronRoute(2, 1) }
}
```

---

## Volume Control with Ramp

```
DEFINE_VARIABLE
  INTEGER nVolumeLevel  // 0-100

DEFINE_FUNCTION SetVolume(INTEGER nLevel)
{
  // Clamp to valid range
  IF(nLevel < 0)  nLevel = 0
  IF(nLevel > 100) nLevel = 100
  nVolumeLevel = nLevel
  // Send to device — format varies by manufacturer
  SEND_STRING dvComPort, "'VOL',ITOA(nLevel),$0D"
}

BUTTON_EVENT[dvTP, BTN_VOL_UP]
{
  PUSH:    { SetVolume(nVolumeLevel + 5) }
  REPEAT:  { SetVolume(nVolumeLevel + 1) }
}

BUTTON_EVENT[dvTP, BTN_VOL_DOWN]
{
  PUSH:    { SetVolume(nVolumeLevel - 5) }
  REPEAT:  { SetVolume(nVolumeLevel - 1) }
}
```

---

## Useful String Functions

| Function | Description |
|---|---|
| `ITOA(n)` | Convert integer to ASCII string |
| `ATOI(s)` | Convert ASCII string to integer |
| `FIND_STRING(haystack, needle, start)` | Find substring, returns position or 0 |
| `MID_STRING(s, start, len)` | Extract substring |
| `LEFT_STRING(s, len)` | Leftmost characters |
| `RIGHT_STRING(s, len)` | Rightmost characters |
| `LENGTH_STRING(s)` | String length |
| `UPPER_STRING(s)` | Convert to uppercase |

---

## Common Mistakes

- **Wrong device number** — COM port device numbers vary by processor model. Check the hardware manual
- **Missing DEFINE_START configuration** — forgetting to set baud rate means the port uses default settings which may not match your device
- **String terminator mismatch** — verify whether the device needs CR (0x0D), LF (0x0A), or CRLF
- **DATA_EVENT vs STRING_EVENT** — DATA_EVENT is the correct handler for incoming serial data. STRING_EVENT is for string variable changes
- **Buffer overflow** — if your DATA_EVENT handler doesn't consume the buffer, it accumulates and causes parsing errors

---

## Quick Reference

| Task | Syntax |
|---|---|
| Configure COM port | `SEND_COMMAND dvPort, "'SET BAUD 9600,N,8,1'"` |
| Send ASCII command | `SEND_STRING dvPort, "'CMD',$0D"` |
| Send HEX bytes | `SEND_STRING dvPort, "$8C,$00,$01"` |
| Handle responses | `DATA_EVENT[dvPort] { STRING: { ... } }` |
| Find in response | `FIND_STRING(DATA.TEXT, "'target'", 1)` |

Need AMX NetLinx code for a specific RS-232 device? AV-Command at [av-command.com](https://av-command.com) generates NetLinx serial control code instantly.
---

## Related Guides

- [Panasonic Projector RS-232 Commands](/blog/panasonic-projector-rs232-commands)
- [Extron RS-232 Control Guide — SIS Protocol](/blog/extron-rs232-commands)
- [Sony BRAVIA Professional RS-232 Commands](/blog/sony-display-rs232-commands)
- [NEC Display RS-232 Commands](/blog/nec-display-rs232-commands)
- [Kramer Switcher RS-232 Commands — Protocol 2000 & 3000](/blog/kramer-switcher-rs232-commands)
- [Crestron SIMPL+ Serial Control Guide](/blog/crestron-simpl-plus-serial-control)
- [Biamp Tesira RS-232 and Telnet Control](/blog/biamp-tesira-rs232-commands)
- [QSC Q-SYS External Control Protocol](/blog/qsc-qsys-external-control)
- [AMX NetLinx Serial Control Guide]- [RS-232 vs IP Control in Commercial AV](/blog/rs232-vs-ip-control)
- [Crestron vs AMX vs Extron: Control System Comparison](/blog/crestron-vs-amx-vs-extron)

---

## Free RS-232 Tools

Baud rate reference, device settings table, terminator guide, and DB9 pinout — all free, no signup required.

[Open Free RS-232 Tools →](https://av-command.com/tools)

---

## Generate RS-232 Commands Instantly

Need exact command strings for a device not covered here? **[AV-Command](https://av-command.com)** includes free RS-232 troubleshooting checklists and a free tools reference — no signup required. The AI Assistant generates exact command strings, serial port settings, and Crestron SIMPL+ code for hundreds of devices instantly.

[Try AV-Command Free — upgrade anytime for AI commands →](https://av-command.com)
