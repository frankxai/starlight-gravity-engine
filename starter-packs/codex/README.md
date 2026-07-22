# Codex starter

Run the Gravity Engine loops with [OpenAI Codex](https://openai.com/codex) or any
generic coding agent that can execute shell commands and read files. The engine
is a plain Node CLI with zero runtime dependencies, so any agent that can run
`node` can drive it.

## Setup

```bash
git clone https://github.com/frankxai/starlight-gravity-engine
cd starlight-gravity-engine
node --version   # must be >= 22
node packages/cli/src/bin.ts init
```

`init` writes `.gravity/` (your local, private store) and a `DIRECTION.md`
template. No `npm install` is needed to try it.

## The loop, as commands

Point your agent at these. It runs them and reads the output back to you.

```bash
node packages/cli/src/bin.ts capture --file note.md --save   # encounter → five outputs
node packages/cli/src/bin.ts brief                           # gravity score + weakest force
node packages/cli/src/bin.ts room propose --thesis "..."     # convene from a thesis
node packages/cli/src/bin.ts follow-through                  # open promises; --fulfil <id> to close
node packages/cli/src/bin.ts publish --title "Draft"         # the publish gate (dry-run)
node packages/cli/src/bin.ts review                          # weekly delta + weakest force
```

Add `--json` to any command for machine-readable output your agent can parse.

## Prompting the agent

Tell the agent, in its instructions: _after each real encounter, write a field
note, run `capture --save`, and read me back the five outputs — I approve or
decline each._ The engine already enforces the hard rules below; keep them in the
agent's instructions so it never tries to route around them.

## The rules the agent must not break

Enforced in the engine, not just the prompt (see [CANON.md](../../CANON.md)):

- Observable only — no inference about attraction, diagnosis, hidden intent, or
  anyone's worth. Speculation is stored as nothing.
- No rankings of people — the person record has no score field, by design.
- Nothing is published or sent without your explicit approval. Publication is a
  distinct human act.
- Private by default — every captured record is `private_context` until you
  decide otherwise.
- Introductions need consent from both people before they happen.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
