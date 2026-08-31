# Known Bugs, Gotchas, and Workarounds

## When to consult this file

Consult this file when debugging an unexpected typecheck error, when a previously-working type starts failing, or when an `@ts-expect-error` / FIXME / TODO marker is unclear. Not needed for routine new-type authoring.

## Confirmed bugs and workarounds

Each entry below has been observed in this repository (an `@ts-expect-error`, FIXME marker, or open TODO captures it).

### Branded-type choices not enforced through field overrides

**Status: confirmed**

Across `ChatMessage`, `Drawing`, `MeasuredTemplate`, `JournalEntryPage`, `Playlist`, and `Scene` documents, several fields use a branded numeric/string choice (e.g. brand-tagged enums) that the field's inferred type loses without an explicit override.

- `src/foundry/client/documents/chat-message.d.mts:280`
- `src/foundry/client/documents/drawing.d.mts:267`
- `src/foundry/client/documents/journal-entry-page.d.mts:342`
- `src/foundry/client/documents/measured-template.d.mts:218`
- `src/foundry/client/documents/playlist.d.mts:324` and `:359`
- `src/foundry/client/documents/scene.d.mts:886`

**Workaround.** Manually override the affected field in the document's schema declaration. The existing `// FIXME: overrides required to enforce branded type` comments mark every spot. Related: see [decisions.md ADR-004](decisions.md) for the indirection that exposed these.

### `ClientDocumentMixin` does not type-fit the generic-mixin pattern

**Status: confirmed**

`src/foundry/client/documents/abstract/client-document.d.mts:632` — `ClientDocumentMixin` requires a specific constructor shape (the same as `Document`) rather than the more permissive shape a normal mixin accepts. The current typing models this with a FIXME and a workaround.

**Workaround.** Do not "fix" this to use the generic mixin pattern — it will fail elsewhere. The FIXME is intentional pending a deeper refactor.

### Die modifier methods declare an unused `modifier` parameter

**Status: confirmed (minor)**

`src/foundry/client/dice/terms/die.d.mts:154` and `:165` — `countEven` and `countOdd` both type a `modifier: string` parameter that Foundry's runtime accepts but does not actually use. Marked with `// FIXME: Modifiers is also unused.`

**Workaround.** Leave as-is until the runtime signature changes — removing the parameter would be a breaking change for downstream callers.

### `image-popout` default-options `caption` / `uuid` still typed as `| undefined`

**Status: confirmed**

`src/foundry/client/applications/apps/image-popout.d.mts:101` — `caption` and `uuid` have runtime defaults in `DEFAULT_OPTIONS`, but the config-types machinery still surfaces them as `string | undefined`. TODO present.

**Workaround.** Read the TODO before refactoring `DEFAULT_OPTIONS` handling — it lists the blocker.

### `tsgo` recursion limit on `_GetProperty`

**Status: confirmed (upstream tsgo)**

`src/utils/index.d.mts:1385` — `_GetProperty` triggers a tsgo issue: https://github.com/microsoft/typescript-go/issues/1278. Comment in the file links the upstream bug.

**Workaround.** Do not deepen the recursion in `_GetProperty` further. If you must, test under both `tsc` and `tsgo` (the CI step in [workflows.md](workflows.md) catches regressions).

### Stub files (`@remarks TODO: Stub`)

**Status: confirmed (intentional incomplete state)**

A meaningful chunk of v13/v14 client applications are typed as "stubs" — class declared, methods unsigned. Search for `@remarks TODO: Stub` to enumerate. Examples include:

- `src/foundry/client/applications/apps/av/camera-popout.d.mts`
- `src/foundry/client/applications/apps/combat-tracker-config.d.mts`
- `src/foundry/client/applications/apps/document-ownership.d.mts`
- `src/foundry/client/applications/apps/grid-config.d.mts`
- `src/foundry/client/applications/hud/*.d.mts` (most)
- `src/foundry/client/applications/quickstart.d.mts`
- `src/foundry/client/applications/settings/config.d.mts`
- `src/foundry/client/applications/elements/secret-block.d.mts`

These are **on the v14 to-do list** — converting stubs to full type definitions is one of the main outstanding work items.

### `Document._id` declared as a "fake" property

**Status: confirmed (intentional, suspected obsolete)**

`src/foundry/common/abstract/document.d.mts:247` — `// TODO: is this fake property necessary?` followed by `_id: string | null;`. The property exists at runtime but the schema already exposes `_id`; the redundant declaration is a workaround for a typing issue whose root cause is no longer documented.

**Workaround.** Do not remove without first verifying the test suite still passes — the redundant declaration may be load-bearing for assignment compatibility somewhere.

### `import-x/extensions` requires `.mjs` in `_module.d.mts` barrels

**Status: confirmed (intentional, easy to mistakenly "fix")**

In every `_module.d.mts` you'll find:

```ts
/* eslint-disable import-x/extensions */
export { default as DataModel } from "./data.mjs";
```

The `.mjs` is correct even though the typed file is `data.d.mts`. Foundry's runtime barrels use `.mjs`, so mirroring requires `.mjs` here; `import-x/no-unresolved` would otherwise fail. Cross-references: [decisions.md ADR-005](decisions.md).

**Workaround.** Leave the disable comment and the `.mjs` extension in place when adding to a `_module.d.mts`.

### Lenient mode masks errors when typechecking includes it

**Status: confirmed (configuration trap)**

`src/index-lenient.d.mts` sets `AssumeHookRan` for all hooks. If included in a `tsconfig`, it collapses unions and hides real errors in the strict surface. The default `tsconfig.json` has it in `exclude` for this reason. Cross-references: [decisions.md ADR-008](decisions.md).

**Workaround.** If you see "errors disappear when I add this file" while exploring, you almost certainly enabled lenient mode somewhere. Run with the default `tsconfig.json`.

## Suspected issues / under investigation

Each entry below is a noticed-but-not-confirmed concern. Do not rely on these descriptions.

### `DialogV2` test display is "unsightly"

**Status: suspected**

`tests/foundry/client/applications/api/dialog.test-d.ts:3` notes the file is "full of tests with unsightly type display" and that `Config extends ...` patterns weaken excess-property checks. There may be hidden over-permissive cases in `DialogV2.confirm` / `.prompt` / `.wait` that the tests don't catch. Investigation should compare the test against the v14 `client/applications/api/dialog.mjs` source.

### `Application._onSearchFilter` callback type

**Status: suspected (open TODO)**

`src/foundry/client/applications/api/category-browser.d.mts:75` — typed as `unknown` with `// TODO: SearchFilter.Callback`. Whether the actual `SearchFilter.Callback` type exists yet is unclear; investigation should grep for it.

### Residual v13 drift in files the migration deprioritised

**Status: suspected (narrow)**

The v13 → v14 migration is complete to its agreed scope, so this is no longer a blanket warning — most of the tree was source-diffed. It survives for the areas the migration **deliberately** deprioritised as low-consumer-value: `sidebar/` tabs, `settings/` menus, and parts of `canvas/vfx/`. Those files are CI-green and v13-compatible but may lack v14's newer members.

If a member looks wrong in one of those areas, verify against `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app/<corresponding>.mjs` before assuming the type is right. Known-and-deliberate omissions are in [todo.md](todo.md); the per-file verification record is in [archive/v14-migration/](archive/v14-migration/README.md).

## When to update this file

Add an entry when:

- You discover a recurring miscompile or surprising behavior and add a FIXME / `@ts-expect-error` in the source.
- An upstream TypeScript / tsgo bug forces a non-obvious workaround.
- A file is identified as a stub or otherwise incomplete in a way that contributors should know about before touching it.

Promote a suspected issue to confirmed once you have a reproduction. Cross-reference [decisions.md](decisions.md) whenever a bug is the documented consequence of an architectural decision.

Move resolved entries out — link to the fixing commit/PR in the commit message instead of leaving a "closed" entry here.
