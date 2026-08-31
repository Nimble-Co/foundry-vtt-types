import { describe, expectTypeOf, test } from "vitest";

import PrimaryCanvasContainer = foundry.canvas.primary.PrimaryCanvasContainer;
import PrimaryCanvasParticleContainer = foundry.canvas.primary.PrimaryCanvasParticleContainer;

declare const renderer: PIXI.Renderer;
declare const primaryCanvasGroup: foundry.canvas.groups.PrimaryCanvasGroup;

describe("PrimaryCanvasContainer tests", () => {
  const myPCC = new PrimaryCanvasContainer();
  test("Miscellaneous", () => {
    expectTypeOf(myPCC.sort).toBeNumber();
    myPCC.sort = 5; // Setter

    expectTypeOf(myPCC.sortLayer).toBeNumber();
    myPCC.sortLayer = 5; // Setter

    expectTypeOf(myPCC.zIndex).toBeNumber();
    myPCC.zIndex = 5; // Setter

    expectTypeOf(myPCC.elevation).toBeNumber();
    myPCC.elevation = 5; // Setter

    // @ts-expect-error `elevation` is numeric.
    myPCC.elevation = "5";

    expectTypeOf(myPCC.inPrimary).toBeBoolean();
    expectTypeOf(myPCC["_inPrimary"]).toBeBoolean();

    // @ts-expect-error `_inPrimary` is protected.
    myPCC._inPrimary;

    expectTypeOf(myPCC["_onAdded"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCC["_onAdded"](myPCC)).toBeVoid();
    expectTypeOf(myPCC["_onAddedPrimary"]()).toBeVoid();
    expectTypeOf(myPCC["_onRemoved"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCC["_onRemovedPrimary"]()).toBeVoid();
    expectTypeOf(myPCC["_onElevationChange"]()).toBeVoid();

    expectTypeOf(myPCC.shouldRenderDepth).toBeBoolean();
    expectTypeOf(myPCC["_shouldRenderDepth"]()).toBeBoolean();
    expectTypeOf(myPCC.sortChildren()).toBeVoid();
    expectTypeOf(myPCC.updateCanvasTransform()).toBeVoid();

    expectTypeOf(myPCC.renderDepthData(renderer)).toBeVoid();
  });
});

describe("PrimaryCanvasParticleContainer tests", () => {
  const myPCPC = new PrimaryCanvasParticleContainer();
  test("Inherits from PrimaryCanvasContainer since v14.367", () => {
    expectTypeOf(myPCPC).toExtend<PrimaryCanvasContainer>();

    expectTypeOf(myPCPC.elevation).toBeNumber();
    myPCPC.elevation = 5; // Setter

    expectTypeOf(myPCPC.sort).toBeNumber();
    myPCPC.sort = 5; // Setter

    expectTypeOf(myPCPC.sortLayer).toBeNumber();
    expectTypeOf(myPCPC.inPrimary).toBeBoolean();
    expectTypeOf(myPCPC.shouldRenderDepth).toBeBoolean();
    expectTypeOf(myPCPC.renderDepthData(renderer)).toBeVoid();
  });

  test("Overrides", () => {
    expectTypeOf(myPCPC["_onAddedPrimary"]()).toBeVoid();
    expectTypeOf(myPCPC["_onRemovedPrimary"]()).toBeVoid();
    expectTypeOf(myPCPC["_onElevationChange"]()).toBeVoid();
    expectTypeOf(myPCPC["_shouldRenderDepth"]()).toBeBoolean();

    // @ts-expect-error `_shouldRenderDepth` is protected.
    myPCPC._shouldRenderDepth();
  });
});
