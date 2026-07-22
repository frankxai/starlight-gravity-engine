# Claude Code starter

Run the Gravity Engine loops inside [Claude Code](https://claude.com/claude-code).

## Option A — the Local Engine (recommended)

Claude Code can drive the real CLI directly:

```bash
git clone https://github.com/frankxai/starlight-gravity-engine
cd starlight-gravity-engine
node packages/cli/src/bin.ts init
```

Then ask Claude to run the loops for you: _"capture this field note and save the
signals"_, _"give me my gravity brief"_, _"what's my weakest force this week?"_
Claude runs `starlight-gravity capture/brief/review/...` and reads back the
results.

## Option B — the skills

The six loop skills live in [`skills/`](../../skills/) as `SKILL.md` files
(`gravity-capture`, `gravity-brief`, `gravity-publish`, `gravity-room`,
`gravity-follow-through`, `gravity-review`). Point Claude Code at them, or copy
them into your project's skills directory, to get the loops as invokable skills.

## Sovereignty in the loop

Whichever option you use, the same hard rules apply and are enforced by the
engine, not just the prompt:

- Observable only — no speculation about people's interiors.
- No rankings of people.
- Nothing published or sent without your explicit approval.
- Private by default.

See [CANON.md](../../CANON.md) for the full, enforced rule set.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
