import type Sound from "#client/audio/sound.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type {
  AnyObject,
  FixedInstanceType,
  HandleEmptyObject,
  InexactPartial,
  IntentionalPartial,
  NullishProps,
  RequiredProps,
} from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { ShapePlaceableObject } from "./mixins/shapes.mjs";
import type { PreciseText, ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";
import { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.mjs";

import Canvas = foundry.canvas.Canvas;

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      AmbientSound: AmbientSound.Implementation;
    }
  }
}

/**
 * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
 * @see {@linkcode AmbientSoundDocument}
 * @see {@linkcode SoundsLayer}
 */
declare class AmbientSound extends ShapePlaceableObject<AmbientSoundDocument.Implementation> {
  /**
   * The Sound which manages playback for this AmbientSound effect
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to {@link AmbientSound.sync | `AmbientSound#sync`}
   * or {@link AmbientSound._onUpdate | `AmbientSound#_onUpdate`} being called (the
   * former likely via {@link SoundsLayer._syncPositions | `SoundsLayer#_syncPositions`})
   *
   * Set `null` if this sound's document has either no `path` or no `id` (e.g if its a preview, for the latter)
   */
  sound: Sound | null | undefined;

  /**
   * A SoundSource object which manages the area of effect for this ambient sound
   * @remarks Not initialized to a value in the class body, but {@link AmbientSound._onCreate | `AmbientSound#_onCreate`}
   * calls {@linkcode AmbientSound.initializeSoundSource}.
   *
   * Set `undefined` by {@link AmbientSound._destroy | `AmbientSound#_destroy`}.
   */
  source: foundry.canvas.sources.PointSoundSource.Implementation | undefined;

  /**
   * The area that is affected by this ambient sound.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  field: PIXI.Graphics | undefined;

  /**
   * The shape controls.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  controls: ShapeControls.Any;

  /**
   * The tooltip text of this AmbientSound, which contains its elevation.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  tooltip: PreciseText;

  static override embeddedName: "AmbientSound";

  static override RENDER_FLAGS: AmbientSound.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<AmbientSound.RENDER_FLAGS>;

  /**
   * Create a Sound used to play this AmbientSound object
   */
  protected _createSound(): Sound | null;

  /**
   * Update the set of effects which are applied to the managed Sound.
   */
  // options: not null (destructured)
  applyEffects(options?: AmbientSound.ApplyEffectsOptions): void;

  override get isInteractable(): boolean;

  /**
   * Is this ambient sound is currently audible based on its hidden state and the darkness level of the Scene?
   */
  get isAudible(): boolean;

  /**
   * A convenience accessor for the sound radius in pixels
   */
  get radius(): number;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  /**
   * Toggle playback of the sound depending on whether or not it is audible
   * @param isAudible - Is the sound audible?
   * @param volume    - The target playback volume
   * @param options   - Additional options which affect sound synchronization
   * @returns A promise which resolves once sound playback is synchronized
   */
  // options: not null (destructured)
  sync(isAudible: boolean, volume: number, options?: AmbientSound.SyncOptions): Promise<void>;

  protected override _clear(): void;

  protected override _draw(options: HandleEmptyObject<AmbientSound.DrawOptions>): Promise<void>;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _applyRenderFlags(flags: AmbientSound.RenderFlags): void;

  /**
   * Refresh the shape of the sound field-of-effect. This is refreshed when the SoundSource fov polygon changes.
   */
  protected _refreshField(): void;

  /**
   * Refresh the position of the AmbientSound. Called with the coordinates change.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the size of the AmbientSound.
   */
  protected _refreshSize(): void;

  protected override _refreshState(): void;

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

  /**
   * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
   * @param options - Options which modify how the audio source is updated
   */
  // options: not null (destructured)
  initializeSoundSource(options?: AmbientSound.InitializeSoundSourceOptions): void;

  /**
   * Get the sound source data.
   */
  protected _getSoundSourceData(): AmbientSound.SoundSourceData;

  // _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * @remarks Returns `true` if any of `x`, `y`, or `radius` is in `changed`.
   */
  protected override _hasShapeChanged(changed: AnyObject): boolean;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /** @remarks Always returns `false` ("Double-right does nothing") */
  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onControl(options: AmbientSound.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<AmbientSound.ReleaseOptions>): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreviews(event: Canvas.Event.Pointer): void;
}

declare namespace AmbientSound {
  /**
   * The implementation of the `AmbientSound` placeable configured through `CONFIG.AmbientSound.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientSoundDocument.Implementation}
   * which refers to the implementation for the ambientSound document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `AmbientSound` placeable configured through `CONFIG.AmbientSound.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientSoundDocument.ImplementationClass}
   * which refers to the implementation for the ambientSound document.
   */
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof AmbientSound>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshField", "refreshTooltip"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshSize"], alias: true }` */
    refreshTransform: RenderFlag<this, "refreshTransform">;

    /** @defaultValue `{ propagate: ["refreshMeasurements"] }` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

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

  /** @internal */
  type _ApplyEffectsOptions = NullishProps<{
    /**
     * Is the sound currently muffled?
     * @defaultValue `false`
     */
    muffled: boolean;
  }>;

  interface ApplyEffectsOptions extends _ApplyEffectsOptions {}

  /** @internal */
  type _SyncOptions = InexactPartial<{
    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `250`
     * @remarks Can't be `null` as it only has a parameter default
     */
    fade: number;
  }>;

  interface SyncOptions extends _SyncOptions, _ApplyEffectsOptions {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /**
   * @internal
   */
  type _InitializeSoundSourceOptions = NullishProps<{
    /**
     * Indicate that this SoundSource has been deleted.
     * @defaultValue `false`
     */
    deleted: boolean;
  }>;

  interface InitializeSoundSourceOptions extends _InitializeSoundSourceOptions {}

  /**
   * @remarks The return of {@link AmbientSound._getSoundSourceData | `AmbientSound#_getSoundSourceData`}, which gets passed
   * to {@link foundry.canvas.sources.PointSoundSource.initialize | `AmbientSound#source#initialize()`}, so this is a
   * `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
   */
  type SoundSourceData = RequiredProps<
    IntentionalPartial<foundry.canvas.sources.PointSoundSource.SourceData>,
    "x" | "y" | "level" | "elevation" | "radius" | "walls" | "disabled"
  >;
}

export default AmbientSound;
