# Workflows

## When to consult this file

Consult this file when running typechecks, lint, or tests; when verifying a change against CI; or when publishing. Not needed for pure exploratory reading.

## Local commands

All commands are run from the repo root.

| Command                 | What it does                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`     | `tsgo` against the default `tsconfig.json` (excludes `index-lenient.d.mts`, `tests`, `cvise`).                          |
| `npm run typecheck:all` | `tsgo --project tsconfig.all.json` — broader scope including tests.                                                     |
| `npm run lint`          | Sequentially: `typecheck`, `eslint`, `prettier --check`. Same gate CI uses.                                             |
| `npm run lint:fix`      | `typecheck` + `eslint --fix` + `prettier --write`.                                                                      |
| `npm test`              | `vitest --run` — runtime tests only (mostly helpers).                                                                   |
| `npm run test-types`    | `vitest --typecheck --run --exclude '**/*.test.ts'` — runs the `.test-d.ts` files that assert types via `expectTypeOf`. |
| `npm run test-all`      | Both runtime and type tests.                                                                                            |
| `npm run format`        | Apply Prettier.                                                                                                         |

## CI gates (from `.github/workflows/checks.yml`)

Runs on `push` to `main` or `v14` and on every `pull_request`. Three jobs run in parallel:

1. **typecheck** — runs:
   - `npm run typecheck` (tsgo, default config)
   - `npx tsc --exactOptionalPropertyTypes false` (asserts the types are sound even with `eOPT` disabled — downstream consumers may not enable it)
   - `npx tsgo` (raw tsgo, no project flag)
2. **lint** — runs `npm run lint`.
3. **test** — installs Playwright browsers and runs `npm run test-types -- --reporter default --reporter github-actions`. Marked `continue-on-error: true` (informational — the runtime `.test.ts` suite needs a live Foundry instance CI can't provide, so it must not block).

**typecheck** and **lint** are the blocking gates; **test** is advisory. The "exactOptionalPropertyTypes = false" and raw `tsgo` steps catch classes of regression the default config does not — do not remove them (they are a boundary flagged in [CONTEXT.md](../../CONTEXT.md)).

## Local Foundry source as ground truth

Before editing a type, **read the corresponding `.mjs` file under `/mnt/d/foundrydevelopment/FoundryV14/App/resources/app`**. The mapping is:

| Repo path                               | Foundry path              |
| --------------------------------------- | ------------------------- |
| `src/foundry/client/**/*.d.mts`         | `client/**/*.mjs`         |
| `src/foundry/common/**/*.d.mts`         | `common/**/*.mjs`         |
| `src/foundry/public/scripts/**/*.d.mts` | `public/scripts/**/*.mjs` |

`global.d.mts` files in the Foundry source enumerate globals that this repo exposes via `src/foundry/client/_module.d.mts` and `src/configuration/globals.d.mts`.

## Foundry API docs via MCP

Use the `context7` MCP server when narrative docs are needed (e.g. "what changed in `ApplicationV2.render` between v13 and v14?"):

1. `mcp__context7__resolve-library-id` with `"foundry vtt"` or the closest match.
2. `mcp__context7__query-docs` with the resolved id and a specific question.

Prefer this over web search for any Foundry API question — see the MCP server instructions for the broader policy.

## Pre-commit

`husky` + `lint-staged` run on `git commit`. Configuration: [.lintstagedrc.js](../../.lintstagedrc.js). Do not bypass with `--no-verify` unless the user explicitly asks.

## Publishing

**This fork does not publish to npm.** The upstream League repo's npm-publish workflows (the `publishPrerelease` job on push to `main`, and the `release.yml` GitHub-release → npm job) were removed here — the fork lacks the `NPM_TOKEN`/`FVTT_NPM_TOKEN` secrets and must not republish the League packages. Consumption is via **git tags** instead: `fvtt-types@github:Fronix/foundry-vtt-types#v14.363.0` (see [archive/v14-migration/migration-v14.md](archive/v14-migration/migration-v14.md) "Branch & merge strategy" for the tag convention). If npm publishing is ever wanted on the fork, re-add a publish workflow with the fork's own package name and tokens.

## How to contribute to this file

Update this file when:

- A `package.json` script is added, removed, or has its behavior changed in a way contributors must know about.
- A CI job is added or its blocking semantics change.
- The Foundry install path used as ground truth changes.

Do not duplicate per-tool documentation that lives in `package.json` or the workflow YAML — link instead.
