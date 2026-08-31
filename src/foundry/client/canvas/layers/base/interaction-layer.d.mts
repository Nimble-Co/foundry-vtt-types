import type { Identity, NullishProps } from "#utils";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type { CanvasLayer } from "../_module.d.mts";

import Canvas = foundry.canvas.Canvas;

/**
 * A subclass of CanvasLayer which provides support for user interaction with its contained objects.
 */
declare abstract class InteractionLayer extends CanvasLayer {
  /**
   * The shared palette tool.
   * @remarks Since v14 this is a getter. It returns a new object each time, and the `active` property of that object
   * is computed from `ui.controls?.paletteOpen`.
   * @privateRemarks `Partial` mirrors the `@type {Partial<SceneControlTool>}` of the Foundry source.
   */
  static get TOGGLE_PALETTE(): Partial<SceneControls.Tool>;

  /**
   * Is this layer currently active
   */
  get active(): boolean;

  /**
   * @privateRemarks Override not in foundry docs but implicit from layerOptions
   */
  override options: InteractionLayer.LayerOptions;

  /**
   * @defaultValue `"passive"`
   * @remarks Set to `"static"` when this layer is `#activate()`d, returned to `"passive"` when `#deactivate()`d
   */
  override eventMode: PIXI.EventMode;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   * @defaultValue
   * ```js
   * {
   *   baseClass: InteractionLayer,
   *   zIndex: 0,
   * }
   * ```
   */
  static get layerOptions(): InteractionLayer.LayerOptions;

  /**
   * Activate the InteractionLayer, deactivating other layers and marking this layer's children as interactive.
   * @param options - Options which configure layer activation
   * @returns The layer instance, now activated
   */
  activate(options?: InteractionLayer.ActivateOptions): this;

  /**
   * The inner _activate method which may be defined by each InteractionLayer subclass.
   */
  protected _activate(): void;

  /**
   * Deactivate the InteractionLayer, removing interactivity from its children.
   * @returns The layer instance, now inactive
   */
  deactivate(): this;

  /**
   * The inner _deactivate method which may be defined by each InteractionLayer subclass.
   */
  protected _deactivate(): void;

  /**
   * Prepare data used by SceneControls to register tools used by this layer.
   */
  static prepareSceneControls(): SceneControls.Control | null;

  /**
   * Highlight the objects of this layer.
   * @param active - Should the objects of this layer be highlighted?
   */
  protected _highlightObjects(active: boolean): void;

  /**
   * Callback actions which occur on a single left-click event to assume control of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Handle double left-click events which originate from the Canvas stage.
   * @see {@linkcode Canvas.#onClickLeft2}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onClickLeft2(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Does the User have permission to left-click drag on the Canvas?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @privateRemarks In practice this will always be passed a `User.Stored`, but no core implementation in any subclass even looks at `user`,
   * and user-provided layer classes would likely only use permission/role checks that also work on temporary docs, so `Implementation`s
   * are allowed.
   */
  protected _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  /**
   * Start a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftStart}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  /**
   * Continue a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftMove}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Conclude a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftDrop}
   * @param vent - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  /**
   * Cancel a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftDrop}
   * @param event - A right-click pointer event on the document.
   */
  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle right mouse-click events which originate from the Canvas stage.
   * @see {@linkcode Canvas._onClickRight}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Handle double right mouse-click events which originate from the Canvas stage.
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onClickRight2(event: Canvas.Event.Pointer): void;

  /**
   * Handle mouse-wheel events which occur for this active layer.
   * @param event - The WheelEvent initiated on the document
   */
  protected _onMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Handle a Cycle View keypress while this layer is active.
   * @param event - The cycle-view key press event
   * @returns Was the event handled?
   */
  protected _onCycleViewKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Delete keypress while this layer is active.
   * @param event - The delete key press event
   * @returns Was the event handled?
   */
  protected _onDeleteKey(event: Canvas.Event.DeleteKey): boolean;

  /**
   * Handle a Select All keypress while this layer is active.
   * @param event - The select-all key press event
   * @returns Was the event handled?
   */
  protected _onSelectAllKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Dismiss keypress while this layer is active.
   * @param event - The dismiss key press event
   * @returns Was the event handled?
   */
  protected _onDismissKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Undo keypress while this layer is active.
   * @param event - The undo key press event
   * @returns Was the event handled?
   */
  protected _onUndoKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Cut keypress while this layer is active.
   * @param event - The cut key press event
   * @returns Was the event handled?
   */
  protected _onCutKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Copy keypress while this layer is active.
   * @param event - The copy key press event
   * @returns Was the event handled?
   */
  protected _onCopyKey(event: KeyboardEvent): boolean;

  /**
   * Handle a Paste keypress while this layer is active.
   * @param event - The paste key press event
   * @returns Was the event handled?
   */
  protected _onPasteKey(event: KeyboardEvent): boolean;
}

declare namespace InteractionLayer {
  interface Any extends AnyInteractionLayer {}
  interface AnyConstructor extends Identity<typeof AnyInteractionLayer> {}

  interface LayerOptions extends CanvasLayer.LayerOptions {
    zIndex: number;

    baseClass: typeof InteractionLayer;
  }

  /** @internal */
  type _ActivateOptions = NullishProps<{
    /** A specific tool in the control palette to set as active */
    tool: string;
  }>;

  interface ActivateOptions extends _ActivateOptions {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
}

export default InteractionLayer;

declare abstract class AnyInteractionLayer extends InteractionLayer {
  constructor(...args: never);
}
