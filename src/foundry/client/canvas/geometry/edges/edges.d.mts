import type { Identity, InexactPartial, ToMethod } from "#utils";
import type Edge from "./edge.d.mts";

/**
 * A specialized Map class that manages all edges used to restrict perception in a Scene.
 * Integrates with a Quadtree for efficient spatial queries.
 */
declare class CanvasEdges extends Map<string, Edge> {
  /**
   * @param level - The Level these edges belong to
   * @remarks Throws unless `level` is a `Level` instance.
   */
  constructor(level: Level.Implementation);

  /**
   * The Level these edges belong to.
   */
  get level(): Level.Implementation;

  override set(id: string, edge: Edge): this;

  override delete(id: string): boolean;

  override clear(): this;

  /**
   * Retrieves edges that overlap with a given rectangle.
   * Utilizes the Quadtree for efficient spatial querying.
   * This function computes edge intersections if necessary.
   * @param rect    - The rectangle to query against.
   * @param options - Options which configure how edges are retrieved
   * @returns A set of {@linkcode Edge} instances that intersect with the provided rectangle.
   */
  getEdges(rect: PIXI.Rectangle, options?: CanvasEdges.GetEdgesOptions): Set<Edge>;

  /**
   * Identify all edge intersections.
   * @remarks Does nothing if the edges are not dirty.
   */
  identifyIntersections(): void;

  /**
   * @deprecated "`CanvasEdges#inititalize` has been deprecated. Use `Scene#initializeEdges` instead." (since v14, until v16)
   * @remarks The method was named `inititalize` until v14.367. The typo remains in the deprecation message only.
   */
  initialize(): void;

  /**
   * @deprecated "`CanvasEdges#refresh` has been deprecated. `CanvasEdges#getEdges` computes edge intersections automatically if necessary." (since v14, until v16)
   */
  refresh(): void;

  #CanvasEdges: true;
}

declare namespace CanvasEdges {
  interface Any extends AnyCanvasEdges {}
  interface AnyConstructor extends Identity<typeof AnyCanvasEdges> {}

  /** Collision function to test edge inclusion. */
  type CollisionTest = ToMethod<(edge: Edge) => boolean>;

  /** @internal */
  type _GetEdgesOptions = InexactPartial<{
    /**
     * Should inner bounds be added?
     * @defaultValue `false`
     */
    includeInnerBounds: boolean;

    /**
     * Should outer bounds be added?
     * @defaultValue `true`
     */
    includeOuterBounds: boolean;

    /**
     * Collision function to test edge inclusion.
     */
    collisionTest: CanvasEdges.CollisionTest;

    /**
     * Apply collision test to bounds?
     * @defaultValue `false`
     */
    collisionTestBounds: boolean;
  }>;

  interface GetEdgesOptions extends _GetEdgesOptions {}
}

export default CanvasEdges;

declare abstract class AnyCanvasEdges extends CanvasEdges {
  constructor(...args: never);
}
