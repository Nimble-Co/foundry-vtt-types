# Phase 6 — Applications (`client/applications`) — detail

> Per-phase detail for the v14 migration. Slim tracker: [migration-v14.md](migration-v14.md). Closed phases: [migration-v14-archive.md](migration-v14-archive.md).

**Status: COMPLETE — CI green (2026-05-28).** All 65 stubs migrated; `src/foundry/client/` is stub-free. New v14 foundations authored: `PlaceableConfig`, the `TokenApplication` mixin members, the `DocumentDirectory` sidebar base, + the two missing journal page sheets. Scene-Levels precision deferred → P7 (see below).

## Scope

Fill the **65 stub files** (`@remarks TODO: Stub`) + add the missing application files (`applications/sheets/palette/`, `applications/sidebar/tabs/`, `filters/`, `ux/`, `elements/`).

Stub distribution (measured 2026-05-27 — `grep -rl "@remarks TODO: Stub" src/foundry/client/applications/`):

| Area                                           | Stubs |
| ---------------------------------------------- | ----- |
| `sheets/`                                      | 25    |
| `sidebar/`                                     | 21    |
| `settings/`                                    | 6     |
| `hud/`                                         | 5     |
| `apps/`                                        | 5     |
| `quickstart.d.mts`                             | 1     |
| (+ `client/data/` terrain-data, combat-config) | 2     |

## Sheets — the priority focus

Per the scope decision, **sheets are the high-value subset** (systems live in them). The most-overridden sheets — `actor-sheet`, `item-sheet`, the 7 journal _page-type_ sheets, region/ambient configs, folder/user configs — are **already developed**. The 25 remaining sheet stubs, in chosen priority order:

**Sheets cluster status (2026-05-28): COMPLETE except `scene-config`.** All 25 stubs filled + the missing journal siblings + the new `PlaceableConfig` base + the `TokenApplication` mixin members, each with a `.test-d.ts` and CI-green.

| Order                       | Files                                                                                                                                                                                     | Status                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **1**                       | `base-sheet`                                                                                                                                                                              | ✅ DONE                                                                             |
| **2 — Journal**             | `journal-entry-sheet` (1443 giant), `journal-entry-page-sheet`, `journal-entry-page-hbs-sheet`, `journal-entry-category-config`, `dialog-show` + missing `code-mirror`/`html` page sheets | ✅ DONE — subdir structurally complete                                              |
| **3 — Tier A**              | `active-effect-config`, `token/token-config`, `token/prototype-config`                                                                                                                    | ✅ DONE (token configs via new `PlaceableConfig` + filled `TokenApplication` mixin) |
| —                           | `scene-config` (980)                                                                                                                                                                      | ⛔ **NOT DONE** — Scene-Levels giant; genuinely blocked on the P7 `Level` document  |
| **Foundation**              | `placeable-config` (new v14 base), `token/mixin` (TokenApplication members)                                                                                                               | ✅ DONE                                                                             |
| **4 — Tier D (media/misc)** | playlist / playlist-sound / cards (4 classes) / card / macro / roll-table-sheet / table-result / combatant / adventure-importer / adventure-exporter                                      | ✅ DONE (10/10)                                                                     |
| **Tier B (placeable)**      | `drawing-config`, `note-config`, `tile-config`, `wall-config`, `template-config`                                                                                                          | ✅ DONE (rebased on `PlaceableConfig`; template-config independent + deprecated)    |

**Only remaining sheet stub: `scene-config`** — needs the `Level` document (Phase 7). Author Level first, then scene-config's `defaultLevel`/`document.levels`/add-edit-removeLevel surface.

### Recipe (from `base-sheet`, mirrors developed `UserConfig`)

Drop the `@remarks TODO: Stub`; declare the v14 members in source order — typically `static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions`, `static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>`, the `_prepareContext` override, plus a `#private: true` duck-typing guard; the `RenderContext`/`Configuration`/`RenderOptions` namespaces capture the type surface. Add/extend a `.test-d.ts` mirror.

### Journal cluster — missing files ✅ DONE (2026-05-28)

Foundry's `sheets/journal/_module.mjs` exported two page-sheet classes that had **no file in the repo**. Both now added + barreled (source order), CI-green:

- `journal-entry-page-code-mirror-sheet` → `JournalEntryPageCodeMirrorSheet` ✅
- `journal-entry-page-html-sheet` → `JournalEntryPageHTMLSheet` ✅

The journal subdir is now structurally complete (all 14 source files mirrored).

### Scope discovery — `PlaceableConfig` base (2026-05-28)

v14 introduced **`sheets/placeable-config.mjs`** (`PlaceableConfig extends HandlebarsApplicationMixin(DocumentSheetV2)`, 179 src) as the shared base for **every placeable config**: token, prototype-token, drawing, note, tile, wall, template, ambient-light, ambient-sound, region. **The repo has no `placeable-config.d.mts`.** The current `token-config`/`prototype-config` stubs use `TokenApplicationMixin(DocumentSheetV2)` / `TokenApplicationMixin(ApplicationV2)` as placeholder bases — that's wrong; v14 is `TokenApplicationMixin(PlaceableConfig)`.

Two consequences for Tier A:

1. **`token/token-config` + `token/prototype-config` are blocked** on authoring `PlaceableConfig` first. They also override shared members (`token`, `actor`, `_fields`, `_prepareAppearanceTab`, `_previewChanges`, `isPrototype`) that live on **`TokenApplicationMixin`** — whose `mixin.d.mts` `TokenApplication` class is currently an **empty stub** (only a constructor). So filling token configs needs: (a) author `PlaceableConfig`, (b) fill the `TokenApplication` mixin members, (c) then the two configs.
2. **`PlaceableConfig._prepareContext` couples to Scene Levels** (`scene.levels`, `scene.availableLevels`, `level.id/name`) — a **Phase 7 deferral**. Author the Level-coupled bits with loose (`object`) typing + `// FIXME … → P7`, mirroring the Phase 5 approach.

`PlaceableConfig` is high-leverage (unblocks ~9 configs incl. the deferred Tier B) and squarely Phase 6 — author it as its own focused batch.

## Non-sheet clusters — status (2026-05-28)

- **`apps/` — ✅ DONE** (all 5: combat-tracker-config, document-ownership, grid-config, av/camera-popout, av/cameras).
- **`hud/` — ✅ DONE** (BasePlaceableHUD + drawing/tile/token huds + container).
- **`settings/` — ✅ DONE** (dice-config, ui-config, prototype-overrides, av-config, dependency-resolution, font-config).
- **`quickstart` — ✅ DONE.**
- **`sidebar/` — NOT DONE (21 stubs remain).** This was the most-deprioritized cluster. Structure:
  - **Foundation:** `document-directory` (DocumentDirectory, 1400) + `tabs/abstract` base. The small directory tabs extend `DocumentDirectory`.
  - **Small directory tabs (quick):** macro (19), cards (36), journal (37), roll-table (38), item (48), actor (97), scene (107) — mostly just `DEFAULT_OPTIONS`/metadata over `DocumentDirectory`.
  - **Giants (session-sized each):** `chat` (1590), `compendium-directory` (1126), `playlist-directory` (963), `combat-tracker` (797), `tabs/settings` (118).
  - **Sidebar apps:** module-management (523), controls-config (505, CategoryBrowser), support-details (412), compendium (279), world-config (236), chat-popout (124), invitation-links (119), frame-viewer (64).
- **`sidebar/` — ✅ DONE.** Foundation `DocumentDirectory` (1400) authored; the 7 directory tabs + 5 giants (chat/compendium-directory/playlist-directory/combat-tracker/tabs-settings) + 8 sidebar apps all filled.
- **`client/data/` — ✅ DONE** (terrain-data, combat-config).

### → Phase 7 deferral: Scene Levels precision

`scene-config` and `PlaceableConfig` are migrated but their **Scene-Levels-coupled members are typed as `object` with `// FIXME … → P7`**, because the `Level` document isn't authored yet:

- `scene-config`: `get defaultLevel()`, `_getLevelContextOptions()`, `_onSortLevel(event, level)`.
- `PlaceableConfig`: body-level coupling only (`selectableLevels`); its type surface is already concrete.

Authoring the `Level` document in Phase 7 should tighten these (and is tracked alongside Phase 5's `Level` FIXMEs in [phase-7](migration-v14-phase-7.md)).

## Deprioritized (do only if explicitly requested)

`sidebar/` (21, above) — mostly Foundry-internal UI, low consumer reach. See the scope-priority decision.

## Inherited deferrals (action these in Phase 6)

None currently. (The `paletteClass` / palette-app deferral lives in Phase 5's `5.6g`, since the palette classes are authored there.)
