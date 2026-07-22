# Visual system

Four raster visuals carry the Gravity Engine's identity. Aesthetic: cinematic,
sophisticated, restrained — a field of light, not corporate stock. Palette:
**obsidian**, **midnight blue**, **aurora cyan**, subtle **gold**. No flat SVG
diagrams; these are rendered images.

Each asset ships as an optimized `.webp` for web surfaces plus a full-resolution
`.png` master, with descriptive alt text and provenance recorded in
[`provenance.json`](provenance.json). All four slots below are shipped
(generated with Higgsfield `nano_banana_2`, 2026-07-22). If an asset is ever
missing, the referencing page degrades gracefully via its alt text.

> **QC note:** `four-loops.webp` contains minor generative-text garbling — a
> nonsense token (“pubifact”) in the Signal→Artifact loop and a few duplicated
> center labels. The four loop titles and the other loops' steps are correct. It
> is shipped with this flag; a clean regeneration is tracked as a follow-up.

| Slot          | File               | Used in                                                    | Status     |
| ------------- | ------------------ | ---------------------------------------------------------- | ---------- |
| Hero          | `hero.webp`        | `README.md`                                                | ✅ shipped |
| Five Forces   | `five-forces.webp` | `README.md`, `docs/metrics.md`                             | ✅ shipped |
| Human × Agent | `human-agent.webp` | `docs/human-engineering.md`, `docs/agentic-engineering.md` | ✅ shipped |
| Four Loops    | `four-loops.webp`  | `docs/four-loops.md`                                       | ✅ shipped |

## Generation prompts + alt text

### 1. `hero.webp` — Cinematic README hero

**Alt:** _A single human standing within a luminous constellation of ideas,
artifacts, conversations, and small circles of people — the Starlight Gravity
Engine rendered as a field of light in obsidian, midnight blue, aurora cyan, and
gold._

**Prompt:** A lone figure seen from behind, standing at the center of a vast dark
space, surrounded by a three-dimensional constellation of glowing nodes — some
are documents and artifacts, some are speech bubbles and conversations, some are
intimate circles of a few people. Faint gravitational filaments connect the
figure to the brightest nodes. Obsidian black background, midnight-blue depth,
aurora-cyan light, occasional warm gold accents. Cinematic, reverent, spacious,
high detail, no text, no logos, no corporate stock aesthetic.

### 2. `five-forces.webp` — The Five Forces of Human Gravity

**Alt:** _Five luminous forces — Direction, Signal, Contribution, Convening,
Reliability — orbiting a central point of light, multiplied together into a
single gravitational field._

**Prompt:** Five distinct glowing orbs arranged around a bright core, each labeled
in the composition as a force of gravity, connected by light that multiplies
rather than adds. Same obsidian / midnight-blue / aurora-cyan / gold palette.
Elegant, diagram-like but rendered as light, not flat vector.

### 3. `human-agent.webp` — Human × Agentic Engineering

**Alt:** _Two intertwined systems of light — a human hand and an agentic lattice —
where the human sparks gravity and the agent's lattice makes it compound._

**Prompt:** A split, intertwined composition: on one side a human silhouette
radiating warm gold light (judgment, presence, generosity, trust); on the other a
precise geometric lattice in aurora cyan (memory, consistency, preparation,
cycle frequency). They weave together at the center. The human sparks; the
lattice amplifies. Obsidian ground, cinematic, no text.

### 4. `four-loops.webp` — The Four Compounding Loops

**Alt:** _Four interlocking loops of light — Signal→Artifact, Room→Network,
Relationship→Contribution, Learning→Evolution — feeding one another in a
compounding spiral._

**Prompt:** Four luminous loops of light interlocking like gears made of energy,
each a cycle, arranged so the output of each feeds the next, spiraling inward
toward brighter light. Obsidian / midnight-blue / aurora-cyan / gold. Cinematic,
sense of momentum and compounding.

## Adding an asset

1. Generate at high resolution; export optimized `.webp` (target < 400 KB for
   hero, < 200 KB for the others).
2. Drop it in this folder under the filename above.
3. Fill in its entry in `provenance.json` (tool, model, date, prompt, license).
4. Confirm the alt text on the referencing page still matches the image.

---

Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT
