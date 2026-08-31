# Domain Context

## When to consult this file

Consult this file when interpreting Foundry-specific terms or when a type decision hinges on Foundry's runtime semantics. A term meaning something different in this project than in general TypeScript or general "game UI" usage will be flagged here.

## Foundry VTT vocabulary used in this repo

### Document

A persistent entity backed by NeDB / a database collection. Examples: `Actor`, `Item`, `Scene`, `User`. All extend `foundry.abstract.Document` which itself extends `DataModel`. A Document has a fixed schema (`DataField`s), can have subtypes (some), supports embedded documents, and participates in CRUD via the `DatabaseBackend`.

The repo's typing of `Document` (`src/foundry/common/abstract/document.d.mts`) is one of the most complex files and threads three type parameters: `DocumentName`, `Schema`, and `Parent`.

### Subtype / `hasTypeData`

Some Documents (e.g. `Actor`, `Item`, `ActiveEffect`) allow systems to register additional **subtypes** with extra schema in their `system` field. Whether a Document has subtypes is fixed in this repo — see the `documents` table in [eslint.config.js](../../eslint.config.js) (`hasSubtype: true | false`). This determines whether `.OfType<...>` is a valid pattern for that document.

### `Implementation` vs base class

`Actor` (the class declared in `src/foundry/client/documents/actor.d.mts`) is the **base** class. The class that downstream code actually instantiates is whatever was assigned to `CONFIG.Actor.documentClass` — typically a system-specific subclass. The types reflect this via `Actor.Implementation` (instance) and `Actor.ImplementationClass` (constructor). Mixing these up produces types that look right but lose system-specific properties.

### Placeable vs `*Document`

For canvas objects there is a pair: the **Document** (data, e.g. `TokenDocument`) and the **Placeable** (visual canvas object, e.g. `Token`). The mapping is in `eslint.config.js`:

```
AmbientLight → AmbientLightDocument
AmbientSound → AmbientSoundDocument
Drawing      → DrawingDocument
…etc
```

When the `placeables` list in the ESLint config says `AmbientLight`, it means the **placeable** class, not the document.

### `DataModel`, `DataField`, `DataSchema`

`DataModel` is the base class for any structured, schema-validated object. `DataField` is the building block (a `StringField`, `NumberField`, `EmbeddedDocumentField`, etc.). `DataSchema` is a record of named `DataField`s. A `Document` is a `DataModel` plus persistence.

A `DataField` has multiple type-level representations of "the same" value:

- **AssignmentType** — what you can write into the field (often more permissive).
- **InitializedType** — the runtime shape after construction (what you read).
- **SourceType / PersistedType** — what the field looks like in the database / `toObject()`.

Mixing these is the source of a large number of historical type bugs. When in doubt, read the field implementation in the Foundry source.

### Temporary vs Stored document (v13 → v14 change)

A **stored** document is one that has been persisted to the database and therefore carries a non-null `_id`; the repo models this as `X.Stored`. In **v13**, several create paths could produce a **temporary** (in-memory, unsaved, `_id: null`) document — the `temporary: true` create option — and the types expressed this with a `Temporary` type parameter and a `X.TemporaryIf<Temporary>` helper (~234 sites).

**v14 removed the `temporary` create concept entirely**: `DatabaseCreateOperation` (`common/abstract/_types.mjs`) no longer has a `temporary` field, and `createDialog` returns `Promise<Document | null>` — always stored, or null. The `Temporary`/`TemporaryIf` machinery was therefore v13 modeling, and the migration **removed** it; see [decisions.md ADR-010](decisions.md).

### `system` field

The subtype-specific extra data on a Document. Its shape is configured by downstream systems via the `SystemConfig` interface (declaration merging into `fvtt-types/configuration`). When the types display `system: {}`, that is the "unconfigured" default — it is not actually empty.

### `flags`

Per-Document free-form key-value storage scoped by module/system. Typing surfaces through `FlagConfig` declaration merging.

### `CONFIG`

The global runtime configuration object. Documents reference `CONFIG.<DocumentName>.documentClass`, `collection`, `sheetClasses`, etc. Almost every "swap the implementation" extension point in Foundry routes through `CONFIG`.

### `game` / initialization hooks

The `game` global is **`undefined` until the `init` hook fires**, then progressively gains properties as later hooks fire (`i18nInit`, `setup`, `ready`). The repo models this via `InitializedOn<T, Hook>` (in `src/utils/index.d.mts`) and the user-facing `AssumeHookRan` interface (in `src/configuration/configuration.d.mts`). A user merging `interface AssumeHookRan { setup: never }` collapses the union and exposes the fully-initialized type.

This is _not_ a bug — it is intentional. The "lenient" entry point (`fvtt-types/lenient`) pre-merges this for users who want convenience over rigor.

### `ApplicationV1` vs `ApplicationV2`

Foundry is mid-migration from the legacy `Application` (now `ApplicationV1`, in `src/foundry/client/appv1/`) to `ApplicationV2` (in `src/foundry/client/applications/`). v14 continues the deprecation: v1 sheets still work but new code should be v2. When choosing which API to model, default to v2.

### `DialogV2.confirm` / `.prompt` / `.wait` return-type magic

`DialogV2.confirm` returns `boolean | null` by default, but its return type narrows based on the options object — the type tests in `tests/foundry/client/applications/api/dialog.test-d.ts` are the authoritative spec for this and worth reading before changing.

### "lenient" entry point

`fvtt-types/lenient` re-exports everything from `fvtt-types` but pre-merges `AssumeHookRan` with all hooks set. It exists because requiring users to type-guard `game` everywhere was the most common reported friction. **It is excluded from the in-repo typecheck** (`src/index-lenient.d.mts` is in the `exclude` array of `tsconfig.json`) because enabling it would mask real type problems elsewhere.

### `parent` (Document) vs `parent` (DataField)

In `Document`, `parent` is the parent **Document** (e.g. an embedded `Item`'s parent is the owning `Actor`). In `DataField`, `parent` refers to the parent **field/schema**. Same name, different semantics — read context carefully.

## Foundry version targeting

The package targets **v14** and its version tracks the Foundry build it was verified against (`14.363.x`). Ground truth is the Foundry install at `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app`. **When the Foundry source disagrees with a type in this repo, the Foundry source wins.**

The migration that brought the repo from v13 to v14 is complete — its record is in [archive/v14-migration/](archive/v14-migration/README.md), and the work deliberately left undone is in [todo.md](todo.md).

Two residues to be aware of:

- **The migration was verified against build 14.363.0.** Later Foundry builds have not been diffed against the type surface.
- **Some v13-flavoured comments survive** in files that were otherwise updated — including ~210 `@deprecated … until v14` markers whose window has now elapsed (see [todo.md](todo.md) item 1). Treat such comments as suspect and verify against the actual `.mjs` file.

## How to contribute to this file

Update this file when:

- A Foundry term gains a meaning specific to this repo that a typescript-only contributor would not infer.
- An invariant about the runtime (e.g. "X is undefined until hook Y") affects type modelling.
- A subtle distinction between two same-named concepts (like the two `parent`s above) causes a real bug.

Do not add general Foundry tutorials — link to the official wiki / API docs instead.
