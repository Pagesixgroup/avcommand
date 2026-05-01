---
title: "Extron RS-232 Control Guide: SIS Commands for Switchers and Displays"
slug: "extron-rs232-commands"
date: "May 1, 2026"
description: "Complete guide to Extron SIS RS-232 commands for matrix switchers and displays. Serial port settings, input switching, status queries, and Crestron SIMPL+ examples."
tags: ["Extron", "RS-232", "SIS", "Matrix Switcher", "Crestron"]
---

Extron's Simple Instruction Set (SIS) is one of the most integrator-friendly RS-232 protocols in commercial AV. Unlike Panasonic's STX/ETX framing or Sony's binary HEX protocol, Extron SIS commands are plain ASCII text you can type directly from a keyboard. Once you learn a handful of commands, they work across most Extron products.

This guide covers serial port settings, the most commonly used SIS commands, matrix switcher routing, and Crestron SIMPL+ examples.

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

**Note:** Extron responds with CR+LF after each command. Some newer products support higher baud rates — check your specific model. The 9600 8N1 default works across the entire product line.

---

## SIS Command Format

Extron SIS commands are plain ASCII with a carriage return terminator. No special header or framing bytes required.

Format: Command + CR

The device responds with a status message followed by CR+LF. If an invalid command is sent, Extron returns an error code like E01 (invalid input number) or E13 (invalid command).

---

## Power Control

| Function | Command |
|---|---|
| Power On | less-than sign + CR |
| Power Off | greater-than sign + CR |
| Query Power Status | I + CR |

Note: The less-than and greater-than signs are the power on and off commands respectively. The I command returns full system status including power state, input selection, and firmware version.

---

## Input Switching

For single-output switchers and scalers:

| Function | Command |
|---|---|
| Switch to Input 1 | 1! + CR |
| Switch to Input 2 | 2! + CR |
| Switch to Input 3 | 3! + CR |
| Switch to Input 4 | 4! + CR |
| Query Current Input | I + CR |

For matrix switchers (tie input to output):

| Function | Command |
|---|---|
| Tie Input 1 to Output 1 | 1*1! + CR |
| Tie Input 2 to Output 3 | 2*3! + CR |
| Tie Input 1 to All Outputs | 1*0! + CR |
| Disconnect Output 2 | 0*2! + CR |
| Query All Ties | 0LS + CR |

The format for matrix routing is: Input Number + asterisk + Output Number + exclamation mark + CR

The response confirms the tie: OUT1 IN1 VID

---

## Video Mute Control

| Function | Command |
|---|---|
| Video Mute On | B + CR |
| Video Mute Off | shift-B (capital B clears mute) |
| Audio Mute On | Z + CR |
| Audio Mute Off | shift-Z |

---

## Status and Query Commands

| Function | Command |
|---|---|
| System Status | I + CR |
| Input Count | 2I + CR |
| Output Count | 3I + CR |
| Firmware Version | Q + CR |
| Part Number | N + CR |

---

## Crestron SIMPL+ Example

For a single-output Extron switcher or scaler:

DEFINE_CONSTANT
  INTEGER MAX_INPUTS = 8

STRING_PARAMETER SP_Input[8][6];
SP_Input[1] = "1!\x0D";
SP_Input[2] = "2!\x0D";
SP_Input[3] = "3!\x0D";
SP_Input[4] = "4!\x0D";

STRING_PARAMETER SP_PowerOn[3]  = "<\x0D";
STRING_PARAMETER SP_PowerOff[3] = ">\x0D";
STRING_PARAMETER SP_Status[3]   = "I\x0D";

DIGITAL_INPUT PowerOn, PowerOff;
INTEGER_INPUT InputSelect;
STRING_OUTPUT TX$;

PUSH PowerOn  { TX$ = SP_PowerOn; }
PUSH PowerOff { TX$ = SP_PowerOff; }

CHANGE InputSelect
{
  IF (InputSelect >= 1 AND InputSelect <= 4)
    TX$ = SP_Input[InputSelect];
}

---

## AMX NetLinx Example

For a matrix switcher, tying input to output:

DEFINE_CONSTANT
  CHAR STATUS_CMD[] = {'I',$0D}
  CHAR POWER_ON[]   = {'<',$0D}
  CHAR POWER_OFF[]  = {'>',$0D}

DEFINE_FUNCTION sendTie(INTEGER nInput, INTEGER nOutput)
{
  STACK_VAR CHAR cmd[10];
  cmd = "ITOA(nInput),'*',ITOA(nOutput),'!',$0D";
  SEND_STRING dvSwitcher, cmd;
}

BUTTON_EVENT[dvTP, BTN_INPUT_1_OUT_1]
{
  PUSH: { sendTie(1, 1); }
}

---

## Common Gotchas

- **Forgetting the CR terminator** — SIS commands require a carriage return. Without it the device waits for more input and never executes
- **Using wrong cable** — Extron uses straight-through, not null modem. Pin 2 to pin 2, pin 3 to pin 3
- **Matrix vs single-output syntax** — the exclamation mark routes to the single output on single-output devices. On matrix switchers you need the Input*Output! format
- **Not reading the response** — Extron sends a response to every command. If your control system sends commands too fast without reading responses, the buffer fills and commands get dropped
- **Front panel lockout** — some Extron products have a front panel lock mode that also blocks RS-232. Check the device menu if commands are not responding

---

## Quick Reference

| Task | Command |
|---|---|
| Power On | less-than + CR |
| Power Off | greater-than + CR |
| Select Input 1 | 1! + CR |
| Select Input 2 | 2! + CR |
| Matrix: In1 to Out1 | 1*1! + CR |
| Matrix: In2 to Out3 | 2*3! + CR |
| Video Mute | B + CR |
| System Status | I + CR |

**Serial settings:** 9600 baud, 8N1, no flow control, straight-through cable, CR terminator

---

Always verify commands against your specific Extron model's documentation. The SIS command set is consistent across most products but some parameters vary by model.
