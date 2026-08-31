import type { AnyObject, FixedInstanceType, HandleEmptyObject, Mixin } from "#utils";
import type { ShapeControlsHandle } from "#client/canvas/containers/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class ShapeObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The measurement lines.
   */
  protected _measurementLines: PIXI.Graphics;

  /**
   * The measurement labels.
   */
  protected _measurementLabels: PIXI.Container;

  /**
   * The solid measurement line style.
   */
  protected _measurementSolidLineStyle: PIXI.ILineStyleOptions;

  /**
   * The dashed measurement line style.
   */
  protected _measurementDashLineStyle: PIXI.ILineStyleOptions;

  /** The controls handle that is currently hovered, if any. */
  get hoveredHandle(): ShapeControlsHandle | null;

  /**
   * @defaultValue `null`
   * @internal
   */
  _hoveredHandle: ShapeControlsHandle | null;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.placeables.PlaceableObject.bounds | PlaceableObject#bounds}.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.placeables.PlaceableObject.center | PlaceableObject#center}.
   */
  get center(): PIXI.Point;

  protected _getTargetAlpha(): number;

  protected _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected _onClickLeft(event: Canvas.Event.Pointer): void;

  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected _canDragLeftStart(
    user: User.Implementation,
    event?: Canvas.Event.Pointer,
    options?: PlaceableObject.CanDragLeftStartOptions,
  ): boolean;

  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag previews. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreviews(event: Canvas.Event.Pointer): void;

  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Initialize the shape for dragging.
   * @param event - The pointer event
   * @returns The shape that is dragged
   */
  protected _initializeDragShape(event: Canvas.Event.Pointer): BaseShapeData;

  /**
   * @remarks Actually an override of
   * {@linkcode foundry.canvas.placeables.PlaceableObject._prepareDragLeftDropUpdates | PlaceableObject#_prepareDragLeftDropUpdates}.
   * The runtime returns shape/position update objects keyed by `_id`; the base union type is used because of the
   * documented unsound subclassing around this method.
   */
  protected _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.AnyDragLeftDropUpdate[];

  protected _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  protected _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void>;

  /**
   * Define a PIXI TextStyle object which is used for the measurement labels.
   */
  protected _getMeasurementTextStyle(): PIXI.TextStyle;

  /**
   * Get the shape that should be measured.
   */
  protected _getMeasuredShapes(): BaseShapeData[];

  /**
   * Format a distance that is displayed in a measurement label.
   * @param distance - The distance
   * @returns The distance label
   */
  protected _formatMeasuredDistance(distance: number): string;

  /**
   * Refresh the measurements.
   */
  protected _refreshMeasurements(): void;

  /**
   * Has the shape or a shape changed?
   * @param changed - The changes of the update operation
   * @returns True if the shape or a shape has changed
   * @remarks Foundry marks this `@internal`
   * @throws If the document schema has neither a `shapes` nor a `shape` field. Each concrete shape placeable must
   * implement this method.
   */
  protected _hasShapeChanged(changed: AnyObject): boolean;

  #ShapeObject: true;
}

/**
 * The instance shape produced by `ShapeObjectMixin(PlaceableObject)`, modeled as a concrete abstract
 * subclass of {@linkcode PlaceableObject} that the shape leaf placeables (`Drawing`, `AmbientLight`,
 * `AmbientSound`, `Tile`, `Region`) extend directly.
 *
 * @privateRemarks fvtt-types cannot model these placeables as `extends ShapeObjectMixin(PlaceableObject)`
 * (the source form) because a mixin **call** in an `extends` clause forces tsgo to evaluate the base
 * eagerly while the subclass module is still loading; that eager evaluation transitively resolves
 * `Canvas` → the `foundry.canvas` namespace → the canvas barrel's `export * as placeables` → the
 * placeables barrel, which re-exports the very subclass being declared, yielding a circular import
 * alias (`TS2506`/`TS2303`). Extending this intermediate `declare class` is a lazy heritage reference
 * (like every other placeable's `extends PlaceableObject<Doc>`) and so avoids the cycle. The members
 * mirror {@linkcode ShapeObject} above (the literal mixin instance, kept for source fidelity and used
 * by {@linkcode ShapeObjectMixin.AnyMixed}); `override` markers reflect that they override
 * {@linkcode PlaceableObject}.
 */
declare abstract class ShapePlaceableObject<
  CanvasDocument extends PlaceableObject.AnyCanvasDocument = PlaceableObject.AnyCanvasDocument,
> extends PlaceableObject<CanvasDocument> {
  /**
   * The measurement lines.
   */
  protected _measurementLines: PIXI.Graphics;

  /**
   * The measurement labels.
   */
  protected _measurementLabels: PIXI.Container;

  /**
   * The solid measurement line style.
   */
  protected _measurementSolidLineStyle: PIXI.ILineStyleOptions;

  /**
   * The dashed measurement line style.
   */
  protected _measurementDashLineStyle: PIXI.ILineStyleOptions;

  /** The controls handle that is currently hovered, if any. */
  get hoveredHandle(): ShapeControlsHandle | null;

  /**
   * @defaultValue `null`
   * @internal
   */
  _hoveredHandle: ShapeControlsHandle | null;

  override get bounds(): PIXI.Rectangle;

  override get center(): PIXI.Point;

  protected override _getTargetAlpha(): number;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(
    user: User.Implementation,
    event?: Canvas.Event.Pointer,
    options?: PlaceableObject.CanDragLeftStartOptions,
  ): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag previews. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreviews(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Initialize the shape for dragging.
   * @param event - The pointer event
   * @returns The shape that is dragged
   */
  protected _initializeDragShape(event: Canvas.Event.Pointer): BaseShapeData;

  /**
   * @remarks The runtime returns shape/position update objects keyed by `_id`; the base union type is
   * used because of the documented unsound subclassing around this method.
   */
  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.AnyDragLeftDropUpdate[];

  protected override _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  protected override _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void>;

  /**
   * Define a PIXI TextStyle object which is used for the measurement labels.
   */
  protected _getMeasurementTextStyle(): PIXI.TextStyle;

  /**
   * Get the shape that should be measured.
   */
  protected _getMeasuredShapes(): BaseShapeData[];

  /**
   * Format a distance that is displayed in a measurement label.
   * @param distance - The distance
   * @returns The distance label
   */
  protected _formatMeasuredDistance(distance: number): string;

  /**
   * Refresh the measurements.
   */
  protected _refreshMeasurements(): void;

  /**
   * Has the shape or a shape changed?
   * @param changed - The changes of the update operation
   * @returns True if the shape or a shape has changed
   * @remarks Foundry marks this `@internal`
   * @throws If the document schema has neither a `shapes` nor a `shape` field. Each concrete shape placeable must
   * implement this method.
   */
  protected _hasShapeChanged(changed: AnyObject): boolean;
}

/**
 * A mixin for UX shared between PlaceableObjects that have shapes.
 *
 * @privateRemarks Kept for source fidelity (`export default function ShapeObjectMixin`). It cannot be
 * used as a base in an `extends` clause without tripping a tsgo circular-alias bug — see
 * {@linkcode ShapePlaceableObject}, which the shape placeables extend instead.
 */
declare function ShapeObjectMixin<BaseClass extends ShapeObjectMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof ShapeObject, BaseClass>;

declare namespace ShapeObjectMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ShapeObjectMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PlaceableObject.AnyConstructor;
}

export default ShapeObjectMixin;
export { ShapePlaceableObject };
