import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type { PrimaryCanvasGroup } from "#client/canvas/groups/_module.d.mts";
import type CanvasTransformMixin from "./canvas-transform-mixin.d.mts";

/**
 * Primary canvas container are reserved for advanced usage.
 * They allow to group PrimarySpriteMesh in a single Container.
 * The container elevation is replacing individual sprite elevation.
 * @remarks The constructor sets {@linkcode PIXI.Container.sortableChildren | sortableChildren} to `true` and attaches
 * the `added` and `removed` listeners that call {@linkcode PrimaryCanvasContainer._onAdded | _onAdded} and
 * {@linkcode PrimaryCanvasContainer._onRemoved | _onRemoved}.
 */
declare class PrimaryCanvasContainer extends CanvasTransformMixin(PIXI.Container) {
  /**
   * The elevation of this container.
   * @defaultValue `0`
   * @remarks The setter throws if passed a non-numeric value.
   *
   * If the parent is another {@linkcode PrimaryCanvasContainer}, the assignment is ignored unless the new value is
   * equal to the elevation of that parent. A container propagates its own elevation to each child instead.
   */
  get elevation(): number;

  set elevation(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   * @defaultValue `0`
   * @remarks The setter throws if passed a non-numeric value.
   */
  get sort(): number;

  set sort(value);

  /**
   * A key which resolves ties amongst objects at the same elevation of different layers.
   * @defaultValue `0`
   * @remarks The setter throws if passed a non-numeric value.
   */
  get sortLayer(): number;

  set sortLayer(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer and same sort.
   * @remarks The setter throws if passed a non-numeric value.
   */
  override get zIndex(): number;

  override set zIndex(value);

  /**
   * Is this container in the primary group?
   * @remarks Returns {@linkcode PrimaryCanvasContainer._inPrimary | _inPrimary}
   */
  get inPrimary(): boolean;

  /**
   * @defaultValue `false`
   */
  protected _inPrimary: boolean;

  /**
   * To know if this container has at least one children that should render its depth.
   * @remarks Updated in {@linkcode PrimaryCanvasContainer.updateCanvasTransform | updateCanvasTransform} from
   * {@linkcode PrimaryCanvasContainer._shouldRenderDepth | _shouldRenderDepth}.
   */
  get shouldRenderDepth(): boolean;

  /**
   * Event fired when this container is added to a parent.
   * @param parent - The new parent container.
   * @remarks Foundry types this as taking a {@linkcode PIXI.Container} but then is more specific internally
   * @throws Unless `parent` is either `=== canvas.primary` or another {@linkcode PrimaryCanvasContainer}
   */
  protected _onAdded(parent: PrimaryCanvasContainer.Parent): void;

  /**
   * Called when the container is now in the primary group.
   */
  protected _onAddedPrimary(): void;

  /**
   * Event fired when this container is removed from its parent.
   * @param parent - Parent from which the container is removed.
   */
  protected _onRemoved(parent: PrimaryCanvasContainer.Parent): void;

  /**
   * Called when the container is no longer in the primary group.
   */
  protected _onRemovedPrimary(): void;

  /**
   * Called when the elevation was changed.
   */
  protected _onElevationChange(): void;

  /**
   * Does this object render to the depth buffer?
   */
  protected _shouldRenderDepth(): boolean;

  /**
   * Render the depth of this object.
   */
  renderDepthData(renderer: PIXI.Renderer): void;

  override updateCanvasTransform(): void;

  override sortChildren(): void;

  #PrimaryCanvasContainer: true;
}

declare namespace PrimaryCanvasContainer {
  interface Any extends AnyPrimaryCanvasContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasContainer> {}

  /**
   * @remarks {@linkcode PrimaryCanvasContainer._onAdded | PrimaryCanvasContainer#_onAdded} throws unless it is passed
   * either another {@linkcode PrimaryCanvasContainer} or whatever {@linkcode canvas.primary} currently is, which
   * presumably will be a {@linkcode PrimaryCanvasGroup}
   */
  type Parent = PrimaryCanvasGroup.Implementation | PrimaryCanvasContainer.Any;
}

export default PrimaryCanvasContainer;

declare abstract class AnyPrimaryCanvasContainer extends PrimaryCanvasContainer {
  constructor(...args: never);
}
