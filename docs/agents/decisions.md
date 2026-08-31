# Architectural Decisions

## When to consult this file

Consult this file when making or evaluating an architectural or design choice — especially one that crosses files or affects the public surface. Not needed for routine within-file edits.

Format: lightweight ADR — **Context → Decision → Consequences**, dated. Each ADR has a `Recorded:` date (when the decision was written into this file) and may have a `Originated:` note (best-effort estimate of when the decision actually took effect — inferred from the codebase, CONTRIBUTING.md, or `package.json` history; treat as approximate).

ADR-001 through ADR-010 were recorded on **2026-05-25** during the initial agent-documentation pass for v14. ADR-011 through ADR-013 were recorded on **2026-08-31**, lifted out of the v14 migration trackers when those were archived. Future ADRs should carry their actual creation date.

---

## ADR-001: Mirror the Foundry runtime tree 1:1

**Recorded:** 2026-05-25. **Originated:** pre-v9 (codified in CONTRIBUTING.md, long predates this record).

**Context.** Foundry's source is split across `client/`, `common/`, and `public/`. Reviewers spend most of their time side-by-side-diffing the Foundry source against this repo.

**Decision.** `src/foundry/` mirrors the Foundry runtime tree exactly. Member order inside a class also matches the upstream order. Diverging requires a strong reason.

**Consequences.** Reviewers can navigate by Foundry path. Cost: when Foundry restructures (as v14 did in places), the repo must follow even if a different layout would be cleaner. Also forces the `.d.mts` ↔ `.mjs` extension dance in `_module.d.mts` files (see [bugs.md](bugs.md)).

---

## ADR-002: User-extensible types via declaration merging into `fvtt-types/configuration`

**Recorded:** 2026-05-25. **Originated:** pre-v9 (long-standing).

**Context.** Game systems need to swap document classes, declare system-specific `system` data, and register module APIs. A purely-static type set could not express this.

**Decision.** Expose a small set of empty interfaces (`DocumentClassConfig`, `SourceConfig`, `DataConfig`, `SystemConfig`, `FlagConfig`, `SettingConfig`, `ModuleConfig`, `RequiredModules`, `AssumeHookRan`) in `src/configuration/`. Users `declare module "fvtt-types/configuration" { interface X {...} }` to extend them. Internal types route through these.

**Consequences.** A new extension surface should _only_ be added in `src/configuration/`. Adding extension surfaces elsewhere creates two sources of truth. Cost: configuration types are intricately interconnected; adding a new one requires care.

---

## ADR-003: Use TypeScript `imports` aliases (`#client`, `#common`, `#utils`) instead of long relative paths

**Recorded:** 2026-05-25. **Originated:** during v13 work (approximate).

**Context.** Files five levels deep importing five other deep files produced unreadable `../../../../` chains.

**Decision.** Use Node `imports` field in [package.json](../../package.json). All imports inside `src/` go through `#client/*`, `#common/*`, `#utils`, `#configuration`. Tests get `#tests/*` and `#testUtils`. ESLint blocks `#tests` and `#testUtils` from `src/`.

**Consequences.** Imports are stable across moves. Requires `moduleResolution: "bundler"` (or Node ≥16) downstream — see [README.md](../../README.md) compiler-option notes.

---

## ADR-004: Disallow direct `typeof Document` / `Document` value references via ESLint

**Recorded:** 2026-05-25. **Originated:** during the document-class-config rollout (approximate).

**Context.** Many bugs came from code writing `typeof Actor` to mean "the Actor class consumers will see," forgetting that `CONFIG.Actor.documentClass` can replace it.

**Decision.** ESLint `no-restricted-syntax` flags every `typeof <DocumentName>` and bare-expression `<DocumentName>`. Warnings (not errors) push contributors to `.ImplementationClass` and `.Implementation`. Same treatment for placeables.

**Consequences.** New contributors hit the warnings often and need orientation. Cross-references: this rule and the `.Implementation` pattern are why [bugs.md § ChatMessage / Drawing branded-choice overrides](bugs.md) exists at all.

---

## ADR-005: Authored entirely as `.d.mts`, not `.d.ts`, with explicit import extensions

**Recorded:** 2026-05-25. **Originated:** during ESM migration (codified in [eslint.config.js](../../eslint.config.js)).

**Context.** Foundry runs ESM (`type: "module"` since v11+). `verbatimModuleSyntax` plus `moduleResolution: bundler` need the file extension to match what consumers will resolve.

**Decision.** All source is `.d.mts`. `import-x/extensions` is `["error", "always"]`. `_module.d.mts` files use `.mjs` extensions in their imports (matching Foundry's runtime barrel files) — these are deliberately not `.d.mts` and the rule is locally disabled.

**Consequences.** No `.d.ts` should appear under `src/`. Adding one breaks consumer resolution under modern moduleResolution settings.

---

## ADR-006: Custom partial helpers (`NullishProps`, `InexactPartial`, `IntentionalPartial`) instead of `Partial<T>`

**Recorded:** 2026-05-25. **Originated:** long-standing.

**Context.** Plain `Partial<T>` conflates "may be omitted," "may be `undefined`," and "may be `null`," and breaks differently under `exactOptionalPropertyTypes`. Foundry's option-bag style mixes all three.

**Decision.** Provide three distinct helpers in `src/utils/index.d.mts` (their long doc-comments explain when to pick each). `IntentionalPartial` is itself an alias for `Partial<T>` — its purpose is to make audit easy.

**Consequences.** Picking the wrong one produces real bugs. Authors must read the helper picker section in `src/utils/index.d.mts` or in [conventions.md](conventions.md).

---

## ADR-007: Maintain compatibility with both `tsc` and `tsgo`

**Recorded:** 2026-05-25. **Originated:** with `@typescript/native-preview` adoption (approximate).

**Context.** The Go-based `tsgo` rewrite type-checks the same project meaningfully faster, but is still in preview and behaves differently in edge cases.

**Decision.** Both must pass in CI. `npm run typecheck` uses `tsgo`. The lint job runs the standard suite. A separate CI step runs raw `tsc` with `--exactOptionalPropertyTypes false` to catch a class of regression that the strict setting hides.

**Consequences.** Type expressions that trip `tsgo` bugs must be worked around with TODO references to the upstream tsgo issue (see [bugs.md](bugs.md) for examples). Both runners stay green.

---

## ADR-008: Two entry points — strict (`fvtt-types`) and lenient (`fvtt-types/lenient`)

**Recorded:** 2026-05-25. **Originated:** long-standing.

**Context.** Globals like `game` are only valid after the `init` hook. Modelling this strictly forces a type guard on every access; modelling it loosely loses correctness. Different users want different defaults.

**Decision.** Default entry point is strict. `fvtt-types/lenient` pre-merges `AssumeHookRan` so all globals are typed as their initialized form. `src/index-lenient.d.mts` is in the `tsconfig.json` `exclude` list so the lenient mode does not mask internal type errors.

**Consequences.** Two surfaces to keep coherent. `src/index-lenient.d.mts` must not introduce new types — it only adjusts `AssumeHookRan`. Cross-references: see [bugs.md § Lenient mode masking](bugs.md) if symptoms suggest the wrong entry point is being typechecked.

---

## ADR-009: ESLint warnings (not errors) for the document/placeable indirection rules

**Recorded:** 2026-05-25. **Originated:** current setting at time of record.

**Context.** Making the document/placeable rules errors would block too many in-progress files and tests where direct references are intentional.

**Decision.** Use `warn`. The `directExpressionSelector` is also intentionally relaxed (the `allowedPropsRegex` parameter is currently unused — see the comment in [eslint.config.js](../../eslint.config.js)).

**Consequences.** Reviewers must still notice and call out unjustified bare-document references. Tightening to `error` is a deliberate future step — not yet taken.

---

## ADR-010: Remove the `Temporary` document concept for v14

**Recorded:** 2026-05-25. **Originated:** 2026-05-25 (during v14-migration planning).

**Context.** In v13, a create operation could be `temporary: true`, producing an in-memory, unsaved document (`_id: null`). The types modelled this with a `Temporary` type parameter and a `X.TemporaryIf<Temporary>` helper threaded through ~234 sites (`CreateOperation`, `CreateReturn`, `PreCreateOptions`, `BackendCreateOperation`, `CreateDialogReturn`, and the `Document.TemporaryIfForName` dispatcher). Foundry **v14 removed the `temporary` create option entirely** — `DatabaseCreateOperation` (`common/abstract/_types.mjs`) no longer has the field, and `createDialog` returns `Promise<Document | null>` (always stored, or null). The repo's `Temporary` machinery was stale v13 modeling. See [archive/v14-migration/](archive/v14-migration/README.md).

**Decision.** Remove the `Temporary` / `TemporaryIf` concept across the type surface. Creates resolve to `X.Stored`. **Done** — in two steps: the bounded `createDialog`-return slice (migration Phase 1) first, then the full removal rooted in the `common/abstract/document.d.mts` boundary file (Phase 2, under human review). Both phases landed CI-green; ~85 files touched.

**Consequences.** This is a **breaking change** for downstream consumers that reference `X.TemporaryIf` or pass a `Temporary` type argument — those references must be dropped or replaced with `X.Stored`. It simplified the create surface considerably (one fewer type parameter on a large family of helpers). Because it touched the `document.d.mts` boundary file at ~234 sites it carried real regression risk, so the second step was gated behind human review. Cross-reference: [context.md § Temporary vs Stored document](context.md).

---

## ADR-011: Keep the deprecated MeasuredTemplate surface intact rather than structurally un-embedding it

**Recorded:** 2026-08-31 (lifted from the migration trackers). **Originated:** 2026-05-28 (migration Phase 7, maintainer-agreed).

**Context.** v14 merges `MeasuredTemplate` into `Region`: it is removed from `ALL_DOCUMENT_TYPES`, un-embedded from `Scene`, and reduced to a deprecated shim whose CRUD delegates to `RegionDocument`. Modelling that structurally is not a local edit — `Document<Name extends ALL_DOCUMENT_TYPES>` would reject `"MeasuredTemplate"`, `parentCollection` would lose `"templates"`, and `PlaceableObject.AnyCanvasDocument` (derived from `Scene.Embedded.Name`) would stop admitting the deprecated placeable, breaking the templates layer, the placeable, and `config.d.mts`. The whole legacy surface nonetheless **still works at runtime through v16**.

**Decision.** Do **not** perform the structural un-embed. Type the full legacy surface and mark it `@deprecated since v14` in prose. The **client-data shapes-barrel unification** is descoped on the same grounds — the client shape classes would shadow the common `BaseShapeData` subclasses and break `RegionDocument#shapes`. Revisit both **near v16**, when Foundry actually removes the shim.

**Consequences.** The types deliberately diverge from v14's document taxonomy in this one place, in the consumer's favour: un-embedding would delete `scene.templates` from the types and break backward-compatible code that still legitimately reads it during the v14→v16 window. New code should extend `RegionDocument`, not `MeasuredTemplate`. The full cascade analysis — including a sketched `DEPRECATED_DOCUMENT_TYPES` approach — is retained in [archive/v14-migration/migration-v14-phase-7.md](archive/v14-migration/migration-v14-phase-7.md) for whoever picks this up at v16. Tracked in [todo.md](todo.md) only insofar as Scene's `background`/`foreground` migration remains.

---

## ADR-012: On a version bump, remove deprecations that reflect runtime reality; keep and reword the ones that are migration aids

**Recorded:** 2026-08-31 (lifted from the migration trackers). **Originated:** 2026-05-28 (migration Phase 8, maintainer-agreed).

**Context.** Targeting v14 raised the question of what to do with ~760 members marked `@deprecated … will be removed in v14`. Treated as one bucket it looked like a large breaking change. Investigation showed the bucket is really two: **(a)** TS-only convenience aliases (chiefly the database-operation renames, `CreateDocumentsOperation` → `CreateOperation`, ~20× per document file) that have no runtime counterpart, and **(b)** members the v14 runtime genuinely dropped or hard-privatised.

**Decision.** Split the pass. **Remove (b)** — verified absent from the v14 source, so keeping them is an accuracy defect. **Keep (a) and reword** the now-false `will be removed in v14` note to `removed in a future version`. Removing (a) would be a pure breaking change with zero accuracy gain.

**Consequences.** The prune landed non-breaking (79 files, +763 / −1270). Generalise the rule to future version bumps: **a deprecation marker is only worth removing when the runtime member is actually gone** — verify against the source before deleting, and treat type-only aliases as migration aids worth their keep. The separate `until v14` marker bucket was left alone; see [todo.md](todo.md) item 1.

---

## ADR-013: Remove the `_onXDocuments` static methods (breaking) once verified absent from the runtime

**Recorded:** 2026-08-31 (lifted from the migration trackers). **Originated:** 2026-07-02 (migration Phase 8, explicit maintainer sign-off).

**Context.** `_onCreateDocuments` / `_onUpdateDocuments` / `_onDeleteDocuments` were static document lifecycle hooks with a large type footprint: 3 base methods, 105 leaf overrides, 104 namespace interfaces, 105 lookup-map entries, and 3 boundary types in `document.d.mts`. A source check found **zero occurrences anywhere in the v14.363.0 runtime** — meeting the [ADR-012](#adr-012-on-a-version-bump-remove-deprecations-that-reflect-runtime-reality-keep-and-reword-the-ones-that-are-migration-aids) category-(b) bar.

**Decision.** Remove the whole family, along with the dead context aliases, the `…ForName` types, and the now-unreachable `Extract` branch of `_RestrictToDataObjects`. Deliberately **preserve** the live aliases `X.Database.DeleteDocumentsOperation` and `UpdateDocumentsOperation` — those still name real types.

**Consequences.** Net 75 files, +6 / −3559; all five CI gates green. **Breaking** for subclass authors calling `super._onCreateDocuments` (etc.), who must move to `_onCreateOperation` / `_onUpdateOperation` / `_onDeleteOperation`. This is the worked example of ADR-012's rule: the size of the diff was not the deciding factor — the absence of the runtime member was.

---

## Anti-patterns (architectural approaches considered and rejected)

- **Single global `declare global { ... }` block for all Foundry globals.** Considered for simplicity — rejected because it forced every module/system consumer to pollute their own globals and made tree-shaking unreliable. Globals are introduced narrowly in `src/configuration/globals.d.mts`.
- **Re-exporting `type-fest` as the utility surface.** Considered to avoid reinventing helpers — rejected because it tied the public type surface to an external versioning cadence and several `type-fest` helpers (`PartialDeep`, etc.) had subtly wrong semantics for our use case. The `no-restricted-imports` rule blocks `type-fest` imports outside dev tooling.
- **Single `documents.d.mts` file listing every Document.** Considered to avoid the deep tree — rejected because it scaled poorly during v9/v10 migrations and made conflict resolution impossible during version bumps.
- **Auto-generated types from Foundry's JSDoc.** Considered — rejected because Foundry's JSDoc is incomplete, sometimes incorrect, and lacks the variance/branding nuance these types require. The maintained hand-written types catch bugs the JSDoc never could.

## How to contribute to this file

Update this file when:

- A decision crosses files or affects the public surface.
- A previously-tried architectural approach is rejected (add to Anti-patterns with a brief reason).
- A decision becomes the documented cause of a [bugs.md](bugs.md) entry — cross-reference it.

Date-stamp every new entry (`YYYY-MM-DD`). Keep ADRs short — Context, Decision, Consequences. Link out for details.
