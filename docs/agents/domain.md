# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

**Layout: single-context.** One [`CONTEXT.md`](../../CONTEXT.md) at the repo root — it exists and is the primary context document for the whole repo. ADRs live in [`decisions.md`](decisions.md) (this directory), **not** in a `docs/adr/` tree.

> **On ADRs:** this repo already keeps lightweight ADRs in [`decisions.md`](decisions.md) (same directory). **Prefer extending that file over starting a parallel `docs/adr/` tree** — one decision log, not two. Treat the `docs/adr/` layout described below as the fallback shape for repos that don't already have one.

## Before exploring, read these

- **[`CONTEXT.md`](../../CONTEXT.md)** at the repo root — always. Its section 1 is the ubiquitous language.
- **[`decisions.md`](decisions.md)** — read the ADRs that touch the area you are about to work in.

This repo has no `CONTEXT-MAP.md` and no `docs/adr/` tree; it is single-context and the ADRs are consolidated. If a skill's instructions assume those paths, map them to the two files above rather than creating parallel ones.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo (presence of `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in [`CONTEXT.md`](../../CONTEXT.md) section 1. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
