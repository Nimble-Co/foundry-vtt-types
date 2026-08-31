import { test, expectTypeOf } from "vitest";

import Token = foundry.canvas.placeables.Token;
import Region = foundry.canvas.placeables.Region;
import TokenRing = foundry.canvas.placeables.tokens.TokenRing;
import Canvas = foundry.canvas.Canvas;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import PreciseText = foundry.canvas.containers.PreciseText;
import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;
import TextureTransitionFilter = foundry.canvas.rendering.filters.TextureTransitionFilter;

declare const scene: Scene.Stored;

expectTypeOf(Token.embeddedName).toEqualTypeOf<"Token">();
expectTypeOf(Token.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "redrawEffects"
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshRotation"
      | "refreshSize"
      | "refreshElevation"
      | "refreshMesh"
      | "refreshShader"
      | "refreshShape"
      | "refreshBorder"
      | "refreshBars"
      | "refreshEffects"
      | "refreshNameplate"
      | "refreshTarget"
      | "refreshTooltip"
      | "refreshRingVisuals"
      | "refreshRuler"
      | "refreshTurnMarker"
    >
  | undefined
>();

declare const doc: TokenDocument.Stored;
const token = new CONFIG.Token.objectClass(doc);

expectTypeOf(token.controlIcon).toBeNull();
expectTypeOf(token.shape).toEqualTypeOf<PIXI.Rectangle | PIXI.Polygon | undefined>();
expectTypeOf(token.detectionFilter).toEqualTypeOf<PIXI.Filter | null>();
expectTypeOf(token.border).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(token.effects).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(token.bars).toEqualTypeOf<Token.Bars | undefined>();
expectTypeOf(token.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(token.levelIndicator).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(token.targetArrows).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(token.targetPips).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(token.nameplate).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(token.ruler).toEqualTypeOf<foundry.canvas.placeables.tokens.BaseTokenRuler | null | undefined>();
expectTypeOf(token["_plannedMovement"]).toEqualTypeOf<Record<string, Token.PlannedMovement>>();
expectTypeOf(token.targeted).toEqualTypeOf<Set<User.Stored>>();
expectTypeOf(token.mesh).toEqualTypeOf<PrimarySpriteMesh | undefined>();

expectTypeOf(token.voidMesh).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(token.detectionFilterMesh).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(token.texture).toEqualTypeOf<PIXI.Texture | undefined>();
expectTypeOf(token.vision).toEqualTypeOf<foundry.canvas.sources.PointVisionSource.Implementation | undefined>();
expectTypeOf(token._visionSourceVersion).toBeNumber();
expectTypeOf(token.light).toEqualTypeOf<
  | foundry.canvas.sources.PointLightSource.Implementation
  | foundry.canvas.sources.PointDarknessSource.Implementation
  | undefined
>();
expectTypeOf(token.turnMarker).toEqualTypeOf<foundry.canvas.placeables.tokens.TokenTurnMarker | null>();

expectTypeOf(token.animationContexts).toEqualTypeOf<Map<string, Token.AnimationContext>>();
expectTypeOf(token.animationName).toBeString();
expectTypeOf(token.movementAnimationName).toBeString();
expectTypeOf(token.movementAnimationPromise).toEqualTypeOf<Promise<void> | null>();
expectTypeOf(token.showRuler).toBeBoolean();
expectTypeOf(token._preventKeyboardMovement).toBeBoolean();
expectTypeOf(token.ring).toEqualTypeOf<TokenRing.Implementation | null | undefined>();
expectTypeOf(token.hasDynamicRing).toBeBoolean();
// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(token.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(token.observer).toBeBoolean();
expectTypeOf(token.name).toBeString();
expectTypeOf(token.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(token.w).toBeNumber();
expectTypeOf(token.h).toBeNumber();
expectTypeOf(token.center).toEqualTypeOf<PIXI.Point>();

expectTypeOf(token.sourceId).toBeString();
expectTypeOf(token.sourceElement).toEqualTypeOf<PIXI.ImageSource | undefined>();
expectTypeOf(token.isVideo).toBeBoolean();
expectTypeOf(token.inCombat).toBeBoolean();
// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(token.combatant).toEqualTypeOf<Combatant.Stored>();
expectTypeOf(token.isTargeted).toBeBoolean();
expectTypeOf(token.isDragged).toBeBoolean();
expectTypeOf(token.detectionModes).toEqualTypeOf<Record<string, { enabled: boolean; range: number | null }>>();
expectTypeOf(token.isVisible).toBeBoolean();

// v14.367: `#testCulled` became `_testCulled`.
expectTypeOf(token["_testCulled"]()).toBeBoolean();

// @ts-expect-error `_testCulled` is protected.
token._testCulled();

expectTypeOf(token.isInteractable).toBeBoolean();
expectTypeOf(token.hasSight).toBeBoolean();
expectTypeOf(token["_isLightSource"]()).toBeBoolean();
expectTypeOf(token.emitsLight).toBeBoolean();
expectTypeOf(token.emitsDarkness).toBeBoolean();
expectTypeOf(token.hasLimitedSourceAngle).toBeBoolean();
expectTypeOf(token.dimRadius).toBeNumber();
expectTypeOf(token.brightRadius).toBeNumber();
expectTypeOf(token.radius).toBeNumber();
expectTypeOf(token.lightPerceptionRange).toBeNumber();
expectTypeOf(token.sightRange).toBeNumber();
expectTypeOf(token.optimalSightRange).toBeNumber();

expectTypeOf(token.initializeSources()).toBeVoid();
expectTypeOf(token.initializeSources({})).toBeVoid();
expectTypeOf(token.initializeSources({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeSources({ deleted: null })).toBeVoid();

expectTypeOf(token.initializeLightSource()).toBeVoid();
expectTypeOf(token.initializeLightSource({})).toBeVoid();
expectTypeOf(token.initializeLightSource({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeLightSource({ deleted: null })).toBeVoid();
expectTypeOf(token["_getLightSourceData"]()).toEqualTypeOf<Token.LightSourceData>();

expectTypeOf(token.initializeVisionSource()).toBeVoid();
expectTypeOf(token.initializeVisionSource({})).toBeVoid();
expectTypeOf(token.initializeVisionSource({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeVisionSource({ deleted: null })).toBeVoid();
expectTypeOf(token["_getVisionBlindedStates"]()).toEqualTypeOf<Token.BlindedStates>();
expectTypeOf(token["_getVisionSourceData"]()).toEqualTypeOf<Token.VisionSourceData>();
expectTypeOf(token["_isVisionSource"]()).toBeBoolean();
expectTypeOf(token["_isFogExplorationSource"]()).toBeBoolean();
expectTypeOf(
  token["_createSharedFogVisionSource"](),
).toEqualTypeOf<foundry.canvas.sources.PointVisionSource.Implementation>();
expectTypeOf(token["_renderDetectionFilter"](new PIXI.Renderer())).toBeVoid();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(token.clear()).toEqualTypeOf<Token.Implementation>();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(token["_destroy"]()).toBeVoid();
expectTypeOf(token["_destroy"]({})).toBeVoid();
expectTypeOf(token["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(token["_destroy"](true)).toBeVoid();
expectTypeOf(token["_destroy"](undefined)).toBeVoid();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(token["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(token["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(token["_initializeRuler"]()).toEqualTypeOf<foundry.canvas.placeables.tokens.BaseTokenRuler | null>();

// @ts-expect-error an object must be passed
expectTypeOf(token["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(token["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(token["_applyRenderFlags"]({ refreshElevation: false, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  token["_applyRenderFlags"]({
    redraw: true,
    redrawEffects: true,
    refresh: true,
    refreshState: true,
    refreshVisibility: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshRotation: true,
    refreshSize: true,
    refreshElevation: true,
    refreshMesh: true,
    refreshShader: true,
    refreshShape: true,
    refreshBorder: true,
    refreshBars: true,
    refreshEffects: true,
    refreshNameplate: true,
    refreshTarget: true,
    refreshTooltip: true,
    refreshRingVisuals: true,
    refreshRuler: true,
    refreshTurnMarker: true,
  }),
).toBeVoid();

expectTypeOf(token["_refreshRingVisuals"]()).toBeVoid();
expectTypeOf(token["_refreshVisibility"]()).toBeVoid();
expectTypeOf(token["_refreshState"]()).toBeVoid();
expectTypeOf(token["_refreshSize"]()).toBeVoid();
expectTypeOf(token["_refreshShape"]()).toBeVoid();
expectTypeOf(token["_refreshRotation"]()).toBeVoid();
expectTypeOf(token["_refreshPosition"]()).toBeVoid();
expectTypeOf(token["_refreshElevation"]()).toBeVoid();
expectTypeOf(token["_refreshTooltip"]()).toBeVoid();
expectTypeOf(token["_refreshNameplate"]()).toBeVoid();
expectTypeOf(token["_refreshMesh"]()).toBeVoid();
expectTypeOf(token["_refreshShader"]()).toBeVoid();
expectTypeOf(token["_refreshBorder"]()).toBeVoid();
expectTypeOf(token["_getBarColors"](0, doc.getBarAttribute("foo")!)).toEqualTypeOf<Token.BarColors>();

expectTypeOf(token["_getBorderColor"]()).toBeNumber();

expectTypeOf(token["_refreshTarget"]()).toBeVoid();

expectTypeOf(token["_drawTargetArrows"]()).toBeVoid();
expectTypeOf(token["_drawTargetArrows"]({})).toBeVoid();
expectTypeOf(
  token["_drawTargetArrows"]({
    alpha: 0.5,
    border: {
      color: Color.from("#787878"),
      width: 4,
    },
    color: Color.from("#987654"),
    margin: 2,
    size: 0.23,
  }),
).toBeVoid();
expectTypeOf(
  token["_drawTargetArrows"]({
    alpha: undefined,
    border: { color: undefined, width: undefined },
    color: null,
    margin: null,
    size: undefined,
  }),
).toBeVoid();
expectTypeOf(token["_drawTargetArrows"]({ border: undefined })).toBeVoid();

expectTypeOf(token["_drawTargetPips"]()).toBeVoid();

expectTypeOf(token.drawBars()).toBeVoid();
expectTypeOf(token["_drawBar"](1, token.bars!.bar1, doc.getBarAttribute("foo")!)).toBeBoolean();
expectTypeOf(token["_getTooltipText"]()).toBeString();
expectTypeOf(token["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();

expectTypeOf(token.drawEffects()).toEqualTypeOf<Promise<Token.Implementation>>();
expectTypeOf(token["_drawEffects"]()).toEqualTypeOf<Promise<void>>();

expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg")).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", Color.from("#149856"))).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", 0)).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", null)).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();

expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg")).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", Color.from("#149856"))).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", 0)).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", null)).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();

expectTypeOf(token["_refreshEffects"]()).toBeVoid();
expectTypeOf(token["_refreshTurnMarker"]()).toBeVoid();
expectTypeOf(token["_refreshRuler"]()).toBeVoid();
expectTypeOf(token["_canViewMode"](CONST.TOKEN_DISPLAY_MODES.OWNER)).toBeBoolean();

expectTypeOf(token.getRingColors()).toEqualTypeOf<Token.RingColors>();
expectTypeOf(token.getRingEffects()).toEqualTypeOf<TokenRing.EFFECTS[]>();
expectTypeOf(token["_getAnimationData"]()).toEqualTypeOf<Token.AnimationData>();

const fullAnimationData = {
  rotation: 90,
  alpha: 0.7,
  height: 2,
  width: 2,
  x: 90,
  y: 70,
  texture: {
    anchorX: 0.2,
    anchorY: -0.1,
    scaleX: 1.35,
    scaleY: 2.7,
    src: "path/to/tex.webp",
    tint: Color.from([0.2, 0.5, 0.872]),
  },
  ring: {
    subject: {
      scale: 2.4,
      texture: "path/to/other.png",
    },
  },
};
expectTypeOf(token.animate({ rotation: 90, alpha: 0.7 })).toEqualTypeOf<Promise<void>>();
expectTypeOf(token.animate({ rotation: 90, alpha: 0.7 }, {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  token.animate(fullAnimationData, {
    duration: 5000,
    easing: "easeInCircle",
    movementSpeed: 10,
    name: token.animationName,
    transition: TextureTransitionFilter.TYPES.GLITCH,
    ontick: (dt: number, data: CanvasAnimation.AnimationData) => console.warn(dt, data),
  }),
).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  token.animate(
    { rotation: 90, alpha: 0.7 },
    {
      duration: undefined,
      easing: undefined,
      movementSpeed: undefined,
      name: undefined,
      ontick: undefined,
      transition: null,
    },
  ),
).toEqualTypeOf<Promise<void>>();

const fromForDuration = { x: 50, y: 60, rotation: 0 };
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500 })).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500, y: 700, rotation: 180 })).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500, rotation: 180 }, {})).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { rotation: 180 }, { movementSpeed: 10 })).toBeNumber();
expectTypeOf(
  token["_getAnimationDuration"](fromForDuration, { y: 700, rotation: 180 }, { movementSpeed: undefined }),
).toBeNumber();

const someAnimationContext = {
  duration: 750,
  name: "foo",
  onAnimate: [],
  postAnimate: [],
  preAnimate: [],
  time: 437,
  to: { x: 500 },
};
expectTypeOf(token["_onAnimationUpdate"]({}, someAnimationContext)).toBeVoid();
expectTypeOf(token["_onAnimationUpdate"]({ texture: { scaleX: 5 }, rotation: 84 }, someAnimationContext)).toBeVoid();
expectTypeOf(token["_onAnimationUpdate"](fullAnimationData, someAnimationContext)).toBeVoid();

expectTypeOf(token.stopAnimation()).toBeVoid();
expectTypeOf(token.stopAnimation({})).toBeVoid();
expectTypeOf(token.stopAnimation({ reset: true })).toBeVoid();
expectTypeOf(token.stopAnimation({ reset: null })).toBeVoid();

// only rotation required for `from`, `changes` is allowed to, but never would actually, be empty, no options required
expectTypeOf(token["_prepareAnimation"]({ rotation: 175 }, { rotation: 260 }, someAnimationContext)).toEqualTypeOf<
  CanvasAnimation.Attribute[]
>();
// `from`/`changes` are otherwise both PartialAnimationData
expectTypeOf(
  token["_prepareAnimation"](
    { rotation: 175, height: 3, alpha: 0.2 },
    { rotation: 190, height: 2, alpha: 0.1 },
    someAnimationContext,
  ),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, {})).toEqualTypeOf<
  CanvasAnimation.Attribute[]
>();
// only the one option, nullable
expectTypeOf(
  token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, {
    transition: TextureTransitionFilter.TYPES.CROSSHATCH,
  }),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(
  token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, { transition: null }),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();

const p = { x: 40, y: 800 };
expectTypeOf(token.checkCollision(p)).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(token.checkCollision(p, {})).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: "light",
    origin: { x: 9000, y: 4 },
  }),
).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: undefined,
    origin: null,
    mode: undefined,
  }),
).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "any",
  }),
).toEqualTypeOf<boolean>(); // actual return for '"any"'
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "all",
  }),
).toEqualTypeOf<foundry.canvas.geometry.edges.PolygonVertex[]>(); // actual return for `"all"`
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "closest",
  }),
).toEqualTypeOf<foundry.canvas.geometry.edges.PolygonVertex | null>(); // actual return for `"closest"

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(token.getSize()).toEqualTypeOf<{ width: number; height: number }>();
expectTypeOf(token.getShape()).toEqualTypeOf<PIXI.Rectangle | PIXI.Polygon>();

expectTypeOf(token.getCenterPoint()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint({ x: 5, y: 7 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint(doc)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint(null)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(token.getSnappedPosition()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition({ x: 5, y: 7 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition(doc)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition(null)).toEqualTypeOf<Canvas.Point>();

declare const someRegion: Region.Implementation;
/* eslint-disable @typescript-eslint/no-deprecated -- `testInsideRegion`/`segmentizeRegionMovement` are deprecated since v13 */
expectTypeOf(token.testInsideRegion(someRegion)).toBeBoolean();
// @ts-expect-error If `position` is non-nullish, it must contain `{x, y}` data
expectTypeOf(token.testInsideRegion(someRegion), {}).toBeBoolean();
// @ts-expect-error If `position` is non-nullish, it must contain `{x, y}` data
expectTypeOf(token.testInsideRegion(someRegion), { elevation: 70 }).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, p)).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, { x: 40, y: 20, elevation: -60 })).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, null)).toBeBoolean();

const waypoints = [
  { x: 50, y: 50, elevation: 0 },
  { x: 70, y: 90, elevation: 60 },
];
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints)).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, {})).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, { teleport: true })).toEqualTypeOf<
  Region.MovementSegment[]
>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, { teleport: null })).toEqualTypeOf<
  Region.MovementSegment[]
>();
/* eslint-enable @typescript-eslint/no-deprecated */

declare const someUser: User.Stored;
expectTypeOf(token.setTarget()).toBeVoid();
expectTypeOf(token.setTarget(true)).toBeVoid();
expectTypeOf(token.setTarget(false, {})).toBeVoid();
expectTypeOf(token.setTarget(true, { user: someUser, groupSelection: true, releaseOthers: false })).toBeVoid();
expectTypeOf(token.setTarget(false, { user: null, groupSelection: null, releaseOthers: null })).toBeVoid();

expectTypeOf(token.externalRadius).toBeNumber();
expectTypeOf(token.getLightRadius(5)).toBeNumber();
expectTypeOf(token["_getShiftedPosition"](1, -1, 0)).toEqualTypeOf<Canvas.ElevatedPoint>();

expectTypeOf(token["_updateRotation"]()).toBeNumber();
expectTypeOf(token["_updateRotation"]({})).toBeNumber();
// you would never actually pass `delta` if you're passing `angle` as it would get ignored
expectTypeOf(token["_updateRotation"]({ angle: 90, delta: 20, snap: 4 })).toBeNumber();
expectTypeOf(token["_updateRotation"]({ angle: null, delta: undefined, snap: undefined })).toBeNumber();

expectTypeOf(token["_onApplyStatusEffect"]("flying", true)).toBeVoid();
expectTypeOf(token["_configureFilterEffect"]("invisible", false)).toBeVoid();
expectTypeOf(token["_updateSpecialStatusFilterEffects"]()).toBeVoid();
expectTypeOf(token["_removeAllFilterEffects"]()).toBeVoid();

// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(
  token["_onCreate"](
    doc.toObject(),
    { action: "create", parent: scene, modifiedTime: 7, render: true, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  token["_onUpdate"](
    // partial source data
    {
      elevation: 30,
      displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
      texture: { src: "path/to/new.jpg" },

      flags: { core: { sheetLock: true } },
    },
    { action: "update", parent: scene, modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  token["_onDelete"]({ action: "delete", parent: scene, modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(token["_onControl"]()).toBeVoid();
expectTypeOf(token["_onControl"]({})).toBeVoid();
expectTypeOf(token["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(token["_onRelease"]()).toBeVoid();
expectTypeOf(token["_onRelease"]({})).toBeVoid();

expectTypeOf(token["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(token["_canControl"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(token["_canHUD"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(token["_canConfigure"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(token["_canHover"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(token["_canView"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(token["_canDrag"](someUser, pointerEvent)).toBeBoolean();

expectTypeOf(token["_onHoverIn"](pointerEvent)).toBeVoid();
expectTypeOf(token["_onHoverIn"](pointerEvent, {})).toBeVoid();
expectTypeOf(token["_onHoverIn"](pointerEvent, { hoverOutOthers: true })).toBeVoid();
expectTypeOf(token["_onHoverIn"](pointerEvent, { hoverOutOthers: null })).toBeVoid();

expectTypeOf(token["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(token["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(token["_propagateLeftClick"](pointerEvent)).toBeBoolean();
expectTypeOf(token["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(token["_onClickRight2"](pointerEvent)).toBeVoid();
expectTypeOf(token["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(token["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<Token.DragLeftDropUpdate[]>();
expectTypeOf(token["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(token["_onDragEnd"]()).toBeVoid();

// deprecated since v13, until v15 — split into targetArrows/targetPips
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(token.target).toEqualTypeOf<PIXI.Graphics | undefined>();

// deprecated since v14, until v16
/* eslint-disable @typescript-eslint/no-deprecated */
expectTypeOf(token.getMovementAdjustedPoint({ x: 20, y: 30 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getMovementAdjustedPoint({ x: 20, y: 30 }, {})).toEqualTypeOf<Canvas.Point>();
expectTypeOf(
  token.getMovementAdjustedPoint({ x: 20, y: 30 }, { offsetX: 50, offsetY: 50 }),
).toEqualTypeOf<Canvas.Point>();
expectTypeOf(
  token.getMovementAdjustedPoint({ x: 20, y: 30 }, { offsetX: null, offsetY: null }),
).toEqualTypeOf<Canvas.Point>();
/* eslint-enable @typescript-eslint/no-deprecated */

// Reported by emily3k on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1375296418478030930
test("Ensure that PIXI.Texture.from can accept PIXI.Resource", () => {
  PIXI.Texture.from(token.mesh!.texture!.baseTexture.resource);
});

// v14.367: new protected hook for movement wall collision configuration.
declare const movementSegment: Omit<TokenDocument.MovementSegmentData, "teleport">;
expectTypeOf(
  token["_getMovementCollisionTestConfiguration"](movementSegment, { preview: true }),
).toEqualTypeOf<foundry.canvas.geometry.PointSourcePolygon.Config>();

// @ts-expect-error `options.preview` is always defined at the call site.
token["_getMovementCollisionTestConfiguration"](movementSegment, {});
