---
title: "Kramer Switcher RS-232 Commands: Protocol 2000 and Protocol 3000 Guide"
slug: "kramer-switcher-rs232-commands"
date: "May 1, 2026"
description: "RS-232 control guide for Kramer matrix switchers. Covers both Protocol 2000 (HEX) and Protocol 3000 (ASCII) with serial settings, routing commands, and Crestron examples."
tags: ["Kramer", "RS-232", "Matrix Switcher", "Protocol 3000", "Crestron"]
---

Kramer switchers are common in commercial AV for their reliability and wide range of matrix configurations. What trips up integrators is that Kramer uses two completely different RS-232 protocols depending on the product generation — Protocol 2000 (binary HEX, older products) and Protocol 3000 (ASCII text, newer products). Using the wrong protocol on the wrong device will result in no response.

This guide covers how to identify which protocol your Kramer device uses, serial port settings, routing commands for both protocols, and Crestron examples.

---

## How to Tell Which Protocol Your Device Uses

Protocol 3000 (ASCII): Used on most Kramer products from approximately 2010 onwards. The product manual will show commands like ROUTE, INFO, or MODEL with hash symbols and carriage returns. Baud rate is typically 115200.

Protocol 2000 (HEX): Used on older Kramer matrix switchers. The manual will show HEX byte tables for routing commands. Baud rate is typically 9600.

When in doubt, check the product page on the Kramer website or look at the protocol appendix in the product manual.

---

## Protocol 3000 — Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 115200 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Cable Type | Straight-through |
| Terminator | CR (0x0D) |

---

## Protocol 3000 — Commands

Format: Hash + Command + Space + Parameters + CR

| Function | Command |
|---|---|
| Route Input 1 to Output 1 | #ROUTE 1,1,1CR |
| Route Input 2 to Output 3 | #ROUTE 1,3,2CR |
| Query Routing | #ROUTE? 1,1CR |
| Get Device Info | #INFO CR |
| Get Model Name | #MODEL? CR |
| Get Firmware Version | #VERSION? CR |
| Lock Front Panel | #LOCK-FP 1CR |
| Unlock Front Panel | #LOCK-FP 0CR |

The ROUTE command format is: #ROUTE Layer,Output,Input where Layer 1 is video and Layer 2 is audio.

Response format: tilde + ROUTE + space + parameters + CR+LF

---

## Protocol 2000 — Serial Port Settings

| Parameter | Value |
|---|---|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Flow Control | None |
| Cable Type | Straight-through |

---

## Protocol 2000 — Command Format

Protocol 2000 uses 4-byte binary HEX packets:

Byte 1: Instruction code (with machine number in lower 4 bits)
Byte 2: Input number
Byte 3: Output number
Byte 4: Machine number

For a single machine (machine number 1), the routing command to tie input 1 to output 1 is: 01 01 01 81

The instruction code for video switching is 0x01. Audio switching is 0x02. For the machine number byte, set bit 7 to 1 (so machine 1 = 0x81, machine 2 = 0x82).

---

## Protocol 2000 — Common Commands

| Function | HEX Bytes |
|---|---|
| Route Video In1 to Out1 | 01 01 01 81 |
| Route Video In2 to Out3 | 01 02 03 81 |
| Route Video In1 to All Outputs | 01 01 00 81 |
| Route Audio In1 to Out1 | 02 01 01 81 |
| Query Status | 01 00 00 81 |

---

## Crestron SIMPL+ Example — Protocol 3000

STRING_PARAMETER SP_Route_1_1[14] = "#ROUTE 1,1,1\x0D";
STRING_PARAMETER SP_Route_2_1[14] = "#ROUTE 1,1,2\x0D";
STRING_PARAMETER SP_Route_3_1[14] = "#ROUTE 1,1,3\x0D";
STRING_PARAMETER SP_Info[8]       = "#INFO \x0D";

DIGITAL_INPUT Input1, Input2, Input3;
STRING_OUTPUT TX$;

PUSH Input1 { TX$ = SP_Route_1_1; }
PUSH Input2 { TX$ = SP_Route_2_1; }
PUSH Input3 { TX$ = SP_Route_3_1; }

Note: Set COM port to 115200 baud for Protocol 3000.

---

## AMX NetLinx Example — Protocol 3000

DEFINE_CONSTANT
  CHAR ROUTE_IN1_OUT1[] = "#ROUTE 1,1,1",$0D
  CHAR ROUTE_IN2_OUT1[] = "#ROUTE 1,1,2",$0D
  CHAR GET_INFO[]       = "#INFO ",$0D

BUTTON_EVENT[dvTP, BTN_INPUT_1]
{
  PUSH: { SEND_STRING dvKramer, ROUTE_IN1_OUT1; }
}

---

## Common Gotchas

- **Wrong protocol for your device** — check the manual before writing code. Protocol 3000 at 9600 baud will not work. Protocol 2000 at 115200 will not work
- **Wrong baud rate** — Protocol 3000 uses 115200, not 9600. This is the most common mistake on newer Kramer devices
- **ROUTE command layer parameter** — always include the layer. Layer 1 is video, layer 2 is audio. Omitting it causes an error
- **Protocol 2000 byte order** — the machine number byte must have bit 7 set. Machine 1 is 0x81 not 0x01
- **Front panel override** — if the front panel buttons are active, they can override RS-232 routing. Lock the front panel with LOCK-FP 1 if needed

---

## Quick Reference — Protocol 3000

| Task | Command |
|---|---|
| Route In1 to Out1 (video) | #ROUTE 1,1,1 + CR |
| Route In2 to Out3 (video) | #ROUTE 1,3,2 + CR |
| Query routing | #ROUTE? 1,1 + CR |
| Device info | #INFO + CR |
| Lock front panel | #LOCK-FP 1 + CR |

**Protocol 3000 serial settings:** 115200 baud, 8N1, no flow control, CR terminator

---

Always verify the protocol version for your specific Kramer model. The product manual's RS-232 appendix will confirm whether your device uses Protocol 2000, Protocol 3000, or a hybrid of both.
