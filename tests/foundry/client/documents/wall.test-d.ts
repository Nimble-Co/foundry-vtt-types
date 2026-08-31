import { expectTypeOf } from "vitest";

declare module "fvtt-types/configuration" {
  interface FlagConfig {
    WallDocument: {
      foobar?: boolean;
    };
  }
}

declare const scene: Scene.Implementation;

// @ts-expect-error requires 'c'
new WallDocument.implementation();

// @ts-expect-error requires 'c'
new WallDocument.implementation({});

new WallDocument.implementation({ c: [0, 0, 0, 0] });
new WallDocument.implementation({ c: [0, 0, 0, 0] }, { parent: scene });

declare const myWall: WallDocument.Stored;

expectTypeOf(myWall.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();

expectTypeOf(myWall.edge).toEqualTypeOf<foundry.canvas.geometry.edges.Edge | null>();
expectTypeOf(myWall.darkness).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(myWall.isDoor).toEqualTypeOf<boolean>();
expectTypeOf(myWall.isOpen).toEqualTypeOf<boolean>();
expectTypeOf(myWall.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(myWall.getWallCategory()).toEqualTypeOf<WallDocument.WallCategory>();
expectTypeOf(myWall.initializeEdge()).toEqualTypeOf<void>();
expectTypeOf(myWall.initializeEdge({ deleted: true })).toEqualTypeOf<void>();

// v14.365 removed the `priorLevels` and `changedTypes` options from `initializeEdge`.
// @ts-expect-error `priorLevels` is not an option of `initializeEdge` since v14.365
myWall.initializeEdge({ deleted: true, priorLevels: ["a", "b"] });
// @ts-expect-error `changedTypes` is not an option of `initializeEdge` since v14.365
myWall.initializeEdge({ deleted: true, changedTypes: new Set(["light", "darkness"]) });

await WallDocument.create(
  {
    c: [0, 0, 0, 0],
    flags: { core: { sheetClass: "foobar" } },
  },
  { parent: scene },
);
