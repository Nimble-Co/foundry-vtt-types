# v14 Migration — Closed-Phase Archive

## What this file is

This is the **historical detail for completed v14 migration phases**, moved out of [migration-v14.md](migration-v14.md) so the live tracker stays small enough to load into every agent session without a performance hit. **Nothing here is dead** — it is the per-file checklist, drift survey, commit list, and reusable type-system findings for each phase that has reached the done bar.

This file is historical; nothing loads it automatically. Read it on demand when you need closed-phase specifics: which commit landed a given change, the exact field rewrites a phase applied, or a reusable gotcha (e.g. the `GridOffsetField` dimensions wart). The **live** roadmap, status, and cross-phase deferrals all live in [migration-v14.md](migration-v14.md) — that file remains the single source of truth for _what is still open_. This one is the record of _what is closed_.

When a phase closes (CI-green & committed), move its expanded detail here and leave a one-line pointer in the live tracker (see that file's maintenance rules).

---

## Phase 1 — detail: `createDialog` → v14 signature

**Status: Done — CI green.**

### What changed in v14 (verified against source)

- `ClientDocument.createDialog` (`client/documents/abstract/client-document.mjs:763`) returns `Promise<Document | null>` — **always a stored document** or `null`. There is no `temporary` path.
- It gains a **4th parameter `renderOptions={}`** (forwarded to the created document's sheet render): `createDialog(data, createOptions, {folders, types, template, context, ...dialogOptions}, renderOptions)`.
- The 2nd parameter `createOptions` is a `DatabaseCreateOperation` (note: in v14 that type no longer has `temporary` — but the full removal of `Temporary` is **Phase 2**, not here).
- The v13 deprecated calling convention is retained until **v15** (`CreateDialogDeprecatedOptions` is marked "removed in v15"), so **do not delete the deprecated path in this phase**.

### The change, per file

1. In each document namespace, change `CreateDialogReturn` from taking a `Temporary` type parameter and resolving via `TemporaryIf<Temporary>` to inlining `.Stored`:
   - Before: `type CreateDialogReturn<Temporary, Config> = Document.CreateDialogReturn<X.TemporaryIf<Temporary>, Config>;`
   - After: `type CreateDialogReturn<Config> = Document.CreateDialogReturn<X.Stored, Config>;`
   - Remove the now-redundant `// TODO: inline .Stored in v14 instead of taking Temporary` comment.
2. Add the `renderOptions` 4th parameter to the `createDialog` signature surface (the mixin overload at `client-document.d.mts:483` and any per-document override). Type it against the document sheet's render options.
3. Update/extend each document's `*.test-d.ts` to assert the return is `.Stored | null` and that `renderOptions` is accepted.

Keep `common/abstract/document.d.mts` edits **surgical** — only what `Document.CreateDialogReturn` requires. Anything deeper (the `Temporary` plumbing) is Phase 2.

### Phase 1 file checklist (34 documents + mixin)

- [x] `client/documents/abstract/client-document.d.mts` (base `createDialog` overload + `renderOptions` param)
- [x] `client/documents/active-effect.d.mts`
- [x] `client/documents/actor.d.mts`
- [x] `client/documents/actor-delta.d.mts`
- [x] `client/documents/adventure.d.mts`
- [x] `client/documents/ambient-light.d.mts`
- [x] `client/documents/ambient-sound.d.mts`
- [x] `client/documents/card.d.mts`
- [x] `client/documents/cards.d.mts`
- [x] `client/documents/chat-message.d.mts`
- [x] `client/documents/combat.d.mts`
- [x] `client/documents/combatant.d.mts`
- [x] `client/documents/combatant-group.d.mts`
- [x] `client/documents/drawing.d.mts`
- [x] `client/documents/fog-exploration.d.mts`
- [x] `client/documents/folder.d.mts`
- [x] `client/documents/item.d.mts`
- [x] `client/documents/journal-entry.d.mts`
- [x] `client/documents/journal-entry-category.d.mts`
- [x] `client/documents/journal-entry-page.d.mts`
- [x] `client/documents/macro.d.mts`
- [x] `client/documents/measured-template.d.mts`
- [x] `client/documents/note.d.mts`
- [x] `client/documents/playlist.d.mts`
- [x] `client/documents/playlist-sound.d.mts`
- [x] `client/documents/region.d.mts`
- [x] `client/documents/region-behavior.d.mts`
- [x] `client/documents/roll-table.d.mts`
- [x] `client/documents/scene.d.mts`
- [x] `client/documents/setting.d.mts`
- [x] `client/documents/table-result.d.mts`
- [x] `client/documents/tile.d.mts`
- [x] `client/documents/token.d.mts`
- [x] `client/documents/user.d.mts`
- [x] `client/documents/wall.d.mts`

### Phase 1 exit criteria

All 35 boxes checked to the done bar; `grep -r "inline .Stored in v14" src/` returns nothing; full CI green.

---

## Phase 2 — detail: remove the `Temporary` create-operation concept

**Status: Done — CI green** (85 files, +1041/−1872; originally branch `v14/remove-temporary`, now linear history on `v14`).

### What changed in v14 (verified against source)

- `DatabaseCreateOperation` (`common/abstract/_types.mjs:114`) has **no `temporary` field**.
- `DocumentCloneOptions` (`common/abstract/_types.mjs:206`) has **no `temporary`** (`save`/`keepId`/`addSource`/`discardInvalidEmbedded`).
- `importFromCompendium` (`client/documents/abstract/world-collection.mjs:80`) always returns a stored document.
- The `temporary?` field on `DatabaseBackend.CreateOperation` was deprecated "since v12, until v14" — removed now.

Net: every create/clone/import resolves to `.Stored` (or `null`/`undefined` on cancellation). The `Temporary` type parameter, `X.TemporaryIf<Temporary>`, and `Document.TemporaryIfForName` are all deleted. This is one **atomic** change — a half-removed type parameter does not typecheck, so there is no independently-compiling sub-slice.

### The change, by layer

1. **Core boundary files** (edit first, carefully):
   - `common/abstract/backend.d.mts` — drop `Temporary` type param + the `temporary?: Temporary` field from `CreateOperation`.
   - `common/abstract/_types.d.mts` — drop `Temporary` from the `CreateOperation` alias.
   - `common/abstract/document.d.mts` — drop `Temporary` from the 5 `*ForName` create lookups + `Internal.Lookup`; remove `"temporary"` from the `OnCreateOptions` / `OnCreateOperation` / `CloneContext` omits; remove the `temporary?` field from `ModificationContext`; **delete `TemporaryIfForName`**.
2. **`client/documents/*` (34)** — drop `Temporary` from `CreateOperation` + the 5 derived create interfaces, `OperationNameMap`, the deprecated `Create` alias, `CreateDialogDeprecatedOptions`, and the deprecated `createDialog` overload; collapse `CreateReturn<Data, Temporary>` → `CreateReturn<Data>` and the body's `TemporaryIf<Temporary>` → `.Stored`; **delete each `TemporaryIf`**.
3. **`common/documents/*` (34)** — drop `Temporary` from `create`/`createDocuments` overrides (return `.Stored` / `CreateReturn<Data>`); remove `export import TemporaryIf`.
4. **`client/documents/abstract/world-collection.d.mts`** — `importFromCompendium` returns `Document.StoredForName<DocumentName>`; drop `Temporary` from it and from `ImportFromCompendiumOptions`.
5. **Tests (~19 `.test-d.ts`)** — drop `Temporary` type args / `TemporaryIf` assertions; assert `.Stored`.

The deprecated v13 `createDialog` _calling convention_ (`CreateDialogDeprecatedOptions`, "until v15") stays — it only loses its now-pointless `Temporary` param.

### Phase 2 exit criteria

`grep -rn "Temporary" src/ tests/` returns only prose about "temporary Users" / "temporary documents" (the runtime concept), never a `Temporary` type parameter, `TemporaryIf`, or `TemporaryIfForName`. Full CI green.

---

## Phase 3 — detail: verify `common/abstract` + `common/data` (fields) + `common/documents` base schemas

**Status: Done — CI green** (modulo the documented cross-phase deferrals, which are tracked live in [migration-v14.md](migration-v14.md#cross-phase-deferrals-live)). Originally branch `v14/verify-common`; now linear history on `v14`. Diffed against Foundry **v14.363.0** at `/home/fronix/git/foundry/resources/app/`.

### Scope decisions (recorded at phase start)

- **In scope:** every `common/abstract/*.d.mts`, the `common/data/*.d.mts` field/schema infrastructure ("fields"), and every existing `common/documents/*.d.mts` base-schema file (34).
- **Deferred to Phase 7 (missing files, not drift):** `common/documents/level.mjs` (new v14 `Level` Document — also needs client class + CONFIG wiring), `common/data/active-effect.mjs`, `common/data/operators.mjs`. None exist in the repo yet; authoring new files is greenfield work.
- **Structural note — where schemas physically live:** the canonical per-document `Schema` interface (the field-by-field `DataSchema`) is authored in the **client** namespace (`client/documents/<doc>.d.mts`, `declare namespace <Doc> { interface Schema … }`) and the common `Base<Doc>` document re-imports it via `export import Schema = <Doc>.Schema`. The source of truth for the field list is `common/documents/<doc>.mjs::defineSchema()`. So verifying a "base schema" touches **both** the common base file (class shape, `Metadata`, `defineSchema` return, hierarchy) and the client file's `Schema` interface. Editing those `Schema` interfaces here is Phase 3 work; Phase 4 still owns the client leaf classes' **methods/members**.

> **Checkbox legend:** `[x]` = verified to the done bar & committed; `[~]` = partially done (see note); `[ ]` = not started.

### `common/abstract` checklist (10) — 10/10 done

- [x] `_module.d.mts`
- [x] `_types.d.mts`
- [x] `socket.d.mts`
- [x] `singleton-collection.d.mts`
- [x] `embedded-collection.d.mts`
- [x] `embedded-collection-delta.d.mts`
- [x] `type-data.d.mts`
- [x] `data.d.mts` — `DataModel`; internals deliberately unmodeled (noted above)
- [x] `backend.d.mts` — `DatabaseBackend`
- [x] `document.d.mts` — **boundary file, verified clean (no code change needed beyond the earlier `Metadata.baseTypeAllowed` add in `a3d8b71a2`).** Verified via method-name diff vs v14 `document.mjs` (only `_preCleanData`/`_updateDiff` are source-only — protected DataModel pipeline internals the repo omits by policy) + `Document.Metadata` field-by-field against v14 `DocumentClassMetadata` (all 12 fields present: name/label/coreTypes/collection/embedded/permissions/hasTypeData/baseTypeAllowed/indexed/compendiumIndexFields/preserveOnImport/schemaVersion). CRUD/createDialog signatures already covered by Phases 1–2.

### `common/data` checklist (6) — 5/6 done (6th is Phase-7-blocked only)

- [~] `_module.d.mts` — verified clean; only diff is the Phase-7-deferred `export * as operators from "./operators.mjs"` (operators.mjs not authored yet).
- [x] `_types.d.mts` — non-exporting discoverability stub (commit `80a7c9f59`). Added `TypedObjectFieldOptions`, `GridOffsetFieldOptions`, `GridOffsetsFieldOptions`. The 4 DataModel cleaning/update/sanitization pipeline typedefs (`DataModelCleaningOptions`, `DataModelUpdateState`, `DataModelSanitizationOptions`, `EmbeddedCollectionUpdateContext`) map to deliberately-unmodeled DataModel internals — documented in a comment rather than aliased.
- [x] `validation-failure.d.mts` — v14 rewrite (commit `b4924a4d1`). Constructor `(message, options)`; `fallback`→`fallbackValue` + `isEmpty()`→`empty` getter (old names `@deprecated` until v16); added `fieldPath`/`joint`/`options`/`copyTo`/`getFailure`/`getAllFailures`/`logAsTable`/`asHTML`; Error class gains the same query methods + `toString`.
- [x] `validators.d.mts` — verified clean (5 functions, same order; commit `b4924a4d1`).
- [x] `data.d.mts` — done (commits `946efd4ba` shapes, `b70522096` PrototypeTokenOverrides). `BaseShapeData.Types` now 10; authored the 6 new shapes (`Emanation`/`Cone`/`Ring`/`Line`/`Token`/`Grid`ShapeData) + reworked the 4 existing (gain `gridBased`, `anchorX/Y`, `origin`, `min:0`); `BaseShapeData` gains `LOCALIZATION_PREFIXES` + internal `_index`; added `PrototypeTokenOverrides` (per-Actor-type setting model, full static API); `PrototypeToken.LOCALIZATION_PREFIXES` → `["DOCUMENT","TOKEN"]`. Type-tested in `data.test-d.ts`; `region.test-d.ts` shape union grown to 10. NB: `ConeShapeData.curvature`/`TokenShapeData.shape` + the `PrototypeTokenOverrides` display fields use the explicit-type-param branded-choice pattern (FIXME, same as token.d.mts).
- [x] `fields.d.mts` — done. All 4 missing classes authored: `GridOffsetField`/`GridOffsetsField`/`ShapesField` (`50b766c02`) + `DataModelSchemaField` base inserted between `SchemaField` and `EmbeddedDataField` (`f22886e35`, namespace thin-aliased so `EmbeddedDataField.*` refs are unchanged; `validate` kept on `EmbeddedDataField` since v14 overrides it on neither — conservative). Member-by-member verification done via method-name diff vs v14 `fields.mjs` (`5326ad0d9`): only real public gap was `SchemaField.extendFields`/`removeFields`/`expandObject`/`reconstructOperator` (added); everything else source-only is protected-internal plumbing the repo omits by policy. (`SceneLevelsSetField` is Phase 7.)

### `common/documents` base-schema checklist (34) — 31/34 done (3 deferred/remaining)

- [~] `_module.d.mts` — **all remaining work deferred to Phase 7.** v14 moved `BaseMeasuredTemplate` out of `common/` into the client `measured-template.mjs` (now `@deprecated since v14`) and dropped its `_module` export; `_module.mjs` also adds `BaseLevel`. Both edits cascade into the un-migrated `Scene` (which still embeds `MeasuredTemplate`) → deferred to Phase 7 with the Scene rework (same no-deprecated-cascade rationale as wall's EDGE rename → Phase 5).
- [~] `_types.d.mts` — **deferred to Phase 7.** v14 removed the `MeasuredTemplateData` typedef (repo still has `MeasuredTemplateData = MeasuredTemplateDocument.InitializedData`); `PrototypeTokenData` is a `unknown` stub (also gone in v14). Removing them cascades into Scene → Phase 7. `LevelData`/`LevelTexture` are Phase 7.
- [x] `active-effect.d.mts`
- [x] `actor.d.mts`
- [x] `actor-delta.d.mts` (clean)
- [x] `adventure.d.mts`
- [x] `ambient-light.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `ambient-sound.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `card.d.mts`
- [x] `cards.d.mts`
- [x] `chat-message.d.mts`
- [x] `combat.d.mts`
- [x] `combatant.d.mts`
- [x] `combatant-group.d.mts` (clean)
- [x] `drawing.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `fog-exploration.d.mts`
- [x] `folder.d.mts` (clean)
- [x] `item.d.mts` (clean)
- [x] `journal-entry.d.mts`
- [x] `journal-entry-category.d.mts` (clean)
- [x] `journal-entry-page.d.mts` (clean)
- [x] `macro.d.mts` (clean)
- [~] `measured-template.d.mts` — **deferred to Phase 7.** v14 reality (discovered this session): there is **no** `common/documents/measured-template.mjs` — `BaseMeasuredTemplate` lives in the client `measured-template.mjs` as a `@deprecated since v14` shim (frozen `schemaVersion: "13.341"`, still `isEmbedded`/`collection: "templates"`). Annotating/moving it cascades `no-deprecated` errors into Scene (Phase 7) + the client MeasuredTemplate (Phase 4) + canvas (Phase 5), so it defers with the Scene embedded-collection rework (Phase 7).
- [x] `note.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `playlist.d.mts`
- [x] `playlist-sound.d.mts` (clean)
- [x] `region.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `region-behavior.d.mts`
- [x] `roll-table.d.mts`
- [~] `scene.d.mts` — **mostly deferred to Phase 7** (Levels rework + background/foreground shim + `levels` collection).
- [x] `setting.d.mts` (clean)
- [x] `table-result.d.mts` (clean)
- [x] `tile.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `token.d.mts` (non-Levels parts; `level` → Phase 7)
- [x] `user.d.mts` (clean)
- [~] `wall.d.mts` — **deferred**: `levels` → Phase 7; `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` rename → Phase 5 (canvas edges).

### Phase 3 drift survey (2026-05-25)

Done so far (typecheck + test-types green):

- **`common/abstract` (committed `b2fa434b1`):** `socket.d.mts` (+`timestamp`, +`sideEffect`), `embedded-collection.d.mts` (+`manages`), `type-data.d.mts` (+`onEmbed`), `data.d.mts` DataModel (+`getFieldForProperty`), `backend.d.mts` `CreateOperation` (+`controlObject`). `_module`/`_types` (abstract) clean.
- **Boundary file (committed `a3d8b71a2`):** `common/abstract/document.d.mts` — `Document.Metadata` gains `baseTypeAllowed?: boolean` (`:~2196`, after `hasTypeData`). Source `DocumentClassMetadata` (`_types.mjs`).
- **Metadata-only doc fixes:** `baseTypeAllowed` set per source — `true` on combatant-group/combatant/card/chat-message/combat/active-effect, **`false` on item/actor** (survey wrongly said item=true; source verified). `cards` permission `create: "CARDS_CREATE"`. `BaseCombatant`/`BaseJournalEntry` gain `LOCALIZATION_PREFIXES`. `region-behavior` `schemaVersion` → `14.352` (schema confirmed clean). NB: `schemaVersion` is **not** bumped independently for field-drifted docs — it moves with the field fix (else the type falsely claims v14).

**`DataModel` internals deliberately left unmodeled (human-review note):** `_preCleanData`, `_cleanData`, `_getInnerModel`, `_preUpdateSource`, `_updateDiff`, `_updateCommit` — protected `updateSource`/`cleanData` plumbing, consistent with the repo's existing omission policy.

**Phase 8 candidates found:** `embedded-collection.d.mts` `update`/`_createOrUpdate` and `embedded-collection-delta.d.mts` `_createOrUpdate` are deprecated stubs ("removed in v13, warning removed in v14") — gone from v14 source. (Tracked live in the deferrals table → Phase 8.)

#### `common/documents` schema drift (34 docs surveyed)

**Clean (12):** actor-delta, combatant-group, folder, item, journal-entry-category, journal-entry-page, macro, playlist-sound, region-behavior, setting, table-result, user.

**THE BIG DISCOVERY — v14 Scene Levels subsystem (unplanned, cross-cutting).** v14 added a `Level` embedded document and reworked elevation/levels across the canvas. This entangles Phase 3 with Phase 7 (which owns the new `Level` document):

- New field type **`SceneLevelsSetField`** (extends `SetField`) — not in repo `fields.d.mts`. Used as a `levels` field on: ambient-light, ambient-sound, drawing, note, region, tile, wall.
- **Scene** schema heavily reworked: REMOVED `background`/`foreground`/`foregroundElevation`/`backgroundColor`/`fog.exploration`/`fog.overlay` (now shims from `levels[0]`); ADDED `shiftX`/`shiftY`/`initialLevel`/`fog.mode`/`transition`/`levels: EmbeddedCollectionField(BaseLevel)`; metadata `embedded` drops `MeasuredTemplate`, adds `Level: "levels"`; `defaultLevelId`.
- **Token** gains `level: DocumentIdField` (references a Level id) and `depth` in `#defineMovementFields`.
- `_module.d.mts` must export `BaseLevel`, drop `BaseMeasuredTemplate`; `_types.d.mts` needs `LevelData`/`LevelTexture` typedefs.

**Non-Levels drift (the clearly-Phase-3 part):**

- _Metadata-only:_ widespread `schemaVersion` bumps (`"13.341"` → `"14.35x"`); `baseTypeAllowed: true` added on active-effect/card/chat-message/combat/combatant/combatant-group/item — **requires `Document.Metadata` to gain `baseTypeAllowed` (boundary file `document.d.mts:~2182`)**; adventure `compendiumIndexFields` (+caption/description/flags.core.sheetClass); active-effect `indexed`+`compendiumIndexFields`; `LOCALIZATION_PREFIXES` missing on `BaseCombatant` (`["DOCUMENT","COMBATANT"]`) and `BaseJournalEntry` (`["DOCUMENT","JOURNAL"]`).
- _Permissions:_ cards `create: "CARDS_CREATE"` (repo wrong `"OWNER"`); active-effect `create` is a `#canCreate` function (repo wrong `"OWNER"`).
- _Field add/restructure:_ active-effect — `changes` moved to `system`, `duration` restructured to `{value,units,expiry,expired}`, +`start`/`showIcon`/`folder`, `origin`→`DocumentUUIDField({relative:true})`. chat-message +`title`, `timestamp` opts (`nullable:true,initial:null`). combat +`name`. combatant +`roundJoined`. drawing +`name`/`interface`, `fontFamily` opts. ambient-light/ambient-sound +`name`/`locked` (and `levels`=Levels), ambient-sound `intensity` opts. note +`author`/`locked` (and `levels`=Levels), `fontFamily` opts. fog-exploration +`level` (DocumentIdField, **not** Level-doc-dependent) + field order (`user,scene`). region +`restriction`/`attachment`/`highlightMode`/`displayMeasurements`/`hidden`/`ownership`/`_shapeConstraints`/`elevation.topInclusive`, `visibility` initial→`LAYER_UNLOCKED`. tile `occlusion.mode`→`occlusion.modes: SetField`. token `detectionModes` Array→`TypedObjectField`, +`_movementHistory[].subpathId`, `width`/`height` lose `step:0.5` (PrototypeToken-only), `cost` `nullable:true`. roll-table `description`→`HTMLField`. playlist `channel` +`required:true`. wall `WALL_SENSE_TYPES`→`EDGE_SENSE_TYPES`, `WALL_DIRECTIONS`→`EDGE_DIRECTIONS`. measured-template is a v14 `@deprecated`-until-v16 shim proxying to Region.
- _Constants gaps (dependency, `common/constants.d.mts`):_ `REGION_VISIBILITY.OBSERVER`/`LAYER_UNLOCKED`, `EDGE_SENSE_TYPES`, `EDGE_DIRECTIONS`, (verify `FOG_EXPLORATION_MODES`).

> **Schema interfaces live in `client/documents/*.d.mts`** (per the structural note above), so fixing these edits Phase 4 files; coordinate the boundary.

#### Commits this session (all CI-green)

- `b2fa434b1` — common/abstract layer.
- `a3d8b71a2` — document metadata + `Document.Metadata.baseTypeAllowed` (boundary).
- `76a16aa7b` — non-Levels document schemas + constants + `DocumentUUIDField.relative` + test migrations.
- `b4924a4d1` — `common/data/validation-failure.d.mts` v14 rewrite + test; verified `validators.d.mts`/`_module.d.mts` clean.
- `50b766c02` — `common/data/fields.d.mts`: authored `GridOffsetField`/`GridOffsetsField`/`ShapesField` + `fields.test-d.ts` coverage.
- `946efd4ba` — `common/data/data.d.mts`: 10-shape `BaseShapeData` family (6 new + 4 reworked) + tests.
- `b70522096` — `common/data/data.d.mts`: `PrototypeTokenOverrides` + `PrototypeToken` localization fix.
- `80a7c9f59` — `common/data/_types.d.mts`: new field-option typedef maps.
- `f22886e35` — `common/data/fields.d.mts`: `DataModelSchemaField` base + `EmbeddedDataField` refactor.
- `5326ad0d9` — `common/data/fields.d.mts`: missing `SchemaField` public API (member verification).

**PHASE 3 IS COMPLETE** (modulo the documented cross-phase deferrals, tracked live in the deferrals table), full CI green.

- `common/abstract` 10/10 — `document.d.mts` verified clean (method + Metadata diff vs v14; no change needed).
- `common/data` complete — validation-failure, validators, \_module, \_types, data.d.mts (10-shape family + PrototypeTokenOverrides), fields.d.mts (4 new classes + member verification).
- `common/documents` schemas done; the remaining `[~]` files are **deferred** (see the live deferrals table), not incomplete Phase-3 work.

**Deferred out of Phase 3** (now also tracked in [migration-v14.md § Cross-phase deferrals (live)](migration-v14.md#cross-phase-deferrals-live)):

1. **MeasuredTemplate reconciliation → Phase 7.** v14 moved `BaseMeasuredTemplate` common→client as a `@deprecated since v14` shim, dropped the common `_module`/`_types` exports, removed the `MeasuredTemplateData` typedef, and un-embedded it from Scene. All of this cascades `no-deprecated`/missing-type errors into the un-migrated Scene (Phase 7), client MeasuredTemplate (Phase 4) and canvas (Phase 5), so it travels with the Phase-7 Scene embedded-collection rework. (Same rationale as wall's EDGE rename → Phase 5.)
2. **Scene Levels subsystem + `BaseLevel`/`LevelData`/`LevelTexture` → Phase 7.**
3. **wall `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` rename → Phase 5.**
4. **`common/data/_module.d.mts` `operators` re-export → Phase 7** (operators.mjs not authored yet).

#### Document schema rewrites (done this session, pre-gate)

Non-Levels field rewrites applied across: combat (+name), combatant (+roundJoined), drawing (+name/interface, fontFamily, textColor), fog-exploration (+level, order, scene.initial), roll-table (description→HTMLField), playlist (channel required), active-effect (changes→system removed, duration→{value,units,expiry,expired}, +start/showIcon/folder, origin→DocumentUUIDField, indexed+compendiumIndexFields, create perm fn), chat-message (+title, timestamp opts), region (restriction/attachment/highlightMode/displayMeasurements/hidden/ownership/\_shapeConstraints/elevation.topInclusive, visibility→LAYER_UNLOCKED), token (detectionModes Array→TypedObjectField, +subpathId, +depth, cost→nullable, width/height drop step:0.5, order), tile (occlusion.mode→occlusion.modes SetField), ambient-light/ambient-sound (+name/locked, intensity opts), note (+author/locked, fontFamily), adventure (compendiumIndexFields), actor (field order). Each paired its `schemaVersion` bump. `levels` fields stubbed `// TODO(v14-levels)` (Phase 7). Supporting: active-effect agent added consts `ACTIVE_EFFECT_DURATION_UNITS`/`ACTIVE_EFFECT_TIME_DURATION_UNITS`/`ACTIVE_EFFECT_EXPIRY_EVENTS`/`ACTIVE_EFFECT_SHOW_ICON` and a `relative` option on `DocumentUUIDField`.

**`TypedObjectField` create-optionality finding:** a bare required `TypedObjectField` (e.g. `token.detectionModes`) was wrongly _required_ in `CreateData` because its assignment-data isn't nullish — unlike `SchemaField` (which has `_EffectiveOptions` giving required schemas an implicit `{}` initial). Worked around by modeling the effective `initial: {}` (runtime `ObjectField#getInitialValue` returns `{}`). **Candidate fields.d.mts improvement:** give `TypedObjectField` the same implicit-`{}`-initial create-optionality `SchemaField` has, then drop the per-field workaround. (Tracked live in the deferrals table.)

#### `common/data` fields findings

Field-class roster diff (source `common/data/fields.mjs` vs repo `fields.d.mts`): **4 classes were present in v14 source, missing from repo** — `DataModelSchemaField` (base of `EmbeddedDataField`), `GridOffsetField`, `GridOffsetsField`, `ShapesField` (the proper type for `region.shapes`). Plus `SceneLevelsSetField` (deferred → Phase 7 Levels). **3 authored** (`GridOffsetField`/`GridOffsetsField`/`ShapesField`, commit `50b766c02`). `DataModelSchemaField` remains — it's a refactor of the existing `EmbeddedDataField` hierarchy rather than a standalone add (see the `fields.d.mts` checkbox note). Per-class member-by-member verification of the 34 existing field classes also remains.

**`GridOffsetField` dimensions gotcha (reusable):** the class is `GridOffsetField<Dimensions extends 2 | 3 = 2, Options extends GridOffsetField.Options<Dimensions>, …>`. `Dimensions` is **not** inferred from the runtime `{dimensions: 3}` arg (no parameter ties to it), and `DefaultOptions.dimensions` is the literal `2`, so a bare `new GridOffsetField({dimensions: 3})` rejects `3`. To get a 3D offset you must parameterize: `new GridOffsetField<3, {dimensions: 3}>({dimensions: 3})`, or just assert `SchemaField.InitializedData<GridOffsetField.Schema<3>>` at the type level (what the test does). The in-scope consumer (`GridShapeData.offsets` = `GridOffsetsField()`) is 2D, so this wart is harmless for Phase 3; 3D consumers are canvas/token (Phases 4–5).

#### Constants (done this phase)

`REGION_VISIBILITY` +`OBSERVER`(3)/`LAYER_UNLOCKED`(4); new `EDGE_RESTRICTION_TYPES` (`["light","darkness","sight","sound","move"]`, for `region.restriction.type`). The branded `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` (replacing `WALL_SENSE_TYPES`/`WALL_DIRECTIONS`) are **deferred to Phase 5** (canvas edges) — deprecating `WALL_*` now would cascade `no-deprecated` errors across canvas edge files. `wall`'s EDGE rename therefore defers with it.

### Phase 3 exit criteria

Every box above checked to the done bar (source-diffed, CI-green, type-tested). Full CI green: `npm run typecheck`, `npx tsc --exactOptionalPropertyTypes false`, raw `npx tsgo`, `npm run lint`, `npm run test-types`. Missing-file findings for Phase 7 recorded above and in the live deferrals table.

---

## Phase 4 — detail: verify `client/documents` leaf classes

**Scope.** Verify the `client/documents` **leaf classes member-by-member** to the done bar. Phases 1–2 already migrated their CRUD/`createDialog` surface, and Phase 3 authored their `Schema` interfaces (those interfaces physically live in `client/documents/<doc>.d.mts` — see the structural note in the archived Phase 3 scope decisions), so **Phase 4 owns the remaining methods/members** (getters/setters, instance + static methods, event handlers like `_preCreate`/`_onDelete`), not the schemas and not the CRUD/dialog surface. Diff each repo class body against its v14 `.mjs`; the namespace/`Schema` block above each class is out of Phase 4's scope unless a class member's signature references a type that is itself wrong.

**Inherited from deferrals:** none owned outright. `measured-template` is verified here for its class members, but the **MeasuredTemplate common→client reconciliation** (move `BaseMeasuredTemplate`, un-embed from Scene) stays Phase 7 — do not action it here; just flag if a class member depends on it. `level.mjs` has no repo file (Scene Levels → Phase 7), so it is **not** in this checklist.

**Ground truth:** `/home/fronix/git/foundry/resources/app/client/documents/<doc>.mjs` (v14.363.0).

### Per-file checklist (34 leaf docs)

Legend: `[x]` done (source-diffed + CI-green + type-tested), `[~]` partial (note), `[ ]` not started.

- [ ] `active-effect.d.mts` — **NOT a plain member-diff; near-total v14 rewrite with missing-file + config prerequisites** (see Batch-8 scope note). The whole change-application family moved from instance `apply`/`_applyAdd`/… to **static** `applyChange`/`applyChangeField`/`_applyChangeUnguided`/`_applyChange{Add,Subtract,Multiply,Override,Upgrade,Custom}` (+ `_replaceDataRefs`); the v13 instance methods survive only as `@deprecated since v14 until v16` shims. New static `CHANGE_PHASES`/`CHANGE_TYPES`/`EXPIRY_EVENTS` getters + `registry` (readonly). New getters `actor`/`item`/`thumbnail`/`isExpiryTrackable`; new `getEffectStart` (replaces deprecated `getInitialDuration`) and `isExpiryEvent`. Duration prep rewritten: `prepareBaseData`, `_prepareDuration(duration, context)`, **new** `_prepareTimeBasedDuration`/`_prepareCombatBasedDuration`, `updateDuration(context)`; v13's `_requiresDurationUpdate`/`_getCombatTime`/`_getDurationLabel` are **gone**. **Blockers:** (1) brand-new `client/helpers/active-effect-registry.d.mts` (the `ActiveEffectRegistry` class — absent from repo); (2) `CONFIG.ActiveEffect` additions `phases`/`changeTypes`/`expiryEvents` → the `ActiveEffectChangeTypeConfig` type (config surface, Phase-6-adjacent); (3) `ActiveEffectDuration` typedef rework (`units`/`seconds`/`remaining`/`secondsRemaining`/`label`, with deprecated `type`/`duration` getter shims). Do this in a dedicated session; clear the blockers first.
- [x] `actor-delta.d.mts` — added the `get id()` override note (no sig change); the rest of the synthetic-actor surface was already v14-accurate.
- [x] `actor.d.mts` — added v14's `phase` param to `applyActiveEffects` (omitting it is `@deprecated since v14 until v16`); added the new `tokenActiveEffectChanges: Record<string, ActiveEffect.ChangeData[]>` field, the new `prepareBaseData`/`_clearData` pair, and the new `onUpdateEffectDurations(effects, event, context?)`; fixed the `_registerDependantToken`→`_registerDependentToken` typo. Refreshed three stale docs: `_initializeSource` remark (was describing `BaseActor`'s prototypeToken `||=`, now the client override's compendium-art application), `allApplicableEffects` (dropped the removed `legacyTransferral` branch), event-handler comment (now names `_onCreate`/`_onUpdate`/`_onDelete`).
- [x] `adventure.d.mts` — added missing `static fromIndex(id, pack)` (v14's first member); import/prepareImport/importContent/fromSource already accurate.
- [x] `ambient-light.d.mts` — removed stale `_onUpdate`-override comment (v14 moved it to the `AmbientLight` placeable), added `prepareDerivedData`, fixed `animate` remark; `shape` deferred (→5/7).
- [x] `ambient-sound.d.mts` — added `prepareDerivedData`, fixed "Wall" copy-paste comment; `shape` deferred (→5/7).
- [x] `card.d.mts` — verified clean (all 14 getters/methods present in v14 order).
- [x] `cards.d.mts` — class member surface was already v14-accurate (thumbnail/availableCards/drawnCards/typeLabel/canClone, createDocuments, deal/pass/draw/shuffle/recall, sortStandard/sortShuffled/\_drawCards, the 6 dialogs + deleteDialog/createDialog; option interfaces match v14's option bags). Sole fix: `resetDialog` `@see` pointed at non-existent `Cards#reset` → `Cards#recall`. Also fixed the test's two `cards.reset(...)` `@ts-expect-error`s (were passing only because `reset` doesn't exist, not because the option was invalid) → `cards.recall(...)`; added typeLabel/canClone/createDocuments coverage.
- [x] `chat-message.d.mts` — added v14's `static applyMode`/`applyMode`/`_getHiddenContent` (the `applyRollMode` replacement); moved `applyRollMode` (static + instance) into the Deprecations section marked `@deprecated since v14 until v16`; added the `ChatMessage.MessageMode` type; on `Database.CreateOperation` deprecated `rollMode` + added `messageMode`. Also tightened `roll-table`'s `messageMode` TODO to `ChatMessage.MessageMode`.
- [x] `combat.d.mts` — fixed `activate` (v14 alias → `Promise<this>`; stale "deactivate all others" v13 doc), `resetAll` (added `{updateTurn}` options bag + `ResetAllOptions` interface, now `Promise<this>` not `| undefined`), `rollInitiative`/`InitiativeOptions` (added `messageMode: ChatMessage.MessageMode` — the rollMode→messageMode rename), and the two deprecated getters (`getCombatantByActor`/`getCombatantByToken` now log a warning, `since v14 until v15` not "no warning, since v12"; fixed `getCombatantByToken`'s param `Token`-placeable→`TokenDocument.Implementation` + `@see` that wrongly pointed at `getCombatantsByActor`). Dropped the now-unused `Token` import.
- [x] `combatant-group.d.mts` — verified clean (defeated/hidden/members, prepareBaseData, clearMovementHistories all present & v14-accurate).
- [x] `combatant.d.mts` — added missing `turnNumber: number | null`; the rest (combat/isNPC/permission/visible/actor/token/players/isDefeated/initiative/\_prepareGroup/clearMovementHistory) already accurate.
- [x] `drawing.d.mts` — fixed `defaultDrawingFields` `@defaultValue` (v14 added elevation/levels/interface), added `prepareDerivedData`; `_shape` deferred (→5/7).
- [x] `fog-exploration.d.mts` — verified load/getTexture/\_on\* present; widened `LoadQuery.scene`/`.user` to `string | Scene.Implementation`/`string | User.Implementation` per v14. Deprecated `static get()` correctly marked "until v14" (P8 sweep).
- [x] `folder.d.mts` — fixed `children` type (`Folder.ChildNode` → `Folder.ChildNode[]`, it's an array); rest (depth/displayed/contents/documentClass/documentCollection/expanded/ancestors/inCompendium/exportToCompendium/exportDialog/getSubfolders/getParentFolders) already accurate.
- [x] `item.d.mts` — fixed stale `_onCreateOperation`/`_onDeleteOperation` comment (v14 overrides `_preCreate`/`_onDelete`); class members otherwise v14-accurate.
- [x] `journal-entry-category.d.mts` — verified clean (`prepareDerivedData` only, matches v14).
- [x] `journal-entry-page.d.mts` — added the missing `options` param to the `_buildEmbedHTML` override (v14 passes `(config, options)`); rest (toc/permission/sceneNote/slugifyHeading/buildTOC/\_flattenTOC/\_makeHeadingNode/\_createDocumentLink/\_embedTextPage/\_embedImagePage) already accurate.
- [x] `journal-entry.d.mts` — verified clean (visible/getUserLevel/sceneNote/show/panToNote/sortCategories + \_onUpdate/\_onDelete comment); added test file.
- [x] `macro.d.mts` — verified clean (isAuthor/canExecute/thumbnail/canUserExecute/execute/\_onClickDocumentLink + \_onCreate comment).
- [ ] `measured-template.d.mts` — **fully deferred to Phase 7.** P4 confirmed the _entire_ v14 client file IS the reconciliation: `BaseMeasuredTemplate` now lives here (client), `@deprecated since v14`, and `MeasuredTemplateDocument` is a deprecated shim whose `createDocuments`/`updateDocuments`/`deleteDocuments` delegate to `RegionDocument` (+ `_fromRegion`). No Phase-4-separable members. See deferrals row.
- [x] `note.d.mts` — added missing `get isAuthor()` + `prepareDerivedData()`.
- [x] `playlist-sound.d.mts` — verified complete (VOLUME_DEBOUNCE_MS/sound/debounceVolume/\_createSound/fadeDuration/context/\_scheduleFadeOut/\_cancelFadeOut/sync/load/toAnchor/\_onStart/\_onEnd/\_onStop all present; effectiveVolume correctly `until v14` → P8).
- [x] `playlist.d.mts` — verified complete (playbackOrder/visible/\_getSoundContentLinks/playAll/playNext/playSound/stopSound/stopAll/cycleMode/\_get*Sound/\_sortSounds/\_onSound*/toCompendium + v14's `bulkImportDialog`/`bulkImportSounds` all present); added bulk-import tests.
- [x] `region-behavior.d.mts` — fixed `_handleRegionEvent` return (`void`→`Promise<void>`, it's `async`) + `active`/`viewed` doc drift; added test file.
- [ ] `region.d.mts` — **NOT a pure member-diff; blocked on Phase-7 subsystems** (see Batch-9 scope note). The repo class body is heavily under-populated (~14 members declared vs ~40+ in v14 source). Missing live members include `isSingleShape`/`clipperPolyTree`/`area` getters, `attachment` field, `clone`, `clampElevation`, `_createClipperPolyTree`, `updateShapeConstraints`, `_computeShapeConstraints`/`_computeShapeConstraint`, static `_preCreateOperation`/`_preUpdateOperation`/`_onCreateOperation`/`_onUpdateOperation`/`_onDeleteOperation`, `_updateCommit`, `_onCreate`/`_onUpdate`/`_onDelete`, `_onGridChange`, `_clearPolygonTree`, `_onPolygonTreeChange`, `_refreshViewedState`, `createTokenEmanation`, `teleportTokens`, `spawnTokens`, `removeShapeDialog`, `_regionShapes`. **Blockers:** (1) the **Scene Levels subsystem** (Phase 7) — `_computeShapeConstraints` is built on `this.parent.levels.get(...)`/`level.isView`/`level.parent.dimensions`, and `teleportTokens`/`spawnTokens`/`createTokenEmanation` take a `level` (`Level` document) param; the schema `levels`/`restriction`/`_shapeConstraints` fields are still stubbed `// TODO(v14-levels)`; (2) `DataFieldOperator` from the unauthored `common/data/operators.mjs` (Phase-7 deferral) — used in `_preUpdateOperation`. Author the Levels subsystem + `operators.mjs` first, then do region's member-diff. (Also still carries the **fully-deferred** stale `_updateTokens` declaration — v14's is `static async #updateTokens`, **private** — drop it when authoring.)
- [x] `roll-table.d.mts` — added `messageMode` to `DrawOptions` + marked `rollMode` `@deprecated since v14 until v16` (v14 added the messageMode option, deprecated rollMode); rest (thumbnail/toMessage/draw/drawMany/normalize/resetResults/roll/getResultsForRoll/\_buildEmbedHTML/onEmbed/fromFolder) already accurate. New test file. (`messageMode` typed loosely as `string` pending chat-message migration — inline TODO.)
- [ ] `scene.d.mts` — **blocked on Phase 7; it IS the Scene Levels subsystem container** (~110 `level`/`Level` refs in the v14 source). The Scene rework + embedded-collection changes are already explicitly assigned to Phase 7 (see deferrals: "Scene Levels subsystem" + "MeasuredTemplate reconciliation"). Also uses `DataFieldOperator` (operators.mjs, Phase-7). Do scene's member-diff as part of the Phase-7 Scene/Levels rework, not as a standalone Phase-4 leaf.
- [x] `setting.d.mts` — verified clean (config/\_initialize/\_castType + \_onCreate/\_onUpdate comment).
- [x] `table-result.d.mts` — verified clean (icon/prepareBaseData/getHTML/documentToAnchor/getChatText + \_preUpdate comment; getChatText correctly `until V15`).
- [x] `tile.d.mts` — added `prepareBaseData` (v14 defines the deprecated `occlusion.mode` getter there); `shape` deferred (→5/7).
- [ ] `token.d.mts` — **largest giant (4009) and prerequisite-heavy; do in a dedicated session after its blockers.** **Blockers:** (1) the v14 **token movement subsystem** — a large new surface importing ~15 `TokenMovement*`/movement typedefs from `client/documents/_types.mjs` (`TokenMovementData`/`TokenMovementOperation`/`TokenMeasuredMovementWaypoint`/`TokenResumeMovementCallback`/`TokenMovementCostFunction`/… ) plus `TokenConstrainMovementPathOptions` from `client/_types.mjs` — verify these typedefs exist/are accurate first; (2) `DataFieldOperator` from the unauthored `common/data/operators.mjs` (Phase-7 deferral); (3) **Scene Levels** entanglement (78 `level`/movement refs; the schema `level` field is stubbed `// TODO(v14-levels)`). Clear movement-typedefs + operators + Levels before the member-diff.
- [x] `user.d.mts` — added missing `idle: boolean | undefined` and `viewedLevel: string | null` (the Levels analog of `viewedScene`, a plain ID so unblocked); rest (targets/movingTokens/roleLabel/isDesignated/query/assignHotbarMacro/etc.) already accurate.
- [~] `wall.d.mts` — added `isDoor`/`isOpen`/`prepareBaseData`/`getWallCategory` + the `WallCategory` type (class body was previously bare). `edge`/`darkness`/`initializeEdge` deferred to Phase 5 (EDGE rename / Edge type) — see deferrals row.

### Running notes

- Verification recipe per file: read the v14 `.mjs` class body (getters/setters/methods/event-handlers, ignoring the `@import` and typedef blocks), read the repo `declare class … { … }` body, diff member presence + order + signatures. The repo deliberately omits re-declaring inherited methods whose signature is unchanged (sometimes noting them in a comment) — verify those comments name the right v14 methods.
- **"Done" interpretation for Phase 4:** a file is `[x]` when its **live** member surface matches v14 (presence + order + signatures) **and** its deprecations carry the right `until vXX` markers. The actual _removal_ of `until v14` deprecations is **Phase 8's** sweep — leaving a correctly-marked `until v14` deprecation in place does **not** block a Phase-4 `[x]`. (Example: `FogExploration.static get()` is `until v14` → left for P8.)
- **`shape` derived property deferral (→ 5/7):** `tile`/`ambient-light`/`ambient-sound` assign `this.shape` and `drawing` assigns `this._shape` of a `client/data/shapes.mjs` type (`Rectangle`/`Circle`/`Cone`/`Ellipse`/`Polygon` ShapeData). That file is unauthored, so the typed member is omitted with an inline `// TODO(v14)` in each of the 4 docs. Add the members once `client/data/shapes.d.mts` lands.
- **Batch 1 committed (9 docs):** ambient-light, ambient-sound, combatant-group, drawing, fog-exploration, item, journal-entry-category, note, tile. Pattern observed: most leaf docs only add a few getters + `prepareBaseData`/`prepareDerivedData` overrides over the Phase-1/3 surface; the common drift is (a) stale "X is overridden" comments naming v13 methods, and (b) `@defaultValue`/remark text not updated for v14. Tests: each got `expectTypeOf` assertions for the new surface.
- **Batch 2 committed (7 docs):** adventure, card, journal-entry, macro, region-behavior, setting, table-result. 5 were already v14-clean (card/macro/setting/table-result/journal-entry — the bulk of these docs' surface was authored accurately). Fixes: adventure missing `static fromIndex`; region-behavior `_handleRegionEvent` was typed `void` but is `async`. New test files added for journal-entry + region-behavior (were missing).
- **Batch 3 committed (4 docs):** actor-delta, combatant, playlist-sound, wall. playlist-sound already complete. Fixes: combatant missing `turnNumber`; actor-delta `get id()` note. **wall is `[~]`** — its class body was essentially empty; added the non-edge members but `edge`/`darkness`/`initializeEdge` ride the Phase-5 EDGE-rename deferral. Watch for other docs whose class body is under-populated (wall was a surprise).
- **Batch 4 committed (2 docs):** folder, user. Fixes: folder `children` was typed as a single node, should be an array (`Folder.ChildNode[]`); user missing `idle` + `viewedLevel`. (Note: there are 34 leaf docs, not 33 as first counted.)
- **Batch 5 committed (3 docs + 1 deferral):** journal-entry-page, playlist, roll-table. Fixes: journal-entry-page `_buildEmbedHTML` missing `options` param; roll-table added `messageMode` + deprecated `rollMode` (v14). playlist already complete. **`measured-template` fully deferred to P7** (the whole v14 client file is the reconciliation — see deferrals row). **24 fully done + wall partial = 25/34; measured-template→P7.** Remaining **8** (all Tier B giants): active-effect (1154), actor (788), cards (836), chat-message (659), combat (1212), region (2718), scene (1780), token (4009) — one-or-two per session. `chat-message` migration will let `roll-table`'s `messageMode: string` be tightened (inline TODO there). **Recurring drift patterns to check in each:** (1) stale "X overridden" comments naming v13 methods, (2) array properties typed as single (folder.children), (3) genuinely-missing runtime properties (combatant.turnNumber, user.idle/viewedLevel, drawing fields), (4) `async` methods typed as sync return (region-behavior.\_handleRegionEvent), (5) `@defaultValue`/remark text not refreshed for v14, (6) under-populated class bodies (wall).
- **Batch 6 committed (1 doc):** chat-message. The whole v13→v14 delta here is the rollMode→messageMode rename: v14 added `static applyMode`/instance `applyMode`/`_getHiddenContent` and demoted `applyRollMode` (both) to deprecated shims that map the legacy roll mode then delegate to `applyMode`. Modelled `applyMode` with a new open `ChatMessage.MessageMode` type (`"public"|"gm"|"blind"|"self"|"ic"|(string & {})` — `CONFIG.ChatMessage.modes` is a `Record<string, …>`; the repo's `CONFIG.ChatMessage` config block still lacks `modes`/`embedHandlers`/`popoutClass`/`typeHints` → Phase 6). `Database.CreateOperation` gained `messageMode` and deprecated `rollMode`. Unblocked + tightened `roll-table`'s `messageMode` (was loosely `string`). Pattern (7) to add: **a v13 method renamed in v14** — the old name survives only as a deprecated shim and must move to the Deprecations region (don't leave it inline where the new method now goes). **26/34 done + wall partial; measured-template→P7. Remaining 7:** active-effect (1154), actor (788), cards (836), combat (1212), region (2718), scene (1780), token (4009).
- **Batch 7 committed (1 doc):** cards. A "giant" by line count (836) but the class body was already fully v14-accurate — every method/getter present, in order, with correct signatures, and the deal/pass/draw/shuffle/recall option interfaces matched v14's option bags. Only drift was a stale `resetDialog` `@see Cards#reset` (the method is `recall`; `reset` was the pre-v13 name). Caught a companion test bug: two `@ts-expect-error cards.reset(...)` cases were green only because `reset` doesn't exist (so any call errors) — not because the option was invalid; fixed to `cards.recall(...)`. **Lesson:** an `@ts-expect-error` on a _renamed/removed_ method passes for the wrong reason — when verifying a doc, grep its test for calls to methods that no longer exist on the v14 class. **27/34 done + wall partial; measured-template→P7. Remaining 6:** active-effect (1154), actor (788), combat (1212), region (2718), scene (1780), token (4009). _(count corrected in Batch 8: it was actually 26 done after Batch 7 — `27/34` was an over-count.)_
- **Batch 8 committed (1 doc):** actor. First giant with real v14 delta (788-line source). v14 added: the `phase` parameter on `applyActiveEffects` (the no-arg form is now `@deprecated since v14 until v16`, logging a compat warning and defaulting initial→final across the prep cycle); a `tokenActiveEffectChanges` field (token-targeted AE changes keyed by phase); a `prepareBaseData`/`_clearData` pair (base-data reset moved out of `prepareData`); and `onUpdateEffectDurations`. Also fixed a long-standing **typo** `_registerDependantToken`→`_registerDependentToken` (the runtime method is "Dependent") — pattern (8) to watch: **misspelled method names** that typecheck fine but don't exist on the runtime class. Three stale docs refreshed (compendium-art `_initializeSource`, `legacyTransferral`-free `allApplicableEffects`, 3-handler `_on*` comment). **27/34 done + wall partial; measured-template→P7. Remaining 5:** active-effect (1154), combat (1212), region (2718), scene (1780), token (4009).
- **Batch 8 scope discovery — `active-effect.d.mts` is NOT a leaf member-diff.** While picking a second doc this session I diffed active-effect and found a near-total v14 rewrite (see its annotated checklist entry) blocked on three prerequisites that don't exist in the repo yet: a new `ActiveEffectRegistry` helper class (`client/helpers/active-effect-registry.mjs`, ~6.4 KB source, no `.d.mts`), `CONFIG.ActiveEffect` config additions (`phases`/`changeTypes`/`expiryEvents` + `ActiveEffectChangeTypeConfig`), and an `ActiveEffectDuration` type rework. Deliberately deferred to a dedicated session rather than rush it — clearing the three blockers is the first step there. (Confirms the Batch-5 prediction that the remaining giants are one-per-session; this one is more than one.) **Suggested next-session order for the remaining 4 true giants: combat → region → scene → token** (active-effect after its blockers are authored). **Recurring pattern (9):** a "leaf" doc can have **missing-file/config prerequisites** that take it out of pure Phase-4 scope — check for not-yet-authored imported types (registry/config) before assuming a member-diff.
- **Batch 9 committed (1 doc):** combat. A "giant" by line count (1212 src / 1727 repo) but the giant is the namespace block (Database operation interfaces); the live class body was small with bounded v14 delta. Four fixes: (1) `activate` was modeling v13 ("deactivate all other encounters", `Promise<Implementation[]>`) — v14 reduced it to a one-line alias `update({active:true})` returning `Promise<this>`; (2) `resetAll` gained the `{updateTurn=true}` options bag (new `Combat.ResetAllOptions`) and now always returns `Promise<this>` (was `| undefined`); (3) `rollInitiative` gained `messageMode` (pattern 7 — the rollMode→messageMode rename from Batch 6; typed `ChatMessage.MessageMode`, which `chat-message` already authored); (4) the two deprecated `getCombatantBy{Actor,Token}` getters NOW log a compat warning in v14 (`since 14, until 15`) — the repo claimed "no warning, since v12" — and `getCombatantByToken` carried two copy-paste bugs: its param was the `Token` **placeable** (should be `TokenDocument.Implementation`, matching the live `getCombatantsByToken`) and its `@see` pointed at `getCombatantsByActor`. Removing the placeable ref let the now-unused `Token` import be dropped. Tests had stale `activate`/`resetAll` return assertions (pattern from Batch 7 — they were green against the wrong v13 types). **Pattern (10) to watch:** a v13 method whose **whole behavior was simplified** in v14 (activate went from a multi-doc deactivation workflow to a trivial alias) — the return type and doc both drift, not just a signature tweak.
- **Batch 9 scope discovery — ALL 4 remaining Phase-4 giants are Phase-7-prerequisite-blocked; Phase 4's pure-member-diff work is effectively complete (28/34 + wall partial).** After finishing combat I diffed the next giant (region) and then sanity-checked scene + token; every one is blocked on a not-yet-authored subsystem, exactly like active-effect (pattern 9). Summary:
  - **active-effect** (1154) — `ActiveEffectRegistry` helper + `CONFIG.ActiveEffect` config additions + `ActiveEffectDuration` rework (Batch-8 finding).
  - **region** (2718) — **Scene Levels** (`this.parent.levels`, `level` params on teleport/spawn/emanation, stubbed `levels`/`restriction`/`_shapeConstraints` schema fields) **+ `DataFieldOperator`** (`common/data/operators.mjs`, unauthored). ~25 missing live members.
  - **scene** (1780) — it **is** the Scene Levels container (~110 `level`/`Level` refs); the Scene rework is already Phase-7 by assignment, plus `DataFieldOperator`.
  - **token** (4009) — the new **token movement subsystem** (~15 `TokenMovement*` `_types.mjs` typedefs + `TokenConstrainMovementPathOptions`) **+ `DataFieldOperator` + Scene Levels** (78 refs, stubbed `level` field).

  **Common denominators:** the **Scene Levels subsystem** (Phase 7) and **`common/data/operators.mjs`** (`DataFieldOperator`, Phase-7 deferral) gate 3 of the 4; active-effect has its own registry/config/duration prerequisites. **Strategic implication:** the Phase-4 member-diff cannot finish these giants until their prerequisites exist. **Decision (2026-05-26): proceed to Phase 5 (canvas)** — treat Phase 4 as "done modulo the 4 blocked giants" — and author each giant **with/after Phase 7**, doing its subsystem prerequisite first (Levels / `operators.mjs` / token-movement typedefs / AE registry) then its member-diff in the same session. (Rejected alternative: pulling all of Phase-7's Levels+operators groundwork forward now, which inverts the foundation-up order and front-loads the highest-risk greenfield authoring before Phases 5–6.) The four giants are deliberately left `[ ]` (not `[~]`) with full blocker annotations in their checklist entries — partially authoring them now would mean typing against stubbed `levels` fields, a missing `Level` document, and a missing `operators.mjs`, the exact trap avoided for active-effect.

---

## Baseline landscape (moved from the tracker 2026-05-27 — historical)

_Measured against v14.363.0 at migration start (2026-05-25). Kept for the "size of the problem" context; superseded by per-phase progress._

Measured against v14.363.0. Directory structure already mirrors v14 1:1 — **no restructuring needed**; this is a content-accuracy migration.

| Category                                          | Size                                                                   | Concentration                                                                                                                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Missing files** (in v14 source, absent here) | 97                                                                     | new `canvas/vfx/` (~21), placeable UI: `applications/sheets/palette/` (8), `applications/sidebar/tabs/` (10), `.../filters/` (4); `data/region-behaviors/` (4); misc canvas/elements/ux |
| **B. Stub files** (`@remarks TODO: Stub`)         | 65                                                                     | ~98% in `applications/` (HUD, sidebar, sheets, settings menus); 2 in `data/`                                                                                                            |
| **C. In-file drift**                              | ~34 docs (createDialog `.Stored`) + ~200 `Temporary` sites + scattered | `client/documents/`, `common/abstract/document.d.mts`, canvas                                                                                                                           |

Files in the repo but not in v14 source (19) are almost all barrel/index files and renames (`quad-tree`→`quadtree`, `region-legend` removed, `measured-template` moved) — handled opportunistically within the relevant phase, not a category of their own.

---
