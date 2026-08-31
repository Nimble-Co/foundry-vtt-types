# Standing TODO

## When to consult this file

Consult this file when you have capacity for opportunistic cleanup, or when you touch one of the areas listed below and want to know whether the oddity you're looking at is known and deliberate. Not needed for routine work.

Everything here is **non-gating** — the v14 migration closed without these, CI is green, and no consumer is blocked. Each item was left undone on purpose; the reason is recorded.

Detailed history for all four is in [`archive/v14-migration/`](archive/v14-migration/README.md).

---

## 1. `until v14` deprecation markers (~210 occurrences)

**What.** Roughly 210 `@deprecated … until v14` markers remain across `src/`. Now that v14 _is_ the target, the window they name has elapsed.

**Why it's not done.** This is a distinct bucket from the `removed in v14` prune (which was completed — see [ADR-012](decisions.md)). Rewording is cosmetic and touches a very large number of files for no accuracy gain.

**How to do it.** The repo's idiom mirrors Foundry's own `{since, until}` deprecation metadata, so markers name a concrete Foundry version. **Prefer bumping the window to the real Foundry target (`until v15` / `until v16`) or dropping it entirely — do not invent an "until a future version" phrase where a genuine Foundry window still applies.** Check the member against the Foundry source to find the real window before editing.

Regenerate the inventory: `grep -rn "until v14" src/`

---

## 2. `TypedObjectField` create-optionality

**What.** `TypedObjectField` lacks `SchemaField`'s implicit-`{}`-initial, so a required `TypedObjectField` is wrongly treated as required in `CreateData`.

**Why it's not done.** It's an ergonomic enhancement to `fields.d.mts`, not an accuracy bug, and the current workaround is correct.

**How to do it.** Give `TypedObjectField` the same implicit-`{}`-initial that `SchemaField` has, then **remove the now-redundant workaround** at `src/foundry/client/documents/token.d.mts` — the `detectionModes` field's `{ initial: Record<string, never> }`. That workaround is the marker for this item; if you change one, change both.

---

## 3. Scene giant — `background` / `foreground` schema → deprecated getters

**What.** v14 moved `background`, `foreground`, `backgroundColor`, and `foregroundElevation` off `Scene` and onto the new `Level` document. The repo still declares them as Scene schema fields.

**Why it's not done.** It is a schema _removal_, so it cascades into consumers and tests — the only substantive piece of the Scene Tier-B giant left after phase 7. Also outstanding on Scene: the static `_onUpdateOperation` override and a full member-order verification.

**How to do it.** Migrate the four fields to `@deprecated` getters delegating to the appropriate `Level`, then fix the test fallout. Treat as a breaking change for consumers reading `scene.background`.

---

## 4. Member-order parity on `scene` / `active-effect`

**What.** [conventions.md](conventions.md) requires class members to appear in Foundry source order so reviewers can diff side-by-side. `scene.d.mts` and `active-effect.d.mts` drifted during their phase-7 rewrites.

**Why it's not done.** Explicitly ruled out of scope by the migration's scope-priority decision — cosmetic, and both files were being heavily edited at the time.

**How to do it.** Reorder members against the v14 source. Purely mechanical; safest done as its own commit so the diff is reviewable as a pure move.

---

## How to contribute to this file

Add an item when you deliberately leave work undone that a future session should know about. Record **what**, **why it's not done**, and **how to do it** — the "why" is the part that gets lost.

Delete an item when it is done. Don't leave a "closed" entry behind; the commit message is the record.
