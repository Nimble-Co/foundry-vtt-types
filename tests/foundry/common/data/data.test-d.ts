import { expectTypeOf, test } from "vitest";
import DataModel = foundry.abstract.DataModel;
import type { ValueOf } from "fvtt-types/utils";

const myLight = new foundry.data.LightData();

expectTypeOf(myLight.negative).toBeBoolean();
expectTypeOf(myLight.priority).toBeNumber();
expectTypeOf(myLight.alpha).toBeNumber();
expectTypeOf(myLight.angle).toBeNumber();
expectTypeOf(myLight.bright).toBeNumber();
expectTypeOf(myLight.color).toEqualTypeOf<Color | null>();
expectTypeOf(myLight.coloration).toEqualTypeOf<number | null>();
expectTypeOf(myLight.dim).toBeNumber();
expectTypeOf(myLight.attenuation).toBeNumber();
expectTypeOf(myLight.luminosity).toBeNumber();
expectTypeOf(myLight.saturation).toBeNumber();
expectTypeOf(myLight.contrast).toBeNumber();
expectTypeOf(myLight.shadows).toBeNumber();
expectTypeOf(myLight.animation.intensity).toBeNumber();
expectTypeOf(myLight.animation.reverse).toBeBoolean();
expectTypeOf(myLight.animation.speed).toBeNumber();
expectTypeOf(myLight.animation.type).toEqualTypeOf<string | null>();
expectTypeOf(myLight.darkness.min).toBeNumber();
expectTypeOf(myLight.darkness.max).toBeNumber();

/******************************************************************/

const myShape = new foundry.data.ShapeData();

expectTypeOf(myShape.type).toEqualTypeOf<"c" | "r" | "e" | "p">();
expectTypeOf(myShape.width).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myShape.height).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myShape.radius).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myShape.points).toEqualTypeOf<Array<number | undefined>>();

/******************************************************************/

// v14 BaseShapeData subclasses. `type` is intentionally not asserted: the per-shape branded `type`
// literal collapses to `never` across the union (see the branded-choice note in docs/agents/bugs.md).

declare const rectangle: foundry.data.RectangleShapeData;
expectTypeOf(rectangle.hole).toEqualTypeOf<boolean>();
expectTypeOf(rectangle.anchorX).toBeNumber();
expectTypeOf(rectangle.gridBased).toEqualTypeOf<boolean>();

declare const circle: foundry.data.CircleShapeData;
expectTypeOf(circle.radius).toBeNumber();
expectTypeOf(circle.gridBased).toEqualTypeOf<boolean>();

declare const emanation: foundry.data.EmanationShapeData;
expectTypeOf(emanation.radius).toBeNumber();
expectTypeOf(emanation.gridBased).toEqualTypeOf<boolean>();

declare const cone: foundry.data.ConeShapeData;
expectTypeOf(cone.radius).toBeNumber();
expectTypeOf(cone.curvature).toEqualTypeOf<"round" | "flat" | "semicircle">();
expectTypeOf(cone.gridBased).toEqualTypeOf<boolean>();

declare const ring: foundry.data.RingShapeData;
expectTypeOf(ring.innerWidth).toBeNumber();
expectTypeOf(ring.outerWidth).toBeNumber();

declare const line: foundry.data.LineShapeData;
expectTypeOf(line.length).toBeNumber();
expectTypeOf(line.width).toBeNumber();

declare const polygon: foundry.data.PolygonShapeData;
expectTypeOf(polygon.points).toEqualTypeOf<number[]>();
expectTypeOf(polygon.origin).toEqualTypeOf<{ x: number; y: number } | null>();

declare const token: foundry.data.TokenShapeData;
expectTypeOf(token.shape).toEqualTypeOf<ValueOf<typeof CONST.TOKEN_SHAPES>>();

declare const grid: foundry.data.GridShapeData;
expectTypeOf(grid.offsets).toEqualTypeOf<{ i: number; j: number }[]>();
expectTypeOf(grid.origin).toEqualTypeOf<{ x: number; y: number } | null>();

/******************************************************************/

type TextureDataTestSchema = DataModel.SchemaOfClass<typeof TextureDataTestModel>;

class TextureDataTestModel extends DataModel<TextureDataTestSchema> {
  static override defineSchema() {
    return {
      textureData: new foundry.data.TextureData(
        {},
        { categories: ["IMAGE", "AUDIO"], initial: { src: "path/to/thing.png" } },
      ),
    };
  }
}
const testModel = new TextureDataTestModel();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.src).toEqualTypeOf<string | null>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.anchorX).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.anchorY).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.offsetX).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.offsetY).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.fit).toEqualTypeOf<ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES>>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.scaleX).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.scaleY).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.rotation).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.tint).toEqualTypeOf<Color>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.alphaThreshold).toEqualTypeOf<number>();

/******************************************************************/

expectTypeOf(foundry.data.PrototypeToken.database).toEqualTypeOf<CONFIG["DatabaseBackend"]>();

const myProtoToken = new foundry.data.PrototypeToken();

// only the fields specific to the prototype token are tested here, the rest of the
// schema is tested in `tests/foundry/common/documents/token.test-d.ts`
expectTypeOf(myProtoToken.name).toEqualTypeOf<string>();
expectTypeOf(myProtoToken.randomImg).toBeBoolean();

expectTypeOf(myProtoToken.actor).toEqualTypeOf<foundry.documents.BaseActor>();
expectTypeOf(myProtoToken.toObject().actorId).toEqualTypeOf<string | undefined>();
expectTypeOf(myProtoToken.getBarAttribute("foo")).toEqualTypeOf<
  TokenDocument.SingleAttributeBar | TokenDocument.ObjectAttributeBar | null
>();
expectTypeOf(myProtoToken.getBarAttribute("foo")?.attribute).toEqualTypeOf<string | undefined>();

/******************************************************************/

expectTypeOf(foundry.data.PrototypeTokenOverrides.SETTING).toEqualTypeOf<"prototypeTokenOverrides">();
expectTypeOf(foundry.data.PrototypeTokenOverrides.overrides).toEqualTypeOf<foundry.data.PrototypeTokenOverrides>();
expectTypeOf(foundry.data.PrototypeTokenOverrides.applyOverrides({}, "character")).toBeVoid();
expectTypeOf(foundry.data.PrototypeTokenOverrides.applyAll()).toBeVoid();

declare const myPrototypeTokenOverrides: foundry.data.PrototypeTokenOverrides;
// The schema has one entry per Actor subtype; `base` is always present.
expectTypeOf(myPrototypeTokenOverrides.base.lockRotation).toEqualTypeOf<boolean | undefined>();

/******************************************************************/

const myTombstone = new foundry.data.TombstoneData();

expectTypeOf(myTombstone._id).toEqualTypeOf<string | null>();
expectTypeOf(myTombstone._tombstone).toEqualTypeOf<boolean>();

// `TextureData.Schema` is generated based upon some options and so is important to test.
// This could be fleshed out a fair bit.
test("Test TextureData.Schema", () => {
  expectTypeOf<foundry.data.TextureData.Schema["src"]>().toEqualTypeOf<
    foundry.data.fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      // Note(LukeAbby): The `initial` here in particular was broken for a while due to a usage of `EmptyObject`.
      initial: null;
      wildcard: false;
      label: "";
    }>
  >();
});
