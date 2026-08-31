import { expectTypeOf } from "vitest";

import TextureLoader = foundry.canvas.TextureLoader;

const { srcExists, getTexture, loadTexture } = foundry.canvas;

// eslint-disable-next-line @typescript-eslint/no-deprecated -- `srcExists` is `@deprecated since v14`; still exercised for surface coverage.
expectTypeOf(srcExists("path/to/texture")).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(getTexture("path/to/texture")).toEqualTypeOf<PIXI.Texture | PIXI.Spritesheet | null>();

expectTypeOf(loadTexture("path/to/texture")).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", {})).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", { fallback: "path/to/another/texture" })).toEqualTypeOf<
  Promise<PIXI.Texture | PIXI.Spritesheet | null>
>();

declare const someScene: Scene.Implementation;
declare const someTex: PIXI.Texture;

expectTypeOf(TextureLoader.loadSceneTextures(someScene, { expireCache: false, maxConcurrent: 4 })).toEqualTypeOf<
  Promise<void>
>();

declare const someLevel: Level.Implementation;

// Since v14.367 a Level is accepted in place of a Scene.
expectTypeOf(TextureLoader.loadSceneTextures(someLevel)).toEqualTypeOf<Promise<void>>();

// @ts-expect-error `loadSceneTextures` takes a Scene or a Level, not an ID.
TextureLoader.loadSceneTextures("XXXXXSomeIDXXXXX");
expectTypeOf(TextureLoader.getTextureAlphaData(someTex, 0.8)).toEqualTypeOf<TextureLoader.TextureAlphaData | void>();
// eslint-disable-next-line @typescript-eslint/no-deprecated -- `fetchResource` is `@deprecated since v14`; still exercised for surface coverage.
expectTypeOf(TextureLoader.fetchResource("some/url.jpg", { bustCache: true })).toEqualTypeOf<Promise<Blob>>();
expectTypeOf(TextureLoader.loader).toEqualTypeOf<TextureLoader>();

const myLoader = new TextureLoader();

expectTypeOf(
  myLoader.load(["some/url.jpg", "some/other.webp"], {
    displayProgress: true,
    expireCache: false,
    maxConcurrent: 4,
    message: "sdfasgdsgsg",
  }),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(myLoader.loadTexture("some/url.jpg")).toEqualTypeOf<Promise<PIXI.BaseTexture | PIXI.Spritesheet | null>>();
