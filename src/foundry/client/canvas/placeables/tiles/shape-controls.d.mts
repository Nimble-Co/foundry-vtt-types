import type { AnyObject, Identity } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import Canvas = foundry.canvas.Canvas;
import type Tile from "../tile.mjs";
import type { TilesLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * Controls for a Tile shape.
 */
// @privateRemarks The v14 source parameterizes `ShapeControls`'s `ShapeClass` with the specific shape data
// (`RectangleShapeData`), but it is omitted here (defaulting to
// `BaseShapeData`, matching `RegionShapeControls`): declaring that client-shape `ShapeClass` argument
// tripped a `tsc` internal assertion during type-aware ESLint (a spurious crash in an unrelated
// `DialogV2.input` overload). `tsgo`, `tsc`, and the type tests are unaffected.
declare class TileShapeControls extends ShapeControls<TileDocument.Implementation, Tile.Implementation, TilesLayer> {
  /**
   * @remarks Extends the base implementation. If the dragged handle is `"translate"`, it also creates a drag preview
   * for each other controlled Tile and stores them in `event.interactionData.others`.
   */
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AnyObject;

  /**
   * @remarks Extends the base implementation. If `event.interactionData.others` is not empty, it updates each
   * controlled Tile in one operation instead of calling the base implementation.
   */
  protected override _onDragDrop(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;

  #TileShapeControls: true;
}

declare namespace TileShapeControls {
  interface Any extends AnyTileShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyTileShapeControls> {}
}

declare abstract class AnyTileShapeControls extends TileShapeControls {
  constructor(...args: never);
}

export default TileShapeControls;
