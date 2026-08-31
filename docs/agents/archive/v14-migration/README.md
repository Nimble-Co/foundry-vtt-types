# Archive — the v13 → v14 migration (closed)

**These files are historical. Do not use them to plan work.** The v13 → v14 migration is complete to its agreed scope and all eight phases are closed and CI-green. Nothing here is a live tracker any more.

They are kept because they record _why_ large parts of the type surface look the way they do — the decisions, the rejected alternatives, and the per-file verification evidence. That reasoning is not recoverable from the code.

## What is where

| File                                                 | Contents                                                                                                               |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [migration-v14.md](migration-v14.md)                 | The slim tracker: the 8-phase roadmap, the scope-priority decision, the branch/tag strategy, the per-session protocol. |
| [migration-v14-archive.md](migration-v14-archive.md) | Phases 1–4 in full, plus the original baseline-landscape survey.                                                       |
| [migration-v14-phase-5.md](migration-v14-phase-5.md) | Canvas — batches 5.1–5.7, the largest phase.                                                                           |
| [migration-v14-phase-6.md](migration-v14-phase-6.md) | Applications — the 65 stubs, sheets, and new foundations.                                                              |
| [migration-v14-phase-7.md](migration-v14-phase-7.md) | Greenfield — vfx, region-behaviors, Scene Levels, the 4 Tier-B giants. Holds the MeasuredTemplate WON'T-DO analysis.   |
| [migration-v14-phase-8.md](migration-v14-phase-8.md) | Cleanup — the deprecation prune, the version bump, the `_onXDocuments` removal.                                        |

## Reading these correctly

- **Checkbox state is frozen.** The eight remaining `[ ]` / `[~]` boxes are **not open work** — each was superseded by a later phase that closed the item elsewhere. Trust the phase files' prose over the boxes.
- **The ground truth was Foundry 14.363.0.** Later builds have not been diffed against these notes.
- **The per-session protocol in `migration-v14.md` no longer applies.** There is no tracker to keep current.

## Where the live knowledge went

Durable conclusions were lifted out of these files before archiving:

- **Decisions that still govern the codebase** → [`docs/agents/decisions.md`](../../decisions.md) (ADR-010 through ADR-013): the `Temporary` removal, the MeasuredTemplate / shapes-barrel descope, the deprecation-prune policy, and the `_onXDocuments` breaking removal.
- **Work left deliberately undone** → [`docs/agents/todo.md`](../../todo.md).
- **Type-level gotchas discovered en route** → [`docs/agents/bugs.md`](../../bugs.md).

If you need to reopen any of it — most likely near Foundry v16, when the MeasuredTemplate and shapes-barrel descopes come back into scope — the analysis is in phase-7.
