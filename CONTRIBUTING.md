# Contributing

Thank you for wanting to strengthen the field. This is an open-core project with
a hard sovereignty spine — contributions are welcome inside that spine, and
declined outside it.

## The one rule that overrides the others

Read [CANON.md](CANON.md) first. Any change that moves the engine toward a CRM, a
dating system, an automated-networking bot, a social-ranking engine, or a
content-spam machine will be declined, no matter how well-built. If your change
touches a sovereignty guarantee, it must also touch the test that enforces it.

## Project shape

- `packages/core` — the engine. **Zero runtime dependencies.** Keep it that way;
  a dependency needs a strong, discussed reason.
- `packages/cli` — the `starlight-gravity` binary.
- `schemas/` — the JSON Schema contracts. If you change a schema, change the
  matching normalizer in `core/src/schemas.ts` and the schema gate will hold you
  to it.

## Dev setup

Node.js 22+ is required. With pnpm:

```bash
pnpm install
pnpm run verify   # schemas + tests + typecheck + lint + build
```

### Verifying without an install

The core has no runtime dependencies, so you can verify most of the engine with
**no `pnpm install`** — useful on constrained machines:

```bash
node scripts/link-workspace.mjs          # link @starlight-gravity/core (junction/symlink)
node scripts/validate-schemas.mjs        # schema gate
node --test "packages/*/test/**/*.test.ts"   # unit + integration tests
node packages/cli/src/bin.ts doctor      # smoke test the CLI
```

Node 22+ strips TypeScript types natively, so the `.ts` source runs directly.
`tsc` type-checking, `prettier` linting, and the production build still require
the devDependencies (`pnpm install`).

## Style

- Prettier is the formatter and the lint gate: single quotes, semicolons,
  trailing commas, 100-column width. Run `pnpm run format`.
- TypeScript strict mode, `NodeNext` modules. Relative imports use explicit
  `.ts` extensions (required by native stripping).
- Prefer parse-don't-validate: untrusted input goes through a normalizer that
  returns a typed value or throws.
- Determinism in the core. If you need the clock, take it as a parameter.

## Tests

Every meaningful behavior gets a test under `packages/*/test/`, run with the
built-in `node --test`. New sovereignty guarantees get an adversarial test that
tries to break them (e.g. "publishing a private artifact must be refused").

## Pull requests

1. Branch from `main` (e.g. `feat/...`, `fix/...`, `docs/...`).
2. Keep the diff focused. A small, verified change beats a large, plausible one.
3. Run `pnpm run verify` (or the no-install equivalent) and paste the evidence.
4. Fill in the PR template — including which canon rules your change touches.
5. Draft PRs are welcome for direction-setting before the work is finished.

## Reporting problems

- Bugs and feature ideas → GitHub issues (templates provided).
- Security or privacy concerns → [SECURITY.md](SECURITY.md). Please do not open a
  public issue for a vulnerability.

## License

By contributing you agree your contribution is licensed under the repository's
[MIT license](LICENSE).
