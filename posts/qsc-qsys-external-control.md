---
title: "QSC Q-SYS External Control Protocol: RS-232 and TCP Commands for AV Integrators"
slug: "qsc-qsys-external-control"
date: "May 13, 2026"
description: "Complete QSC Q-SYS external control guide for AV integrators. TCP and RS-232 commands, Named Control protocol, feedback handling, and Crestron integration examples."
tags: ["QSC", "Q-SYS", "RS-232", "TCP", "DSP", "Crestron", "External Control"]
---

QSC Q-SYS is one of the most capable DSP platforms in commercial AV, and its external control protocol is well-designed once you understand the model. Like Biamp Tesira, Q-SYS uses a named control system — you reference controls by the names assigned in Q-SYS Designer rather than fixed command bytes. This makes the protocol flexible but requires coordination between the Q-SYS designer and the control system programmer.

This guide covers the External Control Protocol, TCP and RS-232 setup, Named Control commands, feedback, and Crestron implementation.

---

## Connection Methods

Q-SYS supports two external control methods:

**TCP (recommended):** Port 1710. Connect to the Core's IP address on port 1710. The External Control Protocol runs over this TCP connection. This is the standard method for control system integration.

**RS-232:** Available on Q-SYS I/O frames and some peripherals, not directly on the Core. For controlling the Core via serial, use a serial-to-TCP converter or program a Q-SYS Lua script to bridge the serial port to Named Controls internally.

Most Q-SYS integrations use TCP directly to the Core.

---

## Protocol: JSON-RPC

Q-SYS External Control Protocol uses JSON-RPC 2.0. Commands are JSON objects sent over TCP with a newline terminator. Responses are also JSON.

This is different from most AV protocols — you are sending formatted JSON strings, not simple ASCII commands or HEX bytes.

---

## Authentication (if required)

If Q-SYS Designer has PIN code enabled:

```json
{"jsonrpc":"2.0","method":"Logon","params":{"User":"","Password":"1234"},"id":1}
```

Response on success:
```json
{"jsonrpc":"2.0","result":{"Platform":"Core 110f","State":"Active","DesignName":"MyDesign","DesignCode":"abc123","IsRedundant":false,"IsEmulator":false},"id":1}
```

---

## Named Control — Get Value

```json
{"jsonrpc":"2.0","method":"Control.Get","params":["MyGainControl"],"id":2}
```

Response:
```json
{"jsonrpc":"2.0","result":[{"Name":"MyGainControl","String":"-10.0 dB","Value":-10.0,"Position":0.65}],"id":2}
```

The Value field is the numeric value. String is the formatted display string. Position is 0.0 to 1.0 representing the control's range.

---

## Named Control — Set Value

Set by value (dB for gain controls):
```json
{"jsonrpc":"2.0","method":"Control.Set","params":{"Name":"MyGainControl","Value":-15.0},"id":3}
```

Set by position (0.0 to 1.0):
```json
{"jsonrpc":"2.0","method":"Control.Set","params":{"Name":"MyGainControl","Position":0.5},"id":3}
```

Set by string (for controls that accept text):
```json
{"jsonrpc":"2.0","method":"Control.Set","params":{"Name":"SourceSelect","String":"Input 2"},"id":3}
```

---

## Mute Control

Q-SYS mute controls use a value of 1.0 for muted and 0.0 for unmuted:

Mute on:
```json
{"jsonrpc":"2.0","method":"Control.Set","params":{"Name":"MyMuteControl","Value":1},"id":4}
```

Mute off:
```json
{"jsonrpc":"2.0","method":"Control.Set","params":{"Name":"MyMuteControl","Value":0},"id":4}
```

---

## Change Group Feedback (Poll or Push)

Q-SYS supports both polling and push feedback through Change Groups.

**Create a change group:**
```json
{"jsonrpc":"2.0","method":"ChangeGroup.AddControl","params":{"Id":"MyGroup","Controls":["MyGainControl","MyMuteControl"]},"id":5}
```

**Poll the group (get all changes since last poll):**
```json
{"jsonrpc":"2.0","method":"ChangeGroup.Poll","params":{"Id":"MyGroup"},"id":6}
```

**Auto-poll (push on change):**
```json
{"jsonrpc":"2.0","method":"ChangeGroup.AutoPoll","params":{"Id":"MyGroup","Rate":0.2},"id":7}
```

Rate is in seconds. 0.2 means push changes up to 5 times per second.

Push response when a control changes:
```json
{"jsonrpc":"2.0","method":"ChangeGroup.Poll","result":{"Id":"MyGroup","Changes":[{"Name":"MyMuteControl","String":"On","Value":1.0,"Position":1.0}]}}
```

---

## No-Op (Keepalive)

Q-SYS closes TCP connections after 30 seconds of inactivity. Send a periodic No-Op to keep the connection alive:

```json
{"jsonrpc":"2.0","method":"NoOp","params":{},"id":99}
```

Send this every 15-20 seconds from your control system.

---

## Crestron SIMPL+ Notes

In SIMPL+, open a TCP client socket to the Q-SYS Core IP address on port 1710. Use BUFFER_INPUT with 0x0A (newline) as the GATHER terminator. Build JSON strings by concatenation — there is no native JSON library in SIMPL+, so construct the strings manually.

Send the No-Op command in a recurring event (every 15 seconds) to maintain the connection. Use AutoPoll for efficient feedback rather than polling on a timer.

Store Named Control names as string parameters so they can be configured per project.

---

## Common Mistakes

- **Wrong port** — Q-SYS External Control is port 1710, not the default Telnet port 23
- **No keepalive** — connections drop after 30 seconds without a No-Op. This is the most common Q-SYS integration reliability issue
- **Wrong control names** — Named Controls are defined in Q-SYS Designer. The programmer and designer must agree on naming conventions before programming begins
- **JSON formatting errors** — malformed JSON is silently ignored. Validate your JSON strings carefully
- **Not handling unsolicited messages** — when AutoPoll is active, the Core sends change notifications at any time. Your receive handler must process these correctly alongside response messages

---

## Quick Reference

| Task | Method |
|---|---|
| Authenticate | `Logon` |
| Get control value | `Control.Get` |
| Set control value | `Control.Set` |
| Create feedback group | `ChangeGroup.AddControl` |
| Enable push feedback | `ChangeGroup.AutoPoll` |
| Keepalive | `NoOp` (every 15s) |

**Connection:** TCP port 1710 to Core IP address, newline terminated JSON-RPC

Need Q-SYS Named Control commands built for your specific design? AVCommand at av-command.com generates Q-SYS control code instantly.
