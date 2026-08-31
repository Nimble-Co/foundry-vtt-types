import type { AnyObject, Identity } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import Canvas = foundry.canvas.Canvas;
import type Drawing from "../drawing.mjs";
import type { DrawingsLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * Controls for a Drawing shape.
 */
// @privateRemarks The v14 source parameterizes `ShapeControls`'s `ShapeClass` with the specific shape data
// (`RectangleShapeData | EllipseShapeData | PolygonShapeData`), but it is omitted here (defaulting to
// `BaseShapeData`, matching `RegionShapeControls`): declaring that client-shape `ShapeClass` argument
// tripped a `tsc` internal assertion during type-aware ESLint (a spurious crash in an unrelated
// `DialogV2.input` overload). `tsgo`, `tsc`, and the type tests are unaffected.
declare class DrawingShapeControls extends ShapeControls<
  DrawingDocument.Implementation,
  Drawing.Implementation,
  DrawingsLayer
> {
  protected override _drawShape(graphics: PIXI.Graphics): void;

  /**
   * @remarks Extends the base implementation. If the dragged handle is `"translate"`, it also creates a drag preview
   * for each other controlled Drawing and stores them in `event.interactionData.others`.
   */
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _onDragMove(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AnyObject;

  /**
   * @remarks Extends the base implementation. If `event.interactionData.others` is not empty, it updates each
   * controlled Drawing in one operation instead of calling the base implementation.
   */
  protected override _onDragDrop(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;

  #DrawingShapeControls: true;
}

declare namespace DrawingShapeControls {
  interface Any extends AnyDrawingShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyDrawingShapeControls> {}
}

declare abstract class AnyDrawingShapeControls extends DrawingShapeControls {
  constructor(...args: never);
}

export default DrawingShapeControls;
