# Conventions

## When to consult this file

Consult this file when writing, editing, or reviewing TypeScript declarations in `src/` or tests in `tests/`. Not needed for repository-management tasks (CI, package metadata) or documentation-only edits.

## What tooling already enforces

Do not duplicate these in PR review — let the tools speak:

- **Formatting** is fully handled by Prettier — see [.prettierrc.mjs](../../.prettierrc.mjs).
- **Lint rules** including no-restricted-syntax for documents/placeables, import extension enforcement, no-empty-object-type carve-outs, and `@typescript-eslint/strictTypeChecked` + `stylisticTypeChecked` baselines — see [eslint.config.js](../../eslint.config.js).
- **TypeScript strictness** — see [tsconfig.base.json](../../tsconfig.base.json). Notable flags in effect: `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `verbatimModuleSyntax`.

If any rule below is enforceable by the linter, prefer making it a lint rule instead of documenting it here.

## Conventions not enforced by tooling

### File naming

- All authored declaration files use the extension `.d.mts`. Never `.d.ts`.
- Filenames are `kebab-case.d.mts`. The filename usually matches the kebab-cased version of the primary class it declares (`DialogV2` → `dialog.d.mts`).
- Every directory contains a `_module.d.mts` that re-exports the public surface of that directory, mirroring Foundry's own `_module.mjs` barrels. The leading underscore is intentional and matches the upstream convention.

### Source mirroring

- The directory and file layout of `src/foundry/` mirrors `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app` 1:1. If Foundry moves or renames a file in v14, mirror that movement.
- Within a single class declaration, the **order of members should match the order in the Foundry source**. This lets reviewers diff side-by-side. From CONTRIBUTING.md: "the order of declarations should be exactly the same."

### Namespacing custom types

- Do **not** add types to the global namespace unless Foundry itself does (e.g. a real `typedef`).
- For a class `Foo`, put related types in `declare namespace Foo { ... }` in the same file. Examples: `Foo.Options`, `Foo.Implementation`, `Foo.Metadata`.
- Generic TypeScript helper types go in [src/utils/index.d.mts](../../src/utils/index.d.mts) and are exported through `fvtt-types/utils`.
- Foundry-specific helper types that are not user-facing go in `src/types/`.

### Imports

- Always include the extension: `import type Foo from "./foo.d.mts";` — required by `import-x/extensions: ["error", "always"]`.
- Use the `#client/*`, `#common/*`, `#utils`, `#configuration` aliases in preference to long relative chains.
- Use `import type` wherever possible. `verbatimModuleSyntax` is on, so a value import that is only used as a type will error.
- Imports used purely for `{@linkcode X}` references must still be `import type` and may need an `// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.` directive.

### Documents and Placeables

- Never reference `typeof SomeDocument` or `SomeDocument` directly as a value type. Use:
  - `SomeDocument.ImplementationClass` (for the constructor type)
  - `SomeDocument.Implementation` (for the instance type)
  - `SomeDocument.OfType<"subtype">` when the document `hasSubtype` (see the `documents` table in [eslint.config.js](../../eslint.config.js))
- Same rule for placeables (`AmbientLight`, `Token`, `Wall`, …). The ESLint config will warn — those warnings are not noise.

### TSDoc

- Use TSDoc (not JSDoc) syntax in `.d.mts` files. ESLint runs `tsdoc/syntax`.
- Permitted custom tags: `@remarks`, `@privateRemarks`, `@defaultValue`, `@typeParam`, `@immediate`.
- For `@param` blocks, **align the `-` after each parameter name**. Prettier does not do this for you.
- Use `{@linkcode X}` for cross-references (renders monospaced in IDE tooltips). For external/MDN-style links use `{@link url | label}`.
- When a property has a runtime default, document it with `@defaultValue` and put the literal default value in a fenced typescript block:

  ````
  /**
   * @defaultValue
   * ```typescript
   * { width: 800, height: 600 }
   * ```
   */
  ````

### Helper-type selection

The `src/utils/index.d.mts` file documents this in detail. Quick reference:

- Use `NullishProps<T>` when both `null` and `undefined` are valid (most common case).
- Use `InexactPartial<T>` when only `undefined` is valid, not `null`.
- Use `IntentionalPartial<T>` when explicit `undefined` would clobber a default during a merge — read the long comment in `utils/index.d.mts` before picking this one.
- Use `AnyObject` instead of `Record<string, any>` or `{}`.
- Use `EmptyObject` (`Record<string, never>`) instead of `{}` for "actually empty".
- Use `AnyArray` (`readonly unknown[]`) instead of `any[]`.
- Use `AnyConstructor` instead of `new (...args: any[]) => any`.

### Marker comments for incomplete work

From CONTRIBUTING.md:

- `// TODO: description` — improvement that does not block correctness.
- `// TODO(LukeAbby): ...` — assigned TODO; preserve the attribution when editing nearby code.
- `// FIXME: SomeNotYetExistingType // This will be added in PR #...` — type would be wrong without a not-yet-existing type; prefer commenting out with a FIXME over breaking the build.
- `// @remarks TODO: Stub` at the top of a file marks a class that has only a shell declaration — useful target list for v14 work.

### Empty interfaces and `extends`

- `interface X extends _X {}` is intentionally allowed (`allowInterfaces: "with-single-extends"`) and is sometimes used to:
  - get declaration-merging on a computed type,
  - provide a shorter intellisense name,
  - break a recursion or improve performance.
    Do not "simplify" these away.

## Anti-patterns

These have been tried and rejected — do not reintroduce them:

- **`@deprecated` JSDoc tag on a whole `declare class`** — We tried tagging a deprecated class (e.g. `MeasuredTemplateConfig`, `FrameViewer`) with `@deprecated` — `@typescript-eslint/no-deprecated` then flags _every internal self-reference_ in the file (the `declare namespace`, the `Any`/`AnyConstructor` classes, the generic defaults), producing a dozen spurious errors — do not do it. Use `@remarks Deprecated since vNN — …` prose instead. (A `@deprecated` tag on a single **method/getter/property** is fine — it only flags call sites, of which there are usually none in-file.)
- **`Partial<T>` for option bags** — We tried plain `Partial` — it conflated "may be omitted" with "may be `undefined`" with "may be `null`" — do not reintroduce it. Use `NullishProps`, `InexactPartial`, or `IntentionalPartial` (all in `#utils`). The `IntentionalPartial` alias exists specifically to make audit easier.
- **`type-fest` imports** — We tried importing from `type-fest` directly — it caused duplicate definitions and surface-area drift versus the in-repo helpers — do not reintroduce it. The ESLint `no-restricted-imports` rule blocks it. Import from `fvtt-types/utils` (`#utils` inside the repo) instead.
- **Bare `typeof Document` / `typeof Placeable`** — We tried direct `typeof` references — it caused silent mis-typing when consumers configured `CONFIG.Actor.documentClass` to a subclass — do not reintroduce it. Use `.ImplementationClass`.
- **`{}` as "empty object" type** — We tried `{}` — it caused unsound assignment because `{}` allows anything except `null`/`undefined` — do not reintroduce it. Use `EmptyObject` or `AnyObject` as appropriate.
- **Polluting the global namespace with custom helper types** — We tried adding helpers globally — it caused name collisions with system/module code and shadowed Foundry's own globals — do not reintroduce it. Keep custom types inside a `declare namespace ClassName { ... }`.
- **Mutable global types added without going through `src/configuration/`** — We tried adding type-level extension points outside `configuration/` — it caused divergence between the documented extension surface and the actual surface — do not reintroduce it.

## How to contribute to this file

Update this file when:

- The team agrees on a new authored-convention not enforceable by lint/format.
- A previously-tried approach is rejected and needs to be added to "Anti-patterns" (use the "We tried X — it caused Y — do not reintroduce it" wording).
- A helper-type selection rule changes in `src/utils/index.d.mts`.

When you can make a convention a lint rule, do that instead and delete the prose entry.
