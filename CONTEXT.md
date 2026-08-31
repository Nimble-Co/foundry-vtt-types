# CONTEXT.md — foundry-vtt-types

This file is the single context document for the repository. It gives the goal, the vocabulary, the boundaries, and the rules of work.

This document uses ASD-STE100 Simplified Technical English. Keep this style when you edit the file.

`@league-of-foundry-developers/foundry-vtt-types` (npm), also known as `fvtt-types`. It is a declaration-only TypeScript package. It supplies types for [Foundry Virtual Tabletop](https://foundryvtt.com/). Each authored file is a `.d.mts` declaration file. The package ships no JavaScript.

---

## 1. Ubiquitous language

Use these terms. Do not use other words for the same thing.

| Term                                  | Meaning                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Document**                          | A persistent entity, for example `Actor`, `Item`, `Scene`, or `User`. It extends `foundry.abstract.Document`, which extends `DataModel`.                     |
| **DataModel**                         | The base class for a structured object that a schema validates.                                                                                              |
| **DataField**                         | One typed member of a schema, for example `StringField` or `NumberField`.                                                                                    |
| **DataSchema**                        | A record of named `DataField` members.                                                                                                                       |
| **Implementation**                    | The instance type of the class that the user configures through `CONFIG.X.documentClass`. Write `Actor.Implementation`.                                      |
| **ImplementationClass**               | The constructor type of that same configured class. Write `Actor.ImplementationClass`.                                                                       |
| **Subtype**                           | An extra document type that a game system registers. It adds schema to the `system` field. The `documents` table in `eslint.config.js` shows which allow it. |
| **Placeable**                         | The canvas object, for example `Token`. Its data is in the related document, for example `TokenDocument`.                                                    |
| **AssignmentType**                    | The type that you can write into a `DataField`.                                                                                                              |
| **InitializedType**                   | The type that you read from a `DataField` after construction.                                                                                                |
| **SourceType** / **PersistedType**    | The type of the `DataField` in the database and in `toObject()`.                                                                                             |
| **`system` field**                    | The subtype-specific data on a document. Game systems set its shape through `SystemConfig`.                                                                  |
| **`flags`**                           | Free-form key-value storage on a document. Modules and systems scope their own keys.                                                                         |
| **`CONFIG`**                          | The global runtime configuration object. Most extension points go through it.                                                                                |
| **`AssumeHookRan`**                   | The declaration-merging surface that removes the uninitialized branch of a global, for example `game`.                                                       |
| **Stored document**                   | A document that is in the database. It has a non-null `_id`. The type is `X.Stored`.                                                                         |
| **ApplicationV1** / **ApplicationV2** | The old and the new application frameworks. Foundry is in transition to V2. Use V2 for new work.                                                             |

**Warning:** the word `parent` has two meanings. On a document, `parent` is the parent document. On a `DataField`, `parent` is the parent field or schema. Read the context before you make a decision.

Do not mix `AssignmentType`, `InitializedType`, and `SourceType`. This mistake caused many defects.

---

## 2. Goal

**Model Foundry VTT v14 correctly.** Accuracy against the v14 runtime is the objective.

The `main` branch holds the v14 work. Older versions are on the `foundry-<version>.x` branches.

The v13-to-v14 migration is complete. The repository is in maintenance. There is no tracker to keep current.

- [`docs/agents/todo.md`](docs/agents/todo.md) lists the work that we left undone on purpose. It gives a reason for each item. Read it before you start work that looks like migration work.
- [`docs/agents/archive/v14-migration/`](docs/agents/archive/v14-migration/README.md) holds the closed migration record. It is historical. Use it to learn why a type has its current shape. Do not use it to plan work. Its checkboxes are frozen and do not show open items.

Obey TypeScript good practice. Do not use a hack unless it is a true type hack. A true type hack is one of these:

- a work-around for a defect in `tsc` or `tsgo`;
- a variance problem that has no clean expression;
- a recorded FIXME with no current solution.

If you use a hack, write a comment. The comment must tell what fails without the hack. Add a link to the upstream issue if one exists.

---

## 3. Quick start

```sh
# install
npm install

# the three gates that CI runs — all must pass before a merge
npm run typecheck     # tsgo against the default tsconfig.json
npm run lint          # typecheck + eslint + prettier --check
npm run test-types    # vitest --typecheck for the .test-d.ts files

# correct what the tools can correct
npm run lint:fix
```

---

## 4. Ground truth

The Foundry source is the ground truth. Before you change a type, read the related Foundry source file.

The source is at `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app`.

| This repository                 | Foundry source      |
| ------------------------------- | ------------------- |
| `src/foundry/client/**`         | `client/**`         |
| `src/foundry/common/**`         | `common/**`         |
| `src/foundry/public/scripts/**` | `public/scripts/**` |

If the Foundry source does not agree with a type in this repository, the Foundry source wins.

The migration used build 14.363.0 as the reference. Later builds are not compared with the type surface.

For Foundry API documentation in prose, use the `context7` MCP server. First call `mcp__context7__resolve-library-id`. Then call `mcp__context7__query-docs`. Use this server before you use a web search.

---

## 5. Boundaries

**Warning: change these files only after a human review.**

- **`src/configuration/`** — the extension surface that users extend by declaration merging. It holds `DocumentClassConfig`, `SourceConfig`, `DataConfig`, `SystemConfig`, `FlagConfig`, `SettingConfig`, `ModuleConfig`, `RequiredModules`, and `AssumeHookRan`. A change here has an effect on the typed code of each consumer. A new extension point needs a design discussion first.
- **`src/utils/index.d.mts`** — the public utility-type surface. The package exports it as `fvtt-types/utils`. If you change or remove a helper, the change is a breaking change.
- **`src/index.d.mts`** and **`src/index-lenient.d.mts`** — the two entry points. `index-lenient.d.mts` must not add new types. It only adjusts `AssumeHookRan`.
- **`src/foundry/common/abstract/document.d.mts`** — the core `Document` declaration. It has approximately 4000 lines. Each document type connects to it. Read this file first. Change it last.
- **`eslint.config.js`** — the document and placeable indirection rules. These rules prevent a known class of defect. Discuss a change first.
- **`package.json`, the `exports` and `imports` fields** — they set the public package surface and the internal path aliases. You can add an alias. If you remove or rename an alias, the change is a breaking change.
- **`.github/workflows/`** — the CI workflows. The `exactOptionalPropertyTypes false` step and the raw `tsgo` step find true regressions. Do not make them weaker.

---

## 6. Architecture

```
src/
  index.d.mts            # entry point — imports the global side effects
  index-lenient.d.mts    # alternative entry, AssumeHookRan pre-merged (not in the in-repo typecheck)
  foundry/               # mirrors the Foundry runtime tree 1:1
    common/              # shared by server and client (DataModel, Document, fields, packages, CONST)
    client/              # browser only (Applications, Canvas, Hooks, Game, CONFIG)
    public/scripts/      # public static scripts (workers, ktx2, clipper, earcut)
  configuration/         # the declaration-merging surfaces that users extend
  types/                 # internal helper types (documentConfiguration, lib augments)
  utils/                 # exported as `fvtt-types/utils` — generic TypeScript helpers
tests/
  foundry/               # mirrors src/foundry/ — one .test-d.ts for each file where it helps
  custom/                # tests for the lenient and configured surface
docs/agents/             # this documentation set + skill config (archive/ = closed v14 migration)
```

Path aliases, from the `imports` field of [package.json](package.json):

| Alias            | Path                              |
| ---------------- | --------------------------------- |
| `#client/*`      | `./src/foundry/client/*`          |
| `#common/*`      | `./src/foundry/common/*`          |
| `#utils`         | `./src/utils/index.d.mts`         |
| `#configuration` | `./src/configuration/index.d.mts` |
| `#tests/*`       | `./tests/foundry/*` (tests only)  |
| `#testUtils`     | `./tests/utils.ts` (tests only)   |

**The `_module.d.mts` barrel pattern.** Each directory has one. It agrees with the `_module.mjs` barrels of Foundry. In a `_module.d.mts` file, the imports use the `.mjs` extension, not `.d.mts`. This is correct and intentional. The file disables the `import-x/extensions` rule for this reason.

**The Implementation indirection.** Do not write `typeof Actor`. Do not write `Actor` as a value. Use `Actor.ImplementationClass` for the constructor type. Use `Actor.Implementation` for the instance type. For a document with subtypes, use `Actor.OfType<"character">`. The ESLint configuration gives a warning for a direct use.

---

## 7. Conventions

Prettier controls all formatting. See [.prettierrc.mjs](.prettierrc.mjs). The lint rules are in [eslint.config.js](eslint.config.js). The TypeScript strictness flags are in [tsconfig.base.json](tsconfig.base.json). The important flags are `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, and `verbatimModuleSyntax`. Do not repeat these tool rules in prose.

**File names.** Each authored declaration file uses the `.d.mts` extension. Never use `.d.ts`. File names use kebab-case. The name usually agrees with the primary class.

**Source mirroring.** `src/foundry/` mirrors the Foundry source tree 1:1. The order of the members in a class agrees with the order in the source. This lets a reviewer compare the two files side by side.

**Custom type namespaces.** For a class `Foo`, put the related types in `declare namespace Foo { ... }` in the same file. Examples are `Foo.Options`, `Foo.Implementation`, and `Foo.Metadata`. Do not put a custom type in the global namespace unless Foundry does the same.

**Imports.** Always write the file extension. Use `import type` where you can, because `verbatimModuleSyntax` is on. Use the `#` aliases in place of a long relative path. An import that only supports a `{@linkcode ...}` link can need this directive: `eslint-disable-next-line @typescript-eslint/no-unused-vars`.

**TSDoc.** Use TSDoc, not JSDoc. These custom tags are permitted: `@remarks`, `@privateRemarks`, `@defaultValue`, `@typeParam`, and `@immediate`. Align the `-` character after each `@param` name, because Prettier does not do this. Record a runtime default with `@defaultValue` and a fenced `typescript` block.

**Helper-type selection.** The doc comments in `src/utils/index.d.mts` give the full detail.

| Helper                  | Use it when                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `NullishProps<T>`       | Both `null` and `undefined` are correct. This is the most frequent case. |
| `InexactPartial<T>`     | `undefined` is correct, but `null` is not.                               |
| `IntentionalPartial<T>` | An explicit `undefined` would replace a default value during a merge.    |
| `AnyObject`             | In place of `Record<string, any>` or `{}`.                               |
| `EmptyObject`           | For an object that is truly empty. It is `Record<string, never>`.        |
| `AnyArray`              | In place of `any[]`. It is `readonly unknown[]`.                         |
| `AnyConstructor`        | In place of `new (...args: any[]) => any`.                               |

**Marker comments.** Use `// TODO:` for an improvement. Use `// TODO(LukeAbby):` for an assigned item, and keep the name when you edit nearby code. Use `// FIXME:` for a type that needs a type that does not exist yet, and add `// This will be added in PR #...` if you know the number. Use `// @remarks TODO: Stub` at the top of a file that has only a shell declaration.

**Empty interfaces.** The form `interface X extends _X {}` is permitted and is sometimes necessary. It can give declaration merging, a shorter name in IntelliSense, better performance, or a break in a recursion. Do not remove it to make the code more simple.

---

## 8. Anti-patterns

Do not use these again. Each one caused a defect.

- **`Partial<T>` for an option bag.** It mixed three different meanings: "omitted", "undefined", and "null". It also failed under `exactOptionalPropertyTypes`. Use the helpers in section 7.
- **An import from `type-fest`.** It caused duplicate definitions and drift from the in-repo helpers. The ESLint `no-restricted-imports` rule blocks it.
- **A bare `typeof Document` or `typeof Placeable`.** It caused a wrong type when a consumer set `CONFIG.X.documentClass` to a subclass. Use `.ImplementationClass`.
- **`{}` as the type for an empty object.** It accepts all values except `null` and `undefined`. Use `EmptyObject` or `AnyObject`.
- **A custom helper in `declare global { ... }`.** It caused name collisions with system and module code. Keep a helper in `declare namespace ClassName`.
- **An extension surface outside `src/configuration/`.** It made two sources of truth. Always use `src/configuration/`.
- **A `@deprecated` tag on a full `declare class`.** The `no-deprecated` rule then reports each internal self-reference in the file. Write `@remarks Deprecated since vNN — ...` in prose instead. A `@deprecated` tag on one member is acceptable.

---

## 9. Workflows

| Command                 | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `npm run typecheck`     | Run `tsgo` against `tsconfig.json`.                            |
| `npm run typecheck:all` | Run `tsgo --project tsconfig.all.json`. It includes the tests. |
| `npm run lint`          | Run typecheck, eslint, and `prettier --check`.                 |
| `npm run lint:fix`      | Run typecheck, `eslint --fix`, and `prettier --write`.         |
| `npm test`              | Run the runtime tests. These are mostly helper tests.          |
| `npm run test-types`    | Run the type-level tests with `vitest --typecheck`.            |
| `npm run test-all`      | Run both test sets.                                            |
| `npm run format`        | Run Prettier.                                                  |

CI runs three jobs for each pull request: **typecheck**, **lint**, and **test**. The typecheck job also runs a `tsc --exactOptionalPropertyTypes false` step and a raw `tsgo` step. The typecheck job and the lint job block a merge. The test job is advisory, because the runtime tests need a live Foundry instance that CI cannot supply.

`husky` and `lint-staged` run a subset of the checks before each commit. Do not use `--no-verify` unless the user asks for it.

**This fork does not publish to npm.** Consumers install from a git tag, for example `fvtt-types@github:Fronix/foundry-vtt-types#v14.363.0`.

---

## 10. Known defects and gotchas

- **Branded-type field overrides.** Several documents need a manual field override to keep a branded choice type. The documents are `ChatMessage`, `Drawing`, `MeasuredTemplate`, `JournalEntryPage`, `Playlist`, and `Scene`. Search for `FIXME: overrides required to enforce branded type`. Keep the overrides.
- **`ClientDocumentMixin` constructor shape.** It is not the usual mixin shape. The FIXME at `src/foundry/client/documents/abstract/client-document.d.mts:632` is intentional. Do not change it to the generic mixin pattern.
- **`tsgo` recursion limit on `_GetProperty`.** See `src/utils/index.d.mts:1385` and https://github.com/microsoft/typescript-go/issues/1278. Do not make the recursion deeper.
- **`.mjs` extensions in `_module.d.mts`.** These agree with the Foundry runtime barrels. The `eslint-disable import-x/extensions` comment at the top is correct. Keep it.
- **Stub files.** Many client applications have only a shell declaration with `@remarks TODO: Stub`. Search for that marker to get the list.
- **Lenient mode can hide errors.** `tsconfig.json` excludes `src/index-lenient.d.mts` on purpose. If errors disappear without a cause, you probably included that file.

---

## 11. Reference files

Read a file only when its condition is true. Do not read them all.

| File                                                         | Read it when                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`docs/agents/todo.md`](docs/agents/todo.md)                 | You have time for optional cleanup, or you must know if a strange thing is known and intentional. |
| [`docs/agents/conventions.md`](docs/agents/conventions.md)   | You write, edit, or review a TypeScript declaration.                                              |
| [`docs/agents/architecture.md`](docs/agents/architecture.md) | You must find your way in the code, or you must decide where a new type belongs.                  |
| [`docs/agents/decisions.md`](docs/agents/decisions.md)       | You make or judge a design decision. This file holds the ADRs.                                    |
| [`docs/agents/bugs.md`](docs/agents/bugs.md)                 | A typecheck error is unexpected, or a marker comment is not clear.                                |
| [`docs/agents/workflows.md`](docs/agents/workflows.md)       | You run the checks, or you compare a change with CI.                                              |
| [`docs/agents/skills.md`](docs/agents/skills.md)             | You are new to the repository, or a part of the stack is not familiar.                            |
| [`docs/agents/context.md`](docs/agents/context.md)           | You need the full domain vocabulary. Section 1 above is the short form.                           |

---

## 12. Skill configuration

The configuration for the engineering skills is in the same `docs/agents/` directory.

- **Issue tracker.** Issues are GitHub Issues on the `origin` remote, `Nimble-Co/foundry-vtt-types`. Use the `gh` CLI. See [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md).
- **Triage labels.** The five roles use their own names as the label strings: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See [`docs/agents/triage-labels.md`](docs/agents/triage-labels.md).
- **Domain docs.** The layout is single-context. This file is the root `CONTEXT.md`. The ADRs are in [`docs/agents/decisions.md`](docs/agents/decisions.md), not in a `docs/adr/` directory. See [`docs/agents/domain.md`](docs/agents/domain.md).

---

## 13. How to update this file

Update this file when one of these is true:

- The goal or the supported Foundry version changes.
- A term enters or leaves the ubiquitous language in section 1.
- A boundary file is added or removed.
- A convention or an anti-pattern is agreed or rejected.
- A command or a CI gate changes.

Keep the Simplified Technical English style. Write short sentences. Use the active voice. Use one word for one meaning.

Put the detail in the correct file under `docs/agents/`. Keep this file as the map.
