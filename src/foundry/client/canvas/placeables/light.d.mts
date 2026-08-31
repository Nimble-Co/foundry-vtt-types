import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type {
  AnyObject,
  FixedInstanceType,
  HandleEmptyObject,
  IntentionalPartial,
  NullishProps,
  RequiredProps,
} from "#utils";
import type { PointLightSource, PointDarknessSource } from "#client/canvas/sources/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { ShapePlaceableObject } from "./mixins/shapes.mjs";
import type { PreciseText, ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";
import { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.mjs";

import Canvas = foundry.canvas.Canvas;

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      AmbientLight: AmbientLight.Implementation;
    }
  }
}

/**
 * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
 * @see {@linkcode AmbientLightDocument}
 * @see {@linkcode LightingLayer}
 */
declare class AmbientLight extends ShapePlaceableObject<AmbientLightDocument.Implementation> {
  /**
   * The area that is affected by this light.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  field: PIXI.Graphics | undefined;

  /**
   * A reference to the PointSource object which defines this light or darkness area of effect.
   * This is undefined if the AmbientLight does not provide an active source of light.
   * @remarks This is not initialized to a value, but {@link AmbientLight._onCreate | `AmbientLight#_onCreate`}
   * calls {@link AmbientLight.initializeLightSource | `AmbientLight#initializeLightSource`}, so it could be set immediately.
   *
   * Set `undefined` in {@link AmbientLight._destroy | `AmbientLight#_destroy`}.
   */
  lightSource: PointLightSource.Implementation | PointDarknessSource.Implementation | undefined;

  /**
   * The shape controls.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  controls: ShapeControls.Any;

  /**
   * The tooltip text of this AmbientLight, which contains its elevation.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  tooltip: PreciseText;

  static override embeddedName: "AmbientLight";

  static override RENDER_FLAGS: AmbientLight.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<AmbientLight.RENDER_FLAGS>;

  override get sourceId(): string;

  /**
   * A convenience accessor to the LightData configuration object
   */
  get config(): foundry.data.LightData;

  /**
   * Test whether a specific AmbientLight source provides global illumination
   */
  get global(): boolean;

  /**
   * The maximum radius in pixels of the light field
   */
  get radius(): number;

  /**
   * Get the pixel radius of dim light emitted by this light source
   */
  get dimRadius(): number;

  /**
   * Get the pixel radius of bright light emitted by this light source
   */
  get brightRadius(): number;

  /**
   * Check if the point source is a LightSource instance
   * @remarks Checks via `instanceof` against the configured class, not simply PointLightSource
   */
  get isLightSource(): boolean;

  /**
   * Check if the point source is a DarknessSource instance
   * @remarks Checks via `instanceof` against the configured class, not simply PointDarknessSource
   */
  get isDarknessSource(): boolean;

  /**
   * Is the source of this Ambient Light disabled?
   */
  protected _isLightSourceDisabled(): boolean;

  /**
   * Does this Ambient Light actively emit darkness light given its properties and the current darkness level of the Scene?
   */
  get emitsDarkness(): boolean;

  /**
   * Does this Ambient Light actively emit positive light given its properties and the current darkness level of the Scene?
   */
  get emitsLight(): boolean;

  override get isInteractable(): boolean;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _draw(options: HandleEmptyObject<AmbientLight.DrawOptions>): Promise<void>;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _applyRenderFlags(flags: AmbientLight.RenderFlags): void;

  /**
   * Refresh the position of the AmbientLight.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the rotation of the AmbientLight.
   */
  protected _refreshRotation(): void;

  /**
   * Refresh the size of the AmbientLight.
   */
  protected _refreshSize(): void;

  /**
   * Refresh the shape of the light field-of-effect. This is refreshed when the AmbientLight fov polygon changes.
   */
  protected _refreshField(): void;

  /**
   * Refresh the tooltip.
   */
  protected _refreshTooltip(): void;

  /**
   * Return the text which should be displayed in the tooltip.
   */
  protected _getTooltipText(): string;

  /**
   * Get the text style that should be used for the tooltip.
   */
  protected _getTextStyle(): PIXI.TextStyle;

  protected override _getMeasuredShapes(): BaseShapeData[];

  protected override _refreshState(): void;

  /**
   * Update the LightSource associated with this AmbientLight object.
   * @param options - Options which modify how the source is updated
   */
  initializeLightSource(options?: AmbientLight.InitializeLightSourceOptions): void;

  /**
   * Get the light source data.
   */
  protected _getLightSourceData(): AmbientLight.LightSourceData;

  // _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * @remarks Returns `true` if any of `x`, `y`, or `rotation` is in `changed`, or if any of `dim`, `bright`, or
   * `angle` is in `changed.config`.
   */
  protected override _hasShapeChanged(changed: AnyObject): boolean;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onControl(options: AmbientLight.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<AmbientLight.ReleaseOptions>): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreviews(event: Canvas.Event.Pointer): void;
}

declare namespace AmbientLight {
  /**
   * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientLightDocument.Implementation}
   * which refers to the implementation for the AmbientLight document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientLightDocument.ImplementationClass}
   * which refers to the implementation for the AmbientLight document.
   */
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof AmbientLight>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshField", "refreshTooltip"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
    refreshTransform: RenderFlag<this, "refreshTransform">;

    /** @defaultValue `{ propagate: ["refreshMeasurements"] }` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{ propagate: ["refreshMeasurements"] }` */
    refreshRotation: RenderFlag<this, "refreshRotation">;

    /** @defaultValue `{ propagate: ["refreshMeasurements"] }` */
    refreshSize: RenderFlag<this, "refreshSize">;

    /** @defaultValue `{}` */
    refreshField: RenderFlag<this, "refreshField">;

    /** @defaultValue `{}` */
    refreshTooltip: RenderFlag<this, "refreshTooltip">;

    /** @defaultValue `{}` */
    refreshMeasurements: RenderFlag<this, "refreshMeasurements">;

    /**
     * @defaultValue `{ propagate: ["refreshTooltip"], deprecated: { since: 14, until: 16 }, alias: true }`
     * @deprecated since v14, until v16
     */
    refreshElevation: RenderFlag<this, "refreshElevation">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /**
   * @internal
   */
  type _InitializeLightSourceOptions = NullishProps<{
    /**
     * Indicate that this light source has been deleted.
     * @defaultValue `false`
     */
    deleted: boolean;
  }>;

  interface InitializeLightSourceOptions extends _InitializeLightSourceOptions {}

  /**
   * @remarks {@link AmbientLight._getLightSourceData | `AmbientLight#_getLightSourceData`} calls `mergeObject` on the return of
   * {@link foundry.data.LightData.toObject | `LightData#toObject(false)`} and the enumerated properties below and
   * returns the result. This gets passed to {@link foundry.canvas.sources.PointLightSource.initialize | `AmbientLight#lightSource#initialize()`},
   * so this is a `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
   */
  type LightSourceData = foundry.data.fields.SchemaField.InitializedData<foundry.data.LightData.Schema> &
    RequiredProps<
      IntentionalPartial<PointLightSource.SourceData>,
      | "x"
      | "y"
      | "level"
      | "elevation"
      | "rotation"
      | "walls"
      | "vision"
      | "dim"
      | "bright"
      | "seed"
      | "disabled"
      | "preview"
    >;
}

export default AmbientLight;
