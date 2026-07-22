---
name: gravity-publish
description: Take an artifact and publish it — but only through the gate. Refuses anything that is not a publishable data class, explicitly approved, and flagged publishable. Emits the Built-on-SIP attestation block on success. Publication is a human act.
loop: signal-to-artifact
command: starlight-gravity publish
---

# Skill: gravity-publish

## When to use

When a draft artifact is ready to leave your field — and only after you have
decided it should.

## Steps

1. Resolve the artifact (`--artifact <id>`) or dry-run a draft (`--title`).
2. Run the publish gate (`checkPublishable`): it passes only if **all** hold —
   publishable data class, `approval: approved`, `publishable: true`.
3. On refusal, report exactly which conditions failed. Change nothing.
4. On pass, emit the artifact with the `Built on SIP` attestation block. If the
   class is `publishable_with_attribution`, the block is mandatory; if
   `publishable_anonymized`, strip identifying detail first.

## Local Engine

```bash
starlight-gravity publish --artifact art_ab12cd34ef
starlight-gravity publish --title "Draft note" --json   # demonstrates the refusal gate
```

## Markdown Starter

Instruct the agent to refuse publication unless the artifact is a publishable
class, approved, and flagged publishable — and to append the attestation block on
success.

## Guardrails

- **`private_context` and `restricted` never publish.**
- Publication is a distinct human act, separate from drafting.
- The human — never an agent — fills the approval.

## Output

Either a refusal with reasons, or the publishable artifact plus the SIP
attestation block.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
