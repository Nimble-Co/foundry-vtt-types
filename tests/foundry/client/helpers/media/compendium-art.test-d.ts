import { expectTypeOf } from "vitest";
import CompendiumArt = foundry.helpers.media.CompendiumArt;

const caInfo = { actor: "actorId", token: { randomImg: false }, credit: "Me" };
expectTypeOf(caInfo).toExtend<CompendiumArt.Info>;

// @ts-expect-error Should reject object not matching prototype tokens schema
expectTypeOf({ token: { badKey: "1" } }).toExtend<CompendiumArt.Info>();

const compendiumArt = new foundry.helpers.media.CompendiumArt([
  ["test", caInfo],
  ["2", { token: "a/path" }],
]);
expectTypeOf(compendiumArt.FLAG).toEqualTypeOf<string>();
expectTypeOf(compendiumArt.SETTING).toEqualTypeOf<string>();
expectTypeOf(compendiumArt.enabled).toEqualTypeOf<boolean>();
expectTypeOf(compendiumArt.getPackages()).toEqualTypeOf<CompendiumArt.Descriptor[]>();
expectTypeOf(compendiumArt["_registerArt"]()).toEqualTypeOf<Promise<void>>();

// `img` replaced `actor` in v14.367; `actor` remains, deprecated
expectTypeOf({ img: "path/to/img.webp" }).toExtend<CompendiumArt.Info>();

const artSource = { _id: "aaaaaaaaaaaaaaaa", img: "" };
expectTypeOf(compendiumArt.applyArt(Actor.implementation, artSource)).toEqualTypeOf<typeof artSource>();
expectTypeOf(compendiumArt.applyArt(Item.implementation, artSource, "some.pack")).toEqualTypeOf<typeof artSource>();
expectTypeOf(compendiumArt.applyArt(Actor.implementation, artSource, null)).toEqualTypeOf<typeof artSource>();
expectTypeOf(compendiumArt.applyArt(Actor.implementation, artSource, undefined)).toEqualTypeOf<typeof artSource>();

// @ts-expect-error `applyArt` takes a Document class, not an instance
compendiumArt.applyArt(new Actor.implementation({ name: "Foo", type: "base" }), artSource);
