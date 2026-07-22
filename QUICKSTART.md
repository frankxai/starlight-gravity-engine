# Quick start — value in fifteen minutes

Two paths. Both run the same loop. Pick one.

- **Path A — Local Engine.** A real CLI. Needs Node.js 22+. Zero runtime
  dependencies, no cloud.
- **Path B — Markdown Starter.** No install at all. Any capable AI agent + a
  folder of files.

---

## Path A — Local Engine (Node 22+)

### 1. Get the engine (2 min)

```bash
git clone https://github.com/frankxai/starlight-gravity-engine
cd starlight-gravity-engine
node --version   # must be >= 22
```

No `npm install` is required to try it — the core has zero runtime dependencies
and runs from source on Node 22+.

### 2. Create your field (1 min)

```bash
node packages/cli/src/bin.ts init
```

This writes `.gravity/` (your local, private store) and a `DIRECTION.md`
template in the current directory.

### 3. Set your direction (5 min)

Open `DIRECTION.md` and fill in four things in your own words:

```markdown
## Statement

Turn the encounters in my work into compounding intelligence and trust.

## Horizon

the next 12 months

## Themes

- local-first software
- agentic systems
- creator sovereignty

## Values

- generosity
- reliability
```

Editing the file is enough. The engine re-reads it automatically before every
command — your themes and values directly raise the **Direction** force.

### 4. Capture your first encounter (2 min)

After any real conversation, drop a field note:

```bash
node packages/cli/src/bin.ts capture --note "Met Ada at the local-first dinner. \
Big insight: sovereignty is the moat for agentic systems, because people won't \
build their life on rented memory. I'll send Ada the draft essay by Friday. \
Also spoke with Grace, working on the same problem." --save
```

You get five things back, each yours to approve or decline:

- **Strongest signal** — the most salient line, scored against your direction.
- **Artifact opportunity** — the seed of something shareable.
- **Follow-through** — the promise you just made, named concretely.
- **Appreciation or introduction** — Ada ↔ Grace, _with consent from both_.
- **Room theme** — a small gathering this note suggests.

`--save` stores the extracted signals as `private_context` (proposed). Nothing
is published. Speculation (e.g. guessing someone's feelings) is refused and
stored as nothing.

### 5. Read your brief (1 min)

```bash
node packages/cli/src/bin.ts brief
```

Your gravity score, the five forces, open commitments, recent signals, and the
one move that would compound the rest (your weakest force). Add `--json` for
machine-readable output.

### 6. Come back in seven days (1 min)

```bash
node packages/cli/src/bin.ts review
```

The learning loop: your gravity delta since last review and the weakest force to
strengthen this week.

### Handy extras

```bash
node packages/cli/src/bin.ts room propose --thesis "A small dinner on local-first memory"
node packages/cli/src/bin.ts follow-through            # list open promises
node packages/cli/src/bin.ts follow-through --fulfil <id>
node packages/cli/src/bin.ts publish --title "Draft" --json   # see the refusal gate in action
node packages/cli/src/bin.ts doctor                    # health + sovereignty checks
```

> **Tip:** add a shell alias so you can just type `gravity`:
> `alias gravity="node $(pwd)/packages/cli/src/bin.ts"`. After `pnpm install` the
> `starlight-gravity` binary is on your path directly.

---

## Path B — Markdown Starter (no install)

1. Copy [`starter-packs/markdown/`](starter-packs/markdown/) into any folder (or
   your notes vault).
2. Fill in `DIRECTION.md`.
3. Add one field note under `field-notes/`.
4. Open the folder with any capable AI agent (Claude, etc.) and paste the
   `gravity-capture` prompt from the pack.
5. Receive the same five outputs. Approve or decline each.
6. Run the `gravity-review` prompt after seven days.

The Markdown Starter is the on-ramp; the Local Engine is the same loop made
deterministic and durable. You can graduate from A to B — or start with B —
without losing anything.

---

## What "done" looks like on day one

- `DIRECTION.md` says where you're going.
- One real encounter is captured as signal.
- One promise is on the board.
- One appreciation or introduction is queued (awaiting your approval).
- One room theme is noted.
- `brief` shows a gravity score you can now grow.

That is a field with gravity. Now keep the loop.
