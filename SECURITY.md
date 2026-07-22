# Security & privacy policy

The Gravity Engine holds some of the most sensitive data a person has: what they
notice, who they know, what they promised, and what was said in confidence. The
security posture reflects that.

## Posture

- **Local-first.** The Local Engine stores everything as plain JSON under
  `.gravity/` on your machine. No cloud account, no telemetry, no network calls
  in the core.
- **Zero runtime dependencies** in `@starlight-gravity/core`. A smaller supply
  chain is a smaller attack surface.
- **Private by default.** Every captured record is `private_context` until a
  human explicitly reclassifies and approves it. See [CANON.md](CANON.md).
- **No secrets in the repo.** The engine needs none to run. Connected-mode
  adapters read credentials from the environment, never from committed files.
  `.env*` is git-ignored.

## What the engine will not do

These are security properties, enforced in code, not just policy:

- It will **not** send messages, invitations, or introductions on your behalf
  without explicit approval. Local mode has no send capability at all.
- It will **not** scrape or ingest raw private messages.
- It will **not** publish anything marked `private_context` or `restricted`.
- It will **not** store speculative inferences about people (attraction,
  diagnosis, hidden intent), and it will **not** rank people — the data model
  makes ranking fields structurally impossible.

## Handling your data

- **Export:** `store.export()` (and `starlight-gravity` tooling) returns your
  entire field as JSON.
- **Delete:** `store.destroy()` removes the field directory. Sovereignty includes
  the right to leave.
- **Backups & sync** in Connected mode are opt-in and under your control.

## Reporting a vulnerability

If you find a security or privacy vulnerability:

1. **Do not** open a public GitHub issue.
2. Email the maintainer (see the profile on
   [github.com/frankxai](https://github.com/frankxai)) with a description, repro
   steps, and impact.
3. You will get an acknowledgement, and we will agree a disclosure timeline
   before anything is made public.

Please act in good faith: test only against your own local field, do not access
data that is not yours, and give us reasonable time to remediate.

## Supported versions

This is a pre-1.0 project. Security fixes land on `main` and in the latest
`0.x` release. Pin a commit if you need stability.
