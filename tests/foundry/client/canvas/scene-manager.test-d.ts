import { expectTypeOf } from "vitest";
import SceneManager = foundry.canvas.SceneManager;

declare const someScene: Scene.Implementation;
const mySM = new SceneManager(someScene);

expectTypeOf(mySM.scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(mySM["_determineInitialLevel"]()).toEqualTypeOf<string | void>();
expectTypeOf(
  mySM["_getAvailableLevels"](new Set<Level.Implementation>()),
).toEqualTypeOf<Set<Level.Implementation> | void>();
expectTypeOf(mySM["_onInit"]()).toEqualTypeOf<Promise<void>>();

declare const someLevel: Level.Implementation;
expectTypeOf(mySM["_loadTextures"]({}, [], someLevel)).toBeVoid();
expectTypeOf(mySM["_loadTextures"]({ foo: "path/to/texture.webp" }, ["path/to/other.webp"], someLevel)).toBeVoid();

// @ts-expect-error `_loadTextures` is protected.
mySM._loadTextures({}, [], someLevel);
expectTypeOf(mySM["_onDraw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onReady"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onTearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_registerHooks"]()).toBeVoid();
expectTypeOf(mySM["_deactivateHooks"]()).toBeVoid();

expectTypeOf(mySM.registerHook("foo", () => "foo!")).toBeVoid();
expectTypeOf(mySM.registerHook("foo", (pt: number) => pt * 2)).toBeVoid();
expectTypeOf(mySM.registerHook("foo", (name: string) => name.length > 4)).toBeVoid();
