---
title: "Crestron SIMPL+ Serial Control: A Practical Guide for AV Integrators"
slug: "crestron-simpl-plus-serial-control"
date: "May 4, 2026"
description: "Learn how to build RS-232 serial control modules in Crestron SIMPL+. Covers module structure, sending commands, parsing responses, delays, and real-world examples."
tags: ["Crestron", "SIMPL+", "RS-232", "Serial Control", "AV Programming"]
---

If you've been using pre-built Crestron modules from the Design Center for everything and want to start writing your own RS-232 control code, this guide is for you. SIMPL+ serial modules are not as intimidating as they look — once you understand the structure, you can build a working module for any device in under an hour.

This guide covers the SIMPL+ module structure, COM port configuration in SIMPL Windows, sending commands, parsing responses, handling delays, and real-world examples you can use as a starting point.

---

## What is SIMPL+?

SIMPL+ is Crestron's C-like programming language used to extend SIMPL Windows programs with custom logic. While SIMPL Windows uses graphical symbols and signal wiring, SIMPL+ lets you write actual code — string manipulation, math, conditional logic, and serial communication handling.

For RS-232 device control, SIMPL+ is the right tool when no pre-built module exists for your device, or when the pre-built module doesn't handle feedback the way you need.

---

## SIMPL+ Module Structure

Every SIMPL+ module has the same basic structure:

Compiler directive at the top specifying the target processor series.

Input and output declarations defining what signals the module accepts and produces.

Variable declarations for internal string and integer variables.

Event handlers that execute code when inputs change.

Function definitions for reusable code blocks.

The minimum structure for a serial control module looks like this:

#SYMBOL_NAME "My_Device_Control"
#CATEGORY "Custom Modules"

#DEFINE_CONSTANT CR "\x0D"
#DEFINE_CONSTANT LF "\x0A"

STRING_INPUT RX$[256];
BUFFER_INPUT RXBuf$[1024];

DIGITAL_INPUT PowerOn, PowerOff;
STRING_INPUT CommandIn$[100];

STRING_OUTPUT TX$;
DIGITAL_OUTPUT PowerFb, InputFb;

STRING PowerOnCmd[20];
STRING PowerOffCmd[20];

FUNCTION Initialize()
{
    PowerOnCmd = "PON" + CR;
    PowerOffCmd = "POF" + CR;
}

PUSH PowerOn
{
    TX$ = PowerOnCmd;
}

PUSH PowerOff
{
    TX$ = PowerOffCmd;
}

---

## Compiler Directives

The compiler directive at the top tells SIMPL+ which processor series to target. Use the correct one for your project:

For 3-Series processors (CP3, PRO3, AV3): #CRESTRON_SERIES_3 or leave blank — 3-series is the default.

For 4-Series processors (CP4, PRO4, RMC4): Add #CRESTRON_SERIES_4 to avoid compatibility warnings.

For both series in one module: Use #CRESTRON_SERIES_3_AND_4 which compiles for both targets.

---

## COM Port Configuration in SIMPL Windows

Before your SIMPL+ module can communicate, the COM port must be configured in SIMPL Windows Configuration Manager:

1. Double-click the COM port on your control processor in Configuration Manager
2. Set the baud rate to match the device (9600 is the most common default)
3. Set data bits to 8, parity to None, stop bits to 1
4. Set hardware handshaking to Off unless the device specifically requires it
5. Set software handshaking to Off

The COM port in SIMPL Windows is then wired to your SIMPL+ module's TX$ output and RX$ input using the standard Serial Driver symbol or a Custom Serial symbol.

---

## Sending Commands

Sending a command is straightforward — assign the command string to TX$:

PUSH PowerOn
{
    TX$ = "PON\x0D";
}

For devices that need HEX bytes (like Sony or NEC), use hex notation directly in the string:

PUSH PowerOn
{
    TX$ = "\x8C\x00\x00\x02\x01\x8F";
}

For commands that include variable data such as a volume level:

CHANGE VolumeLevel
{
    TX$ = "VOL" + ITOA(VolumeLevel) + "\x0D";
}

---

## Handling Delays

Many devices require a delay after power on before they will respond to other commands. Do not use DELAY or WAIT inside a PUSH event directly — use a separate function with a PROCESSLOGIC call:

INTEGER Initializing;

PUSH PowerOn
{
    TX$ = "PON\x0D";
    Initializing = 1;
    DELAY(15000);
    Initializing = 0;
}

For more complex sequencing, use a state machine with a DELAY and a separate event to continue the sequence after the delay expires.

The DELAY function in SIMPL+ pauses execution of that event thread for the specified number of milliseconds. 15000 means 15 seconds. During this delay, other events can still fire and execute.

---

## Parsing Responses

This is where most integrators struggle. Devices send back feedback strings that your module needs to parse to drive feedback signals on the touchpanel.

Use BUFFER_INPUT instead of STRING_INPUT for receiving data — BUFFER_INPUT accumulates incoming bytes until your code reads them, while STRING_INPUT replaces its content every time new data arrives.

Basic feedback parsing example for a device that sends "PON" when powered on and "POF" when powered off:

CHANGE RXBuf$
{
    STRING incoming[256];
    incoming = GATHER("\x0D", RXBuf$);

    IF (FIND("PON", incoming) > 0)
    {
        PowerFb = 1;
    }
    ELSE IF (FIND("POF", incoming) > 0)
    {
        PowerFb = 0;
    }
}

The GATHER function reads from the buffer until it finds the specified terminator character — in this case a CR. This ensures you get a complete response before parsing.

---

## Building Commands Dynamically

For matrix switchers or devices where commands include variable parameters:

DIGITAL_INPUT Route[8];
INTEGER InputNumber;
INTEGER OutputNumber;

CHANGE InputNumber
{
    STRING cmd[20];
    cmd = ITOA(InputNumber) + "*" + ITOA(OutputNumber) + "!" + "\x0D";
    TX$ = cmd;
}

---

## String Functions You Need to Know

FIND(needle, haystack) returns the position of needle in haystack, or 0 if not found. Use this for parsing feedback.

LEFT(string, count) returns the leftmost count characters. Useful for extracting fixed-length fields.

MID(string, start, count) returns count characters starting at position start.

RIGHT(string, count) returns the rightmost count characters.

LEN(string) returns the length of a string.

ITOA(integer) converts an integer to its ASCII string representation.

ATOI(string) converts an ASCII string to an integer.

HEXTOI(string) converts a HEX string like "FF" to its integer value.

CHR(integer) returns the character with the given ASCII code. CHR(13) is a carriage return.

---

## Complete Example: Generic Display Controller

Here is a complete working SIMPL+ module for a generic display with power, input switching, and feedback:

#SYMBOL_NAME "Generic_Display_RS232"
#CATEGORY "Custom Modules"

DIGITAL_INPUT PowerOn_Cmd, PowerOff_Cmd;
INTEGER_INPUT InputSelect;
BUFFER_INPUT RXBuf$[1024];

STRING_OUTPUT TX$;
DIGITAL_OUTPUT Power_Fb;
INTEGER_OUTPUT Input_Fb;

STRING LastResponse[256];

PUSH PowerOn_Cmd
{
    TX$ = "PON\x0D";
}

PUSH PowerOff_Cmd
{
    TX$ = "POF\x0D";
}

CHANGE InputSelect
{
    IF (InputSelect > 0 AND InputSelect <= 8)
    {
        TX$ = "IIS:HD" + ITOA(InputSelect) + "\x0D";
    }
}

CHANGE RXBuf$
{
    LastResponse = GATHER("\x0D", RXBuf$);

    IF (FIND("PON", LastResponse) > 0) { Power_Fb = 1; }
    IF (FIND("POF", LastResponse) > 0) { Power_Fb = 0; }
}

---

## Common Mistakes

- **Declaring strings without a size** — always include the max size in brackets when declaring strings. STRING MyCmd[50] not just STRING MyCmd
- **Using STRING_INPUT instead of BUFFER_INPUT for feedback** — STRING_INPUT drops data if two responses arrive quickly. Always use BUFFER_INPUT for receive
- **Forgetting the compiler directive** — compiling a 4-series project without the directive causes warnings and sometimes unexpected behavior
- **String overflow** — if your declared string size is too small for the data assigned to it, the data gets silently truncated. Always declare strings larger than you think you need
- **Not using GATHER** — parsing RXBuf$ without GATHER can result in partial responses being processed. Always use GATHER with the correct terminator

---

## Testing Your Module

1. Compile the module in SIMPL+ (F12) and fix any errors
2. Add the compiled module to your SIMPL Windows program
3. Wire the TX$ output to the COM port driver TX$ input
4. Wire the RX$ input to the COM port driver RX$ output
5. Compile and upload the SIMPL program to your processor
6. Use Crestron Toolbox Viewport or Terminal to monitor the COM port and verify commands are being sent correctly

For testing without a physical device, use a PC serial terminal like PuTTY or RealTerm connected to a null modem cable to loopback test your module.

---

## Need RS-232 Commands for a Specific Device?

AVCommand generates exact RS-232 command strings, serial port settings, and ready-to-use SIMPL+ code for hundreds of AV devices instantly. Describe the device and what you need to control, and get working code in seconds.
