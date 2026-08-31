# Skills & Tech Stack

## When to consult this file

Consult this file when onboarding or when you are unsure whether an unfamiliar piece of the stack is in scope. Not needed for routine type edits if you have already worked in this repo.

## What this project is

This repository is a TypeScript **declaration-only** package: it ships `.d.mts` files describing the runtime API of [Foundry Virtual Tabletop](https://foundryvtt.com/). It does not ship any JavaScript. Every authored source file is a declaration file consumed by downstream system/module developers.

Published as `@league-of-foundry-developers/foundry-vtt-types` (also as `fvtt-types`).

## The single goal

Model **Foundry VTT v14** accurately. Type accuracy against the v14 runtime is the objective; ergonomics and convenience come second.

The multi-session v13 → v14 migration that established this is **complete** — see [archive/v14-migration/](archive/v14-migration/README.md) for its record, and [todo.md](todo.md) for the handful of items left undone on purpose. The repo is now in maintenance: keep the types accurate as Foundry ships new builds.

## Required reading before changing types

1. The matching file in the Foundry source at `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app` — this is the ground truth.
   - Client runtime: `client/` (mirrors `src/foundry/client/`)
   - Common (shared server/client) runtime: `common/` (mirrors `src/foundry/common/`)
   - Public static scripts: `public/scripts/` (mirrors `src/foundry/public/scripts/`)
2. The current Foundry API docs via the `context7` MCP server when you need narrative documentation, deprecation notes, or recent migration guidance. Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs`. Prefer the MCP over web search for Foundry API specifics.
3. [CONTRIBUTING.md](../../CONTRIBUTING.md) for style conventions the maintainers enforce by hand.

## Tech stack

- **TypeScript** (peer dep `>=5.4`, dev uses `^6.0.2` plus `@typescript/native-preview` aka `tsgo`). The repo type-checks under both `tsc` and `tsgo`; both must pass.
- **ESLint** flat config with `typescript-eslint`, `eslint-plugin-import-x`, `eslint-plugin-jsdoc`, `eslint-plugin-tsdoc`. See [eslint.config.js](../../eslint.config.js).
- **Prettier** for formatting — see [.prettierrc.mjs](../../.prettierrc.mjs).
- **Vitest 4** for tests, including type-level tests (`vitest --typecheck`). Test files use the `.test-d.ts` suffix for type-only tests and `.test.ts` for runtime/behavioral tests of helpers.
- **Husky** + **lint-staged** for pre-commit.
- Runtime dependencies (PixiJS, ProseMirror, Handlebars, etc.) are the same libraries Foundry bundles — they are imported for their types only.

## Knowledge an agent needs

- Strong TypeScript: conditional types, distributive conditionals, mapped types, variance, declaration merging, module augmentation, `infer`, branded types, `extends` constraints, `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` semantics.
- The Foundry VTT runtime model: `Document`, `DataModel`, `DataField`, `Application`/`ApplicationV2`, `Canvas`/`PIXI` layers, `Hooks`, `CONFIG`, `game`, `CONST`.
- ESM-only authoring: `.d.mts` everywhere, `import-x/extensions` rule requires explicit extensions on imports.

## How to contribute to this file

Update this file when:

- A major new dependency is added or removed.
- The mandatory ground-truth source (Foundry install path) changes.
- The set of TypeScript variants the repo must support changes (e.g. dropping `tsgo`, or raising the peer `typescript` floor).

Do not add general TypeScript tutorials — link to MDN or the TS handbook instead.
