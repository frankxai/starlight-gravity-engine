# Example: Founder

A worked field for a founder building sovereign infrastructure. Every person and
event here is **synthetic** — Ada, Grace, and Kenji are invented, and nothing in
this folder is real relationship data. It exists so you can run the engine
against a healthy field and see what "gravity" looks like before you have one.

The field lives in [`.gravity/`](.gravity/) and is committed as plain JSON, so
you can read the exact wire format the engine stores.

## The scenario

You are building _"the local-first operating system for sovereign creators."_
Over three weeks you had a handful of real encounters — a dinner, an investor
call, a founders' cohort demo — and you ran each one through the engine.

## Run it yourself

Every command below reads this folder's field via `--dir`. Nothing is written
unless you ask.

```bash
# See the whole field at a glance
starlight-gravity brief --dir examples/founder
```

```
★ Daily brief
  gravity        68/100
  direction      1.00
  signal         0.85
  contribution   0.80
  convening      1.00
  reliability    1.00

  Open commitments:
  - intro note: Ada × Grace — Write the intro rationale for Ada and Grace. [due 2026-07-30…]

  Recent signals:
  - (strong) Sovereignty is the real moat for agentic systems…
  - (strong) Local-first storage is the wedge — own the bytes and the trust follows.
  …
  → Weakest force: contribution (0.80). Strengthen it to compound the rest.
```

Gravity is **68/100**. Read it as a product, not an average: Direction,
Convening, and Reliability are maxed; Signal and Contribution are the levers
left. The engine names the single weakest force instead of a vanity dashboard.

## What each force came from

| Force            | In this field                                                        |
| ---------------- | -------------------------------------------------------------------- |
| **Direction**    | A clear statement with three themes and two values (`DIRECTION.md`). |
| **Signal**       | Five captured signals across three weeks, all recent.                |
| **Contribution** | Two kept commitments, one made introduction, one published essay.    |
| **Convening**    | Two rooms — one hosted, one synthesized into follow-ups.             |
| **Reliability**  | Every due commitment was kept; nothing is overdue.                   |

## The open loop

One commitment is still open — the intro rationale for Ada and Grace:

```bash
starlight-gravity follow-through --dir examples/founder
```

When you write it and make the introduction, close the loop:

```bash
starlight-gravity follow-through --dir examples/founder --fulfil cmt_intro_note
```

Reliability holds; Contribution rises. That is the whole game — one kept promise
at a time.

## The published artifact

`art_moat` ("Local-first memory is the real moat") is the one record in this
field marked `public` / `approved` / `publishable`. Everything else is
`private_context`. Only the approved artifact clears the publish gate:

```bash
starlight-gravity publish --dir examples/founder --artifact art_moat --node "You"
```

It emits a `Built on SIP` attestation block. Try it on any other id and the
engine refuses — publication is always an explicit, gated act.

## How you would have built this from zero

```bash
starlight-gravity init                       # create .gravity/ + DIRECTION.md
# edit DIRECTION.md — statement, themes, values
starlight-gravity capture --file dinner.md --save
starlight-gravity room propose --thesis "A small room on local-first sovereignty"
# host it, then record the synthesis; keep your promises; make the intro
starlight-gravity review                      # weekly: watch the forces compound
```

---

Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT
