# v14 Migration Plan & Tracker

## When to consult this file

This is the **slim structural tracker** — the single source of truth for _what's done and what's next_ in the Foundry v13 → v14 type migration. It holds the roadmap, the scope priority, and the next-session pointer. **Per-phase detail lives in separate files** (`migration-v14-phase-N.md`) — read only the one for the phase you're working. Closed phases 1–4 are in [migration-v14-archive.md](migration-v14-archive.md). Read this file before starting any v14 work; keep it current as phases progress.

Ground truth for every decision is the Foundry v14.363.0 source at `/home/fronix/git/foundry/resources/app/` (`client/`, `common/`, `public/scripts/`). When the source disagrees with this plan, the source wins — fix the plan.

> **This tracker stays slim by design.** Bulk content — per-batch findings, inherited deferrals, drift surveys — goes in the per-phase files, NOT here. The only things in this file are size-capped: the 8 roadmap rows, the scope priority, and a single overwritten next-session callout. If you're about to paste a paragraph here, it belongs in a phase file.

## Definition of "done" (the per-file bar)

A file is **migrated to v14** only when all three hold:

1. **Source-diffed** — members (order, signatures, additions, removals) compared against the corresponding v14 `.mjs`. Member order matches source (per [conventions.md](../../conventions.md)).
2. **CI-green** — `npm run typecheck` (tsgo), `npx tsc --exactOptionalPropertyTypes false`, raw `npx tsgo`, `npm run lint`, `npm run test-types`.
3. **Type-tested** — a `.test-d.ts` exercises the changed/added surface.

CI-green alone is **not** sufficient — CI doesn't know the v14 source, so silent v13 drift survives it. The diff is what catches drift.

## Sequencing principle

**Foundation-up by layer:** `common/abstract` → `common/documents` → `client/documents` → `client/canvas` → `client/applications` → greenfield (`vfx`, region-behaviors) → cleanup. The new `canvas/vfx/` subsystem (no v13 analog, no consumers) is intentionally last.

## Branch & merge strategy

**All v14 work lives on the single long-running `v14` branch (off `main`). Commit every phase directly onto `v14` — no per-phase branches.** Push only to `origin` (the Fronix fork) — never `upstream` (League). When ready, merge `v14` into `main` in one fast-forward (`main` doesn't drift — fork-only — so the merge stays conflict-free).

**Versioning for consumption:** `v14` is the rolling dev line; frozen installable versions are **annotated tags** matching `package.json` and the historical `v9.x` convention (first: `v14.363.0`, pushed to `origin` 2026-05-28; retagged to the tip that adds `MIGRATING.md`). Consume via `fvtt-types@github:Fronix/foundry-vtt-types#v14.363.0`. On a Foundry build bump, bump `package.json` and cut the next tag (`v14.364.0`, …) — do **not** rename the branch.

---

## Roadmap

Status is one line per phase. Open the linked **phase file** for batch-level detail and that phase's inherited deferrals.

| Phase | Scope (short)                                                                                         | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Detail                              |
| ----- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **1** | `createDialog` → `.Stored \| null` + `renderOptions` param                                            | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [archive](migration-v14-archive.md) |
| **2** | Remove the `Temporary` create-operation concept (~85 files)                                           | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [archive](migration-v14-archive.md) |
| **3** | Verify `common/abstract` + `common/data` + `common/documents` schemas                                 | **Done** (deferrals → P5/P7/P8)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [archive](migration-v14-archive.md) |
| **4** | Verify `client/documents` leaf classes member-by-member                                               | **Done — CI green** (28 `[x]`; 4 Tier-B giants + measured-template → P7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | [archive](migration-v14-archive.md) |
| **5** | Canvas: verify + fill + add (ex-vfx)                                                                  | **Done — CI green** (5.1–5.7 all done; commit `22b8d9225`. Scene-Levels-coupled bits FIXME'd → P7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | [phase-5](migration-v14-phase-5.md) |
| **6** | Applications: fill 65 stubs + missing files                                                           | **DONE — CI green**: all 65 stubs migrated (sheets, apps, hud, settings, sidebar, quickstart, client/data) + missing journal sheets + new `PlaceableConfig` base + `TokenApplication`/`DocumentDirectory` foundations. `client/` is stub-free. (Scene-Levels precision in scene-config/PlaceableConfig FIXME'd → P7.)                                                                                                                                                                                                                                                                                                                                            | [phase-6](migration-v14-phase-6.md) |
| **7** | Greenfield: vfx, region-behaviors, **Scene Levels**, 4 Tier-B giants, MeasuredTemplate, shapes barrel | **DONE (pragmatic high-value scope) — CI green.** All 4 Tier-B giants, Scene Levels, region-behaviors, operators, the full **`canvas/vfx/`** subsystem (27 files), source-polygon Level/surfaceExposure, and the **MeasuredTemplate deprecation surface**. The MeasuredTemplate structural un-embed + shapes-barrel are **WON'T-DO** (descoped — subtract usable deprecated surface, no consumer value pre-v16). Optional leftovers: member-order parity (out of scope per scope-priority) + P8 `removed in v14` prune.                                                                                                                                          | [phase-7](migration-v14-phase-7.md) |
| **8** | Cleanup: remove `removed in v14` deprecations, bump to `14.x`, backfill tests                         | **DONE (pragmatic high-value scope) — CI green** (commit `13dda9913`). `removed in v14` pass done **non-breaking**: removed category (b) accuracy wins (members v14 genuinely dropped), kept + reworded category (a) migration aids (TS-only alias renames) → `removed in a future version`. Version bump + inherited embedded-collection stubs done. The `_onXDocuments` static-method structural removal (formerly the sign-off-gated document.d.mts boundary remainder) is now **DONE — CI green (2026-07-02)**; breaking change, 75 files, −3559. Remaining non-gating: ~210 `until v14` reword, `TypedObjectField` create-optionality, member-order parity. | [phase-8](migration-v14-phase-8.md) |

Closed phases' full detail (per-file checklists, drift surveys, commit lists, reusable findings) and the original baseline-landscape survey are in [migration-v14-archive.md](migration-v14-archive.md).

---

## Scope priority

**Decided 2026-05-27 — pursue a pragmatic high-value subset, NOT full member-by-member parity.** Full parity ≈ 27–40 more sessions; the long tail (sidebar UI, vfx) is high-volume / low-consumer-value. Reordered priority (overrides the numeric phase order):

1. ~~**Finish Phase 5 canvas**~~ **DONE** (commit `22b8d9225`) — canvas fully migrated; Scene-Levels bits FIXME'd → P7.
2. **Sheets** (Phase 6 subset) — high consumer value; **interleaved now**. Order: `base-sheet` ✅ → journal → Tier A → media; Tier B (placeable configs) deferred. See [phase-6](migration-v14-phase-6.md).
3. **Phase 7 document giants + Scene Levels** — the most-consumed types; highest remaining leverage.
4. **Usability MVP items** (cheap — pull forward from P8): bump `package.json` → `14.x`; prune the `removed in v14` accuracy-wins. See [phase-8](migration-v14-phase-8.md).

**Deprioritized — do only if explicitly requested:** `sidebar/` tabs, `settings/` menus, and **`canvas/vfx/`** (no v13 analog, no consumers). Revisit once 1–3 land.

The package is **already substantially usable on v14** for backward-compatible usage — the migrated document/data/config core covers what most consumers touch, and unmigrated giants keep a working v13-compatible surface (they only lack v14's _new_ members).

---

> ### ▶ Next session — start here
>
> **All 8 phases closed + the `_onXDocuments` boundary removal DONE (2026-07-02, CI green, uncommitted at time of writing). The v14 migration's pragmatic high-value scope is complete, plus one sign-off-gated boundary refactor is now landed.**
>
> **What this session did (2026-07-02):** executed the previously-deferred **`_onCreateDocuments`/`_onUpdateDocuments`/`_onDeleteDocuments` static-method structural removal** (was remainder item 1) with explicit maintainer sign-off. A source check was decisive: the three methods are **100% absent** from the v14.363.0 runtime (zero occurrences in `resources/app/`), meeting Phase 8's own category-(b) removal bar. Full boundary pass: 3 base methods + 105 leaf overrides + 104 namespace interfaces + 105 lookup-map entries + dead context aliases + 3 `OnXDocumentsOperation<Base>` boundary types + 3 dead `…ForName` types + 3 `Internal.Lookup` union entries removed; `_RestrictToDataObjects` simplified (dead `Extract` branch dropped); `backend.d.mts` `// TODO: remove … in v14` remark cleared; test fixtures updated (incl. fixing a pre-existing base-reuse quirk in the live `onDeleteOperation` builder). **Net: 75 files, +6 / −3559.** All five CI gates green (tsgo, `tsc --eOPT false`, raw tsgo, eslint+prettier, 533-file/460-test type-tests). **This is a breaking change** for consumers calling `super._onCreateDocuments`/`_onUpdateDocuments`/`_onDeleteDocuments` — they must use the `_onCreateOperation`/`_onUpdateOperation`/`_onDeleteOperation` replacements. Detail: [phase-8](migration-v14-phase-8.md) Remaining item 1. Earlier P8 work (the non-breaking `removed in v14` prune, commit `13dda9913`; version bump to `14.363.0`) unchanged.
>
> **Remaining (all explicitly non-gating, none consumer-blocking):**
>
> 1. **~210 `until v14` markers** — a separate deprecation-window bucket; the item-1 method notes are now **gone** (removed with the methods). For the rest, prefer bumping/dropping the concrete Foundry window (`until v14/v15/v16` mirror Foundry's `{since, until}` metadata) over inventing an "until a future version" phrase.
> 2. **`TypedObjectField` create-optionality** — give it `SchemaField`'s implicit-`{}`-initial, then drop the `token.detectionModes` `{ initial: Record<string, never> }` workaround. `fields.d.mts` ergonomic enhancement, not phase-gated.
> 3. **Member-order parity** on `scene`/`active-effect` — out of scope per the [scope-priority decision](#scope-priority).
>
> **Assessment:** the multi-phase v14 migration is complete to its agreed scope, CI-green, and the one sign-off-gated boundary refactor has now landed. Remaining items are an opportunistic comment tidy, an optional `fields.d.mts` enhancement, and cosmetic parity — all deprioritised. Next real step is the `v14`→`main` fast-forward merge (fork-only, conflict-free per branch strategy) when the maintainer is ready — plus committing this session's `_onXDocuments` removal if not already done.
>
> **Kickoff message** (paste verbatim):
>
> ```
> The v14 migration is complete to its pragmatic high-value scope (all 8 phases done, CI-green), and the previously-deferred `_onXDocuments` static-method boundary removal is now DONE too (2026-07-02, CI green — a breaking change; the 3 methods were verified 100% absent from v14.363.0 source). See migration-v14-phase-8.md Remaining item 1. Three explicitly non-gating remainders are left (the ~210 `until v14` window reword; the TypedObjectField create-optionality enhancement; member-order parity). If you want to ship, the next step is the v14→main fast-forward merge (fork-only); confirm this session's removal is committed first. Otherwise pick up any documented remainder.
> ```
>
> _Maintainers: overwrite this block (not append) when a batch/phase closes._

---

## How to update this file

Single source of truth for _status_; the work spans many sessions, so keeping it current is mandatory.

### Per-session protocol

1. **Start:** read this file (roadmap + scope priority + next-session). Open the **phase file** for the active phase for batch detail + that phase's inherited deferrals. Don't re-derive the plan.
2. **As you work:** if you discover scope that crosses phases, **append it to the _receiving_ phase's file** under its `## Inherited deferrals` section — NOT here (there is no central deferral list, by design). If it reshapes a phase, fix that phase's roadmap row + file.
3. **Before finishing / each commit:** sync (a) the **roadmap status row**, (b) the active **phase file** (checkboxes, commits landed, findings, remaining items), (c) the **next-session callout** (overwrite, don't append), and (d) any **inherited deferral** you added or actioned (in the receiving phase file).

### Maintenance rules

- Check a box only when a file meets all three done-bar criteria; use `[~]` + a note for partial work.
- **This tracker stays slim** — detail, findings, and deferrals go in phase files. Never grow this file with per-batch prose.
- Record the v14 source build diffed against if it changes (currently 14.363.0).
- The global "nothing-dropped" deferral view is reconstructable on demand: `grep -l "Inherited deferrals" docs/agents/migration-v14-phase-*.md`, then read those sections.
- **When a phase closes (CI-green & committed):** flip its roadmap status, point its Detail link at the archive, and move the phase file's content into [migration-v14-archive.md](migration-v14-archive.md) (lift any still-open inherited deferrals into the _next_ receiving phase file first). Nothing is deleted — archiving is a move.
