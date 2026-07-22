# `starlight-gravity room`

List rooms, or propose one from a thesis.

## Synopsis

```
starlight-gravity room [list]
starlight-gravity room propose --thesis <text> [--theme <text>] [--host <id>] [--json] [--dir <path>]
```

## Description

`room` (or `room list`) lists your rooms with their status. `room propose`
creates a new room from a thesis — why these people, why now — in the `proposed`
state, with an empty invitee list. Candidates are suggested elsewhere and always
human-invited; this command never sends invitations.

## Options

| Flag              | Meaning                                            |
| ----------------- | -------------------------------------------------- |
| `--thesis <text>` | Required for `propose`. The reason to gather.      |
| `--theme <text>`  | Optional theme tag.                                |
| `--host <id>`     | Host person id (default `me`).                     |
| `--json`          | Machine-readable output.                           |
| `--dir <path>`    | Field directory (store lives in `<dir>/.gravity`). |

## Example

```bash
starlight-gravity room propose --thesis "A small dinner on local-first memory" --theme local-first
```

```
★ Room proposed
  id             room_5f3a1c9b2e
  thesis         A small dinner on local-first memory
```

```bash
starlight-gravity room
```

```
★ Rooms
  - [proposed] A small dinner on local-first memory (room_5f3a1c9b2e)
```

## Exit codes

`0` success · `2` `propose` without `--thesis`.

## Loop & force

The thesis-and-curate step of **Room → Network**. Rooms actually `hosted` or
`synthesized` raise the **Convening** force; a proposed room does not — convening
is earned by hosting.

## Sovereignty

A room begins as a thesis, not a guest list. Invitees are suggested, never
auto-invited, and never drawn from a ranking (there are none). This command
sends nothing. Related: [gravity-capture](gravity-capture.md) (suggests room
themes).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
