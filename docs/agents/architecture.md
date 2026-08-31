# Architecture

## When to consult this file

Consult this file when navigating the codebase, deciding where a new type belongs, or proposing structural changes. Not needed for narrow within-file edits.

## High-level layout

```
src/
  index.d.mts            # Entry point - imports global side effects
  index-lenient.d.mts    # Alternative entry with AssumeHookRan pre-set (excluded from internal typecheck)
  foundry/                # Mirrors the Foundry runtime tree 1:1
    common/               # Shared between server and client (DataModel, Document, fields, packages, CONST...)
    client/               # Browser-only runtime (Applications, Canvas, Hooks, Game, CONFIG...)
    public/scripts/       # Public static scripts (workers, ktx2, clipper, earcut)
  configuration/          # User-extensible declaration-merging surfaces (DocumentClassConfig, AssumeHookRan, etc.)
  types/                  # Internal helper types (documentConfiguration, lib augments) - not user-facing
  utils/                  # Exported as `fvtt-types/utils` - generic TS helpers (AnyObject, DeepPartial, Brand, ...)
tests/
  foundry/                # Mirrors `src/foundry/` - one `.test-d.ts` per declaration file where useful
  custom/                 # Tests for the lenient/configured surface
  types/                  # Tests for the utils
docs/agents/              # This documentation set + skill config; archive/ holds the closed v14 migration
```

The hierarchical rule: **the directory tree under `src/foundry/` mirrors the directory tree under `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app`.** A file in the Foundry source at `client/applications/api/dialog.mjs` corresponds to the typings at `src/foundry/client/applications/api/dialog.d.mts`. Diverging from this layout requires a strong reason.

## Path aliases (TypeScript `imports` map)

Defined in [package.json](../../package.json). Use these instead of long relative paths inside `src/`:

| Alias            | Resolves to                       |
| ---------------- | --------------------------------- |
| `#client/*`      | `./src/foundry/client/*`          |
| `#common/*`      | `./src/foundry/common/*`          |
| `#utils`         | `./src/utils/index.d.mts`         |
| `#configuration` | `./src/configuration/index.d.mts` |
| `#tests/*`       | `./tests/foundry/*` (test-only)   |
| `#testUtils`     | `./tests/utils.ts` (test-only)    |

ESLint enforces that `#tests` and `#testUtils` are not imported from `src/`.

## The `_module.d.mts` pattern

Every directory has a `_module.d.mts` that re-exports the public surface of that directory, matching the structure of Foundry's own `_module.mjs` re-export barrels. **These files use `.mjs` extensions in their internal imports even though they are `.d.mts`** because Foundry's runtime version is `.mjs` and `import-x/no-unresolved` would otherwise fail. This is deliberate and called out by an `/* eslint-disable import-x/extensions */` at the top.

## The four user-extensible declaration-merging surfaces

Found in [src/configuration/](../../src/configuration/). Downstream system/module authors extend these via `declare module "fvtt-types/configuration" { ... }`:

- **`DocumentClassConfig`** — overrides the constructor type of a document (`CONFIG.Actor.documentClass = typeof MyActor`).
- **`SourceConfig` / `DataConfig`** — overrides the persisted/initialized shape of a document's `system` data per subtype.
- **`AssumeHookRan`** — tells the types to skip the "uninitialized" branch of globals like `game`.
- **`ModuleConfig` / `RequiredModules`** — surfaces API exposed by other modules.
- **`SettingConfig`, `FlagConfig`, etc.** — typing for `game.settings` keys and document flags.

When changing types in `src/foundry/`, always ask: "does this need to flow through one of these configuration surfaces?" If it does, the configuration surface is the single source of truth.

## Class / namespace convention

For each Foundry class `Foo` the typing pattern is:

```ts
declare class Foo<...> extends ... { ... }

declare namespace Foo {
  type Options = ...;        // any type that conceptually belongs to Foo
  type Implementation = ...; // the user-configured class
  interface Metadata { ... }
  // etc.
}

export default Foo;
```

This avoids polluting the global namespace and keeps related types discoverable via `Foo.X`.

## Document `Implementation` indirection

A frequent point of confusion. Direct references like `Actor` (the value) or `typeof Actor` (the type) are **not** what consumers should use, because `CONFIG.Actor.documentClass` may have been swapped to a system-specific subclass. Use:

- `Actor.Implementation` — the user-configured instance type.
- `Actor.ImplementationClass` — the user-configured constructor type.
- `Actor.OfType<"character">` — for documents with subtypes.

The ESLint rules in `eslint.config.js` actively flag bare `typeof Actor` and bare-expression uses of `Actor` to push contributors toward the indirection.

## How to contribute to this file

Update this file when:

- A new top-level directory is added under `src/` or `tests/`.
- A new path alias is added to `package.json`'s `imports`.
- A new user-extensible declaration-merging surface is introduced in `src/configuration/`.
- The mirroring relationship between `src/foundry/` and the Foundry source changes.

Keep diagrams ASCII and brief — this file is not a complete API reference.
