import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { Brand, DeepReadonly, FixedInstanceType, HandleEmptyObject, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { ShapePlaceableObject } from "./mixins/shapes.mjs";
import type { RegionShape, RegionPolygonTree } from "#client/data/region-shapes/_module.d.mts";
import type { RegionGeometry } from "#client/canvas/placeables/regions/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";
import { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Region: Region.Implementation;
    }
  }
}

/**
 * A Region is an implementation of PlaceableObject which represents a Region document
 * within a viewed Scene on the game canvas.
 * @see {@linkcode RegionDocument}
 * @see {@linkcode RegionLayer}
 */
declare class Region extends ShapePlaceableObject<RegionDocument.Implementation> {
  // fake override; super has to type as if this could be a ControlIcon, but Regions don't use one
  override controlIcon: null;

  static override embeddedName: "Region";

  static override RENDER_FLAGS: Region.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<Region.RENDER_FLAGS>;

  /**
   * The geometry of this Region.
   *
   * The value of this property must not be mutated.
   */
  get geometry(): RegionGeometry;

  override get bounds(): PIXI.Rectangle;

  override get center(): PIXI.Point;

  /** Is this Region currently visible on the Canvas? */
  override get isVisible(): boolean;

  override get isInteractable(): boolean;

  /**
   * The animation state of this Region.
   */
  get animationState(): DeepReadonly<Region.AnimationState>;

  /**
   * Is this Region currently animating?
   */
  get isAnimating(): boolean;

  /**
   * @throws "`Region#getSnappedPosition` is not supported: `RegionDocument` does not have a (x, y) position"
   */
  override getSnappedPosition(position?: never): never;

  // _pasteObject is overridden but with no type signature change (it returns shape/level update data
  // assignable to the base `PasteObjectReturn`). For type simplicity it is left off.

  protected override _draw(options: HandleEmptyObject<Region.DrawOptions>): Promise<void>;

  /**
   * Re-draw the shape controls.
   * @internal
   */
  _redrawShapeControls(): void;

  protected override _clear(): void;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _getMeasuredShapes(): BaseShapeData[];

  protected override _applyRenderFlags(flags: Region.RenderFlags): void;

  protected override _refreshVisibility(): void;

  /** Refresh the state of the Region. */
  protected override _refreshState(): void;

  /**
   * Refresh the shapes of the Region.
   */
  protected _refreshShapes(): void;

  /**
   * Refresh the geometry of the Region.
   */
  protected _refreshGeometry(): void;

  /** Refresh the border of the Region. */
  protected _refreshBorder(): void;

  /**
   * Get the grid space offsets that are covered by this Region.
   */
  protected _getCoveredGridSpaceOffsets(): foundry.grid.BaseGrid.Offset2D[];

  /**
   * Update the animation state of this Region based on the animation state.
   * @internal
   */
  _onTokenAnimationFrame(): void;

  /**
   * Called when the animation state of the Region has changed.
   */
  protected _onAnimationStateChange(): void;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  // options: not null (destructured)
  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: Region.HoverInOptions): false | void;

  // options: not null (destructured)
  protected override _onHoverOut(event: Canvas.Event.Pointer, options?: Region.HoverOutOptions): void;

  protected override _onControl(options: Region.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<Region.ReleaseOptions>): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _updateDragPreviews(event: Canvas.Event.Pointer): void;

  // _onUpdate is overridden but with no signature changes.
  // For type simplicity it is left off. This method historically has been the source of a large amount of computation from tsc.

  /**
   * The scaling factor used for Clipper paths.
   * @defaultValue `100`
   * @deprecated since v13, until v15
   * @remarks "`Region.CLIPPER_SCALING_FACTOR` has been deprecated in favor of `CONST.CLIPPER_SCALING_FACTOR`."
   */
  static readonly CLIPPER_SCALING_FACTOR: 100;

  /**
   * The three movement segment types: ENTER, MOVE, and EXIT.
   * @deprecated since v13, until v15
   * @remarks "`Region.MOVEMENT_SEGMENT_TYPES` has been deprecated in favor of `CONST.REGION_MOVEMENT_SEGMENTS`."
   */
  static readonly MOVEMENT_SEGMENT_TYPES: Region.MovementSegmentTypes;

  /**
   * The bottom elevation of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#bottom` has been deprecated in favor of `RegionDocument#elevation.bottom`."
   */
  get bottom(): number;

  /**
   * The top elevation of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#top` has been deprecated in favor of `RegionDocument#elevation.top`."
   */
  get top(): number;

  /**
   * The shapes of this Region in draw order.
   * @deprecated since v13, until v15
   * @remarks "`Region#shapes` has been deprecated. Use `RegionDocument#shapes` instead."
   */
  get shapes(): RegionShape.Any[];

  /**
   * The polygons of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#polygons` has been deprecated in favor of `RegionDocument#polygons`."
   */
  get polygons(): PIXI.Polygon[];

  /**
   * The polygon tree of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#polygons` has been deprecated in favor of `RegionDocument#polygons`." (the runtime warning is mislabeled)
   */
  get polygonTree(): RegionPolygonTree;

  /**
   * The Clipper paths of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#clipperPaths` has been deprecated in favor of `RegionDocument#clipperPaths`."
   */
  get clipperPaths(): ClipperLib.Paths;

  /**
   * The triangulation of this Region.
   * @deprecated since v13, until v15
   * @remarks "`Region#triangulation` has been deprecated in favor of `RegionDocument#triangulation`."
   */
  get triangulation(): Region.TriangulationData;

  /**
   * Split the movement into its segments.
   * @param waypoints - The waypoints of movement.
   * @param samples   - The points relative to the waypoints that are tested. Whenever one of them is inside the region, the moved object is considered to be inside the region.
   * @param options   - Additional options
   * @returns The movement split into its segments.
   * @deprecated since v13, until v15
   * @remarks "`Region#segmentizeMovement` has been deprecated in favor of `RegionDocument#segmentizeMovementPath`."
   */
  // options: not null (destructured)
  segmentizeMovement(
    waypoints: Region.MovementWaypoint[],
    samples: Canvas.Point[],
    options?: Region.SegmentizeMovementOptions,
  ): Region.MovementSegment[];

  /**
   * Test whether the given point (at the given elevation) is inside this Region.
   * @param point       - The point.
   * @param elevation   - The elevation of the point.
   * @returns Is the point (at the given elevation) inside this Region?
   * @deprecated since v13, until v15
   * @remarks "`Region#testPoint(point: Point, elevation?: number)` has been deprecated in favor of
   * `RegionDocument#testPoint(point: ElevatedPoint)`."
   */
  // elevation: not null (`?? this.document.elevation.bottom`)
  testPoint(point: Canvas.Point, elevation?: number): boolean;
}

declare namespace Region {
  /**
   * The implementation of the `Region` placeable configured through `CONFIG.Region.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode RegionDocument.Implementation}
   * which refers to the implementation for the region document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Region` placeable configured through `CONFIG.Region.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode RegionDocument.ImplementationClass}
   * which refers to the implementation for the region document.
   */
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Region>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshShapes"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshGeometry"] }` */
    refreshShapes: RenderFlag<this, "refreshShapes">;

    /** @defaultValue `{ propagate: ["refreshBorder", "refreshMeasurements"] }` */
    refreshGeometry: RenderFlag<this, "refreshGeometry">;

    /** @defaultValue `{}` */
    refreshBorder: RenderFlag<this, "refreshBorder">;

    /** @defaultValue `{}` */
    refreshMeasurements: RenderFlag<this, "refreshMeasurements">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  /**
   * The frozen animation state of a Region.
   * @remarks The runtime object is built with frozen getters in `Region##createAnimationState`; the
   * {@linkcode Region.animationState} accessor exposes it as a {@linkcode DeepReadonly}.
   */
  interface AnimationState {
    /** The shapes in their current (possibly animated) state. */
    shapes: BaseShapeData[];

    /** The current (possibly animated) elevation. */
    elevation: RegionDocument.Implementation["elevation"];

    /** The polygons of the current shape. */
    polygons: ReadonlyArray<PIXI.Polygon>;

    /**
     * The polygon tree of the current shape.
     * @remarks FIXME(P7): the animated branch produces a `PolygonTree` (`#client/data/polygon-tree.mjs`,
     * unauthored — Phase 7); the non-animated branch is {@link RegionDocument.polygonTree | `RegionDocument#polygonTree`}
     * (a {@linkcode RegionPolygonTree}). Typed as the latter until `PolygonTree` exists.
     */
    polygonTree: RegionPolygonTree;

    /** The Clipper paths of the current shape. */
    clipperPaths: ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

    /** The Clipper polygon tree of the current shape. */
    clipperPolyTree: ClipperLib.PolyTree;

    /** The triangulation of the current shape. */
    triangulation: TriangulationData;

    /** The bounds of the current shape. */
    bounds: PIXI.Rectangle;

    /** The area of the current shape. */
    area: number;

    /**
     * Test whether the given point is contained in the current shape and elevation range.
     * @param point - The point to test
     * @returns Is the point inside the animated Region?
     */
    testPoint: (point: Canvas.ElevatedPoint) => boolean;
  }

  interface TriangulationData {
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  type _HoverInOptions = NullishProps<{
    /** @defaultValue `true` */
    updateLegend: boolean;
  }>;

  interface HoverInOptions extends _HoverInOptions, PlaceableObject.HoverInOptions {}

  interface HoverOutOptions extends _HoverInOptions {}

  interface MovementWaypoint {
    /** The x-coordinates in pixels (integer) */
    x: number;

    /** The y-coordinates in pixels (integer) */
    y: number;

    /** The elevation in grid units. */
    elevation: number;
  }

  // The brand type `MOVEMENT_SEGMENT_TYPES` shares its name with the (deprecated since v13) static
  // `Region.MOVEMENT_SEGMENT_TYPES`; the type-position references below are to the brand, not the static,
  // but `@typescript-eslint/no-deprecated` conflates the declaration-merged symbol.
  /* eslint-disable @typescript-eslint/no-deprecated -- references the brand type, not the same-named deprecated static */
  interface MovementSegment {
    /** The type of this segment (see {@linkcode Region.MovementSegmentTypes}) */
    type: MOVEMENT_SEGMENT_TYPES;

    /** The waypoint that this segment starts from */
    from: MovementWaypoint;

    /** The waypoint that this segment goes to */
    to: MovementWaypoint;
  }

  type MOVEMENT_SEGMENT_TYPES = Brand<number, "Region.MOVEMENT_SEGMENT_TYPES">;

  interface MovementSegmentTypes extends Readonly<{
    /**
     * The segment crosses the boundary of the region and exits it.
     */
    EXIT: -1 & MOVEMENT_SEGMENT_TYPES;

    /**
     * The segment does not cross the boundary of the region and is contained within it.
     */
    MOVE: 0 & MOVEMENT_SEGMENT_TYPES;

    /**
     * The segment crosses the boundary of the region and enters it.
     */
    ENTER: 1 & MOVEMENT_SEGMENT_TYPES;
  }> {}
  /* eslint-enable @typescript-eslint/no-deprecated */

  /** @internal */
  type _SegmentizeMovementOptions = NullishProps<{
    /**
     * Is it teleportation?
     * @defaultValue `false`
     * @remarks Can't be `null` because it only has a parameter default
     */
    teleport: boolean;
  }>;

  interface SegmentizeMovementOptions extends _SegmentizeMovementOptions {}
}

export default Region;
