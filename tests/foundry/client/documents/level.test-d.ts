import { expectTypeOf } from "vitest";
import type CanvasEdges from "#client/canvas/geometry/edges/edges.mjs";

const level = new Level.implementation({ name: "Basement" });
expectTypeOf(level).toEqualTypeOf<Level.Implementation>();

// Client-side members
expectTypeOf(level.index).toEqualTypeOf<number>();
expectTypeOf(level.isView).toEqualTypeOf<boolean>();
expectTypeOf(level.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(level.edges).toEqualTypeOf<CanvasEdges>();
expectTypeOf(level.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(level.clampElevation(10)).toEqualTypeOf<number>();
expectTypeOf(level.clampElevation(10, 2)).toEqualTypeOf<number>();
expectTypeOf(level.updateRegionShapeConstraints()).toEqualTypeOf<void>();
expectTypeOf(level.updateRegionShapeConstraints(undefined)).toEqualTypeOf<void>();
expectTypeOf(level.updateRegionShapeConstraints(["light", "sound"])).toEqualTypeOf<void>();
expectTypeOf(level.updateRegionShapeConstraints(new Set(["move"] as const))).toEqualTypeOf<void>();

// @ts-expect-error `"invalid"` is not an edge restriction type
level.updateRegionShapeConstraints(["invalid"]);

// Initialized schema data
expectTypeOf(level.name).toEqualTypeOf<string>();
expectTypeOf(level.sort).toEqualTypeOf<number>();
expectTypeOf(level.visibility.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(level.background.tint).toEqualTypeOf<Color>();
expectTypeOf(level.parent).toEqualTypeOf<Scene.Implementation | null>();
