import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { AnyObject, FixedInstanceType, HandleEmptyObject } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { ShapePlaceableObject } from "./mixins/shapes.mjs";
import type { PrimarySpriteMesh } from "#client/canvas/primary/_module.d.mts";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Tile: Tile.Implementation;
    }
  }
}

/**
 * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
 * Tiles are drawn inside the {@linkcode TilesLayer} container.
 *
 * @see {@linkcode TileDocument}
 * @see {@linkcode TilesLayer}
 */
declare class Tile extends ShapePlaceableObject<TileDocument.Implementation> {
  static override embeddedName: "Tile";

  static override RENDER_FLAGS: Tile.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<Tile.RENDER_FLAGS>;

  // fake override; super has to type as if this could be a ControlIcon, but Tiles don't use one
  override controlIcon: null;

  /**
   * The Tile border frame
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  frame: PIXI.Container | undefined;

  /**
   * The shape controls.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  controls: ShapeControls.Any;

  /**
   * The primary tile image texture
   * @defaultValue `null`
   * @remarks `null` if no valid `texture.src` exists on this Tile's document (or the original Tile's, if this is a preview clone)
   */
  texture: PIXI.Texture | null;

  /**
   * A Tile background which is displayed if no valid image texture is present
   * @defaultValue `null`
   */
  bg: PIXI.Sprite | null;

  /**
   * A reference to the SpriteMesh which displays this Tile in the PrimaryCanvasGroup.
   * @defaultValue `null`
   * @remarks `null` if no valid `texture.src` exists on this Tile's document (or the original Tile's, if this is a preview clone)
   */
  mesh: PrimarySpriteMesh | null;

  /**
   * Get the native aspect ratio of the base texture for the Tile sprite
   */
  get aspectRatio(): number;

  /**
   * The HTML source element for the primary Tile texture
   * @privateRemarks Foundry types this as `HTMLImageElement | HTMLVideoElement`, but this just
   * returns `this.texture?.baseTexture.resource.source`, which could be any of `PIXI.ImageSource`,
   * and returns `ImageBitmap`, not `HTMLImageElement`, for static images.
   */
  get sourceElement(): PIXI.ImageSource | undefined;

  /**
   * Does this Tile depict an animated video texture?
   */
  get isVideo(): boolean;

  /**
   * Is this tile occluded?
   */
  get occluded(): boolean;

  /**
   * Is the tile video playing?
   */
  get playing(): boolean;

  /**
   * The effective volume at which this Tile should be playing, including the global ambient volume modifier
   */
  get volume(): number;

  protected override _draw(options: HandleEmptyObject<Tile.DrawOptions>): Promise<void>;

  protected override _clear(): void;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _applyRenderFlags(flags: Tile.RenderFlags): void;

  /**
   * Refresh the position.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the rotation.
   */
  protected _refreshRotation(): void;

  /**
   * Refresh the size.
   */
  protected _refreshSize(): void;

  protected override _refreshVisibility(): void;

  /**
   * Refresh the displayed state of the Tile.
   * Updated when the tile interaction state changes, when it is hidden, or when its elevation changes.
   */
  protected override _refreshState(): void;

  /**
   * Refresh the appearance of the tile.
   */
  protected _refreshMesh(): void;

  /**
   * Refresh the elevation.
   */
  protected _refreshElevation(): void;

  /**
   * Refresh changes to the video playback state.
   */
  protected _refreshVideo(): void;

  // _onUpdate is overridden but with no signature changes.
  // For type simplicity it is left off. This method historically has been the source of a large amount of computation from tsc.

  /**
   * @remarks Returns `true` if any of `x`, `y`, `rotation`, `width`, or `height` is in `changed`, or if either
   * `anchorX` or `anchorY` is in `changed.texture`.
   */
  protected override _hasShapeChanged(changed: AnyObject): boolean;

  /**
   * Create a preview tile with a background texture instead of an image
   * @param data - Initial data with which to create the preview Tile
   * @deprecated since v14, until v16
   * @remarks "Tile.createPreview has been deprecated without replacement."
   */
  static createPreview(data: TileDocument.CreateData): Tile.Implementation;
}

declare namespace Tile {
  /**
   * The implementation of the `Tile` placeable configured through `CONFIG.Tile.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode TileDocument.Implementation}
   * which refers to the implementation for the Tile document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Tile` placeable configured through `CONFIG.Tile.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode TileDocument.ImplementationClass}
   * which refers to the implementation for the Tile document.
   */
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Tile>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshElevation", "refreshVideo"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility", "refreshPerception"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
    refreshTransform: RenderFlag<this, "refreshTransform">;

    /** @defaultValue `{ propagate: ["refreshPerception"] }` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{ propagate: ["refreshPerception"] }` */
    refreshRotation: RenderFlag<this, "refreshRotation">;

    /** @defaultValue `{ propagate: ["refreshPerception"] }` */
    refreshSize: RenderFlag<this, "refreshSize">;

    /** @defaultValue `{}` */
    refreshMesh: RenderFlag<this, "refreshMesh">;

    /** @defaultValue `{ propagate: ["refreshPerception"] }` */
    refreshElevation: RenderFlag<this, "refreshElevation">;

    /** @defaultValue `{}` */
    refreshPerception: RenderFlag<this, "refreshPerception">;

    /** @defaultValue `{}` */
    refreshVideo: RenderFlag<this, "refreshVideo">;

    /**
     * @defaultValue `{ deprecated: { since: 14, until: 16 }, alias: true }`
     * @deprecated since v14, until v16
     */
    refreshFrame: RenderFlag<this, "refreshFrame">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}
}

export default Tile;
