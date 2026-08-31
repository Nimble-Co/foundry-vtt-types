import { expectTypeOf } from "vitest";

import CanvasEdges = foundry.canvas.geometry.edges.CanvasEdges;
import Edge = foundry.canvas.geometry.edges.Edge;

declare const level: Level.Implementation;
const myCanvasEdges = new CanvasEdges(level);
declare const someEdge: Edge;
declare const rect: PIXI.Rectangle;

expectTypeOf(myCanvasEdges.level).toEqualTypeOf<Level.Implementation>();
expectTypeOf(myCanvasEdges.set("foo", someEdge)).toEqualTypeOf<CanvasEdges>();
expectTypeOf(myCanvasEdges.delete("foo")).toBeBoolean();
expectTypeOf(myCanvasEdges.clear()).toEqualTypeOf<CanvasEdges>();

expectTypeOf(myCanvasEdges.identifyIntersections()).toEqualTypeOf<void>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.initialize()).toEqualTypeOf<void>();

// The `inititalize` typo was renamed to `initialize` in v14.367.
expectTypeOf(myCanvasEdges).not.toHaveProperty("inititalize");
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();

const ctf = (edge: Edge) => edge.type === "wall";
expectTypeOf(myCanvasEdges.getEdges(rect)).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: ctf,
    collisionTestBounds: true,
    includeInnerBounds: true,
    includeOuterBounds: false,
  }),
).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: undefined,
    collisionTestBounds: undefined,
    includeInnerBounds: undefined,
    includeOuterBounds: undefined,
  }),
).toEqualTypeOf<Set<Edge>>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<Edge>();
}
