# Spec — Update the types to Foundry VTT 14.367

Status: ready for agent. Local spec. There is no GitHub issue for this work.

This document uses ASD-STE100 Simplified Technical English, as CONTEXT.md requires.

---

## Problem Statement

The package declares types for Foundry VTT build 14.363. Foundry released build 14.367. Four builds of changes are not in the type surface.

A consumer who runs Foundry 14.367 gets wrong types. The types have three defects:

- A member that build 14.367 added is absent. The consumer gets an error for correct code.
- A member that build 14.367 removed is still declared. The consumer writes code that fails at run time.
- A signature that build 14.367 changed is stale. The consumer passes the wrong arguments.

The release notes do not show all of the changes. A source comparison of build 14.363 against build 14.367 found two changes that no release note records: the `migrateData` signature change on `DataModel`, and a new canvas transform mixin. A consumer cannot find these changes from the published notes.

## Solution

Update the declarations to agree with the Foundry source of build 14.367.

Find the work from a comparison of the two source trees, not from the release notes. Use the release notes only as a cross-check at the end.

The result is a type surface that agrees with the 14.367 run time. The three CI gates stay green.

## User Stories

1. As a system developer, I want the types to declare the members that build 14.367 added, so that my correct code does not give a type error.
2. As a system developer, I want the types to omit the members that build 14.367 removed, so that I do not write code that fails at run time.
3. As a system developer, I want `DataModel.migrateData` to accept its second parameter, so that I can pass cleaning options in a subclass override.
4. As a system developer, I want each `migrateData` override on a Document to have the same signature as the base, so that my own override compiles.
5. As a module developer, I want a type for the new autocomplete tags element, so that I can use the custom element with type safety.
6. As a module developer, I want a type for the new canvas transform mixin, so that I can extend it in a canvas module.
7. As a module developer, I want `CanvasDocument#locatedInLevel` to be declared, so that I can test location instead of inclusion.
8. As a module developer, I want `PlaceableObject#isFilteredOut` to be declared, so that I can react to the placeable tab filter.
9. As a module developer, I want `RegionAnimationState#testPoint` to be declared, so that I can test a point against an animated region state.
10. As a module developer, I want the `notify` option on `ChatMessage#update` to be declared, so that I can notify the chat log of an update.
11. As a module developer, I want the new return shape of `DocumentSheetV2#_processSubmitData` to be declared, so that I can read which Document was created or updated.
12. As a system developer, I want the token bar colors to be declared as a separate member, so that I can change bar colors without an override of the private draw method.
13. As a module developer, I want the `concreteOnly` option on `Actor#getDependentTokens` to be declared, so that I can exclude ephemeral tokens.
14. As a module developer, I want `WallDocument#_onEdgeChange` to be declared, so that I can react to an edge change.
15. As a module developer, I want the removed `priorLevels` and `changedTypes` options to be absent from `WallDocument#initializeEdge`, so that the compiler stops me from passing an option the run time ignores.
16. As a canvas module developer, I want `PointEffectSource#_getPolygonBackend` to be declared, so that I can supply a custom polygon backend.
17. As a canvas module developer, I want `BaseEffectSource#_couldShapesChanges` to be declared, so that I can control shape recalculation.
18. As a canvas module developer, I want `PrimaryCanvasObject#inPrimary` and `PrimaryCanvasContainer#inPrimary` to be declared, so that I can test group membership.
19. As a canvas module developer, I want `PrimaryCanvasContainer#sortLayer` to be declared, so that I can control sort order.
20. As a canvas module developer, I want `PrimaryCanvasGroup#objects` to be declared, so that I can read all primary canvas objects.
21. As a canvas module developer, I want `PrimaryCanvasParticleContainer` to extend `PrimaryCanvasContainer` in the types, so that the inherited members are visible.
22. As a module developer, I want `Level#updateRegionShapeConstraints` to be declared, so that I can update region shape constraints on a Level.
23. As a module developer, I want `ActiveEffect#getReplacementData` to be declared, so that I can supply enriched replacement data.
24. As a module developer, I want the `scroll` option on chat message creation to be declared, so that I can stop the chat log from scrolling.
25. As a module developer, I want the option for a chat message that is not pushed to the notification feed to be declared, so that I can create a silent message.
26. As a module developer, I want compendium item art mapping to be declared, so that I can supply art for a compendium item.
27. As a module developer, I want `locked` and `hidden` to be declared as getters on the canvas Documents that do not define these fields, so that I can read them without a type error.
28. As a module developer, I want the members that changed from private to protected to be declared as protected, so that I can call them from a subclass.
29. As a maintainer, I want the changes to mirror the Foundry source exactly, so that the types never describe a run time that does not exist.
30. As a maintainer, I want the undocumented changes to be found by a source comparison, so that a gap in the release notes does not become a gap in the types.
31. As a maintainer, I want the files with no signature change to stay untouched, so that the review diff holds only real changes.
32. As a maintainer, I want each type test that already exists to stay green, so that I know the change did not break the declared behaviour.
33. As a maintainer, I want a new member to get a type test only where a test file already exists, so that the diff stays proportionate.
34. As a maintainer, I want a change to a boundary file to be reported before I merge, so that I can review the effect on consumers.
35. As a maintainer, I want the package version to state 14.367.0, so that a consumer can see the target build.
36. As a maintainer, I want CONTEXT.md to name build 14.367 as the reference, so that the next session compares against the correct source.
37. As a maintainer, I want the ground truth path in CONTEXT.md to name a path in this WSL instance, so that the source is available without a mounted drive.
38. As a maintainer, I want no git tag from this work, so that I control when a release happens.
39. As a consumer, I want the removal of the `initializeEdge` options to be recorded in the commit message, so that I understand why my code stopped to compile.
40. As a consumer, I want the deprecation and access changes to use the repository idiom, so that the types stay consistent.
41. As a reviewer, I want the changes to keep Foundry source member order, so that I can compare the two files side by side.
42. As a reviewer, I want a report of each decision that the source did not settle, so that I can check the judgement calls.

## Implementation Decisions

### Source of truth

Build 14.367 source is at `~/foundry/v14`. Build 14.363 source is at `~/foundry/363`. Both trees are in this WSL instance.

Do not use a mounted drive. The `/mnt/d` tree is build 14.364 and is stale. Correct the path that CONTEXT.md section 4 names.

### How to find the work

Compare the two source trees. Do not trust the release notes to be complete.

The comparison found 194 changed files in the client and common trees. A signature filter reduced these to 134 files that hold a possible type change.

Do not use a numeric threshold on the filter score. A sample showed that a low score can be a real signature change and a high score can be implementation churn. Classify each file. Read the full comparison for a file only when the filter shows a signature line.

The 60 files with no signature signal stay unread. This is an accepted risk.

### Buckets of work

**Bucket A — the `migrateData` signature.** `DataModel.migrateData` takes a second parameter in build 14.367. `DataModel.migrateDataSafe` takes the same parameter. Eleven Document classes override the method and take the parameter.

The Foundry source types the parameter as `Readonly<DataModelCleaningOptions>`. This repository has no `DataModelCleaningOptions` type. The name is present only in a commented-out line. The near analog in this repository is the clean options interface on `DataField`.

Decision: add a named options interface for the base method. Follow the idiom that `BasePackage` already uses for its own `migrateData` options. That precedent exists in the repository and is the closest prior art. Reuse the `DataField` clean options where the shape agrees, rather than to declare a second source of truth.

The decision in type form:

```ts
static migrateData(source: AnyMutableObject, options?: DataModel.MigrateDataOptions): AnyMutableObject;
```

There are 25 `migrateData` declarations in the source tree. Update each one that the Foundry source changed. Leave the others.

**Bucket B — new files.** Build 14.367 adds four source files and removes none.

- The autocomplete tags custom element. The release notes record it.
- A canvas transform mixin. No release note records it.
- A types module for the application UI directory.
- A types module for the application UX directory.

Give each one a full declaration. The source is available, so a stub is not necessary.

**Bucket C — documented changes.** Apply the API changes that the release notes for builds 14.364, 14.365 and 14.366 record. Build 14.367 records no API change. Confirm each entry against the source before you write it.

**Bucket D — heavy churn.** These classes have the most signature signal: Region document, Token document, primary canvas container, Token placeable, Wall document, primary canvas object, the chat sidebar tab, the base Application, the change level region behaviour, the canvas loader and the compendium art helper. Read the full comparison for each.

**Bucket E — boundary files.** The comparison touches the core `Document` declaration, the `DataField` module, the constants module, the config module and the client Document mixin. Bucket A also touches the `DataModel` base.

CONTEXT.md section 5 marks these files as human review. Report each change to a boundary file in the final summary.

### Rules for the change

Mirror the Foundry source exactly. Delete a member that build 14.367 removed. Apply an access change that build 14.367 made. Do not keep a removed member alive with a deprecation.

This is a breaking change for a consumer that passes the removed `initializeEdge` options. Record the break in the commit message.

Do not put a `@deprecated` tag on a whole class declaration. CONTEXT.md section 8 forbids it.

Keep Foundry source member order.

A documentation-only change in the Foundry source can still need work. The hook option comments changed meaning in three database operation types. Correct the `@remarks` text where the meaning changed. Ignore a pure typographic correction.

### Version and documents

Set the package version to 14.367.0. Update CONTEXT.md section 4 to name build 14.367 as the reference build, and to name the WSL path.

Do not create a git tag. The user controls the release.

## Testing Decisions

### The seam

This package ships no JavaScript. There is no run-time seam. The test seam is the type checker.

There are three gates, and they are the only seam this work uses:

- The type check of the source tree.
- The lint gate, which runs the type check, ESLint and the format check.
- The type tests, which run with the Vitest type check mode against the `.test-d.ts` files.

This is the highest seam available and it already exists. Do not add a new seam. There are 533 type test files and they mirror the source tree.

**Confirm this seam before work starts.** The rest of the plan does not depend on the answer, but the test scope does.

### What makes a good test

A good test asserts the external type surface. It asserts what a consumer can write and what a consumer cannot write.

A good test does not assert an internal helper type or a private member. It does not restate the declaration.

Assert both directions. Assert that correct code compiles. Assert that wrong code gives an error. A test that only asserts the first direction passes when the type is too wide.

### What to test

Extend a `.test-d.ts` file when the class you change already has one. Do not author a new test file for a class that never had coverage.

Cover these in particular:

- The second parameter of `migrateData` on the base and on an override.
- The absence of the removed `initializeEdge` options. This needs a negative assertion.
- The new members on the primary canvas classes.
- The new inheritance of the particle container.

### Prior art

The existing type tests under the tests tree show the idiom. The tests for the utility types and for the configured Documents show the negative assertion style.

## Out of Scope

- The public scripts tree. Twenty-one files changed there. The user decided that this tree does not matter for this work. Do not add an entry to the standing TODO for it.
- A git tag and a release.
- The four items in the standing TODO. They stay open and this work does not touch them.
- The 60 changed files with no signature signal.
- A refactor of a type that build 14.367 did not change.
- Any new extension point in the configuration directory. A new extension point needs a design discussion first.
- A comparison against any build after 14.367.

## Further Notes

The weight of the work is not even. Build 14.365 holds the most change. It has about ten additions, one removal, one change of class hierarchy and several access changes. Build 14.364 has additions only. Build 14.366 is small. Build 14.367 is a bug fix build and records no API change.

Two risks are known.

First, bucket A goes through `DataModel`. Each Document inherits from it. The work can be larger than the file count suggests.

Second, the accepted risk of the unread files. If a defect report arrives later for a member that this work did not touch, the unread set is the first place to look.

The agent runs the whole plan without interruption after the user confirms the seam. The final report lists each decision that the source did not settle, and each change to a boundary file.
