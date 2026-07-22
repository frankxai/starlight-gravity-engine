# Generic starter — the engine-agnostic recipe

The Gravity Engine is a loop, not a product. This is the loop written as plain
steps any human or agent can follow — with the Local Engine CLI, with the
Markdown Starter, or by hand. Nothing here depends on a particular tool.

## The one loop, five moves

1. **Direction.** Write where you are going in one sentence, plus your themes and
   values. Everything you capture is scored against this. (Local Engine: fill in
   `DIRECTION.md`.)
2. **Capture.** After a real encounter, write a short field note — observable
   only. Turn it into five outputs: strongest signal, artifact opportunity,
   follow-through, appreciation or introduction, room theme.
3. **Contribute.** Keep the promise you named. Make an introduction (with consent
   from both). Ship the artifact through the publish gate.
4. **Convene.** When a theme recurs, propose a room from a thesis — why these
   people, why now — host it, and record the synthesis.
5. **Review.** Weekly, read the whole field: your gravity score, the delta since
   last week, and the one weakest force to strengthen next.

`Gravity = Direction × Signal × Contribution × Convening × Reliability`. It is a
product, not a sum — a zero in any force collapses the whole. Raise your weakest
force, not your strongest.

## With the Local Engine (Node 22+)

```bash
node packages/cli/src/bin.ts init
node packages/cli/src/bin.ts capture --file note.md --save
node packages/cli/src/bin.ts brief
node packages/cli/src/bin.ts room propose --thesis "..."
node packages/cli/src/bin.ts follow-through          # --fulfil <id> to close one
node packages/cli/src/bin.ts publish --title "Draft"
node packages/cli/src/bin.ts review
```

After `pnpm install`, the same commands are available as the `starlight-gravity`
binary on your path.

## Without any software

Use the [Markdown Starter](../markdown/): a `DIRECTION.md`, one file per
encounter under `field-notes/`, and the paste-in prompts. Any capable AI agent
runs the same loop over those files and returns the same five outputs.

## The rules, whichever tool you use

- Observable only — never speculate about people's interiors.
- No rankings of people, ever.
- Private by default; publication is a separate, explicit human act.
- Introductions need dual consent.
- The human approves every side-effect. The engine never acts alone.

Full, enforced rule set: [CANON.md](../../CANON.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
