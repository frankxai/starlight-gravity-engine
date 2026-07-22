# Provenance (shared definition)

Every signal and artifact — and the person/commitment/room/introduction records
that reference them — carries a `provenance` object. It is defined inline in each
schema's `$defs` (the validator resolves `$ref` within a single file), but the
shape is identical everywhere and documented once here:

| Field         | Type    | Required | Notes                                                                                                   |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `source`      | string  | yes      | Where it came from, e.g. `field-note:2026-07-22-dinner`                                                 |
| `capturedBy`  | string  | yes      | `human` or an agent id — agents never impersonate the human                                             |
| `capturedAt`  | string  | yes      | ISO-8601 date-time                                                                                      |
| `dataClass`   | enum    | yes      | `public` · `publishable_with_attribution` · `publishable_anonymized` · `private_context` · `restricted` |
| `approval`    | enum    | no       | `proposed` (default) · `approved` · `declined`                                                          |
| `publishable` | boolean | no       | Defaults `false`. Publication is always an explicit human act                                           |

Private-by-default: absent `approval`/`publishable`, a record is `proposed` and
non-publishable. See `docs/privacy-consent-and-sovereignty.md`.
