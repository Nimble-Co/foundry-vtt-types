import type { Identity } from "#utils";
import type PrimaryCanvasContainer from "./primary-canvas-container.d.mts";

/**
 * A lightweight primary-canvas container designed for particle effects.
 * This container intentionally avoids any internal sorting or depth participation. Children render in insertion order.
 * @remarks The constructor sets {@linkcode PIXI.Container.eventMode | eventMode} to `"none"` and both
 * {@linkcode PIXI.Container.interactiveChildren | interactiveChildren} and
 * {@linkcode PIXI.Container.sortableChildren | sortableChildren} to `false`.
 */
declare class PrimaryCanvasParticleContainer extends PrimaryCanvasContainer {
  /**
   * @remarks Sets {@linkcode PrimaryCanvasContainer._inPrimary | _inPrimary} to `true`. Unlike the
   * {@linkcode PrimaryCanvasContainer} implementation it does not propagate the event to its children, because
   * particles are not Primary Canvas Objects.
   */
  protected override _onAddedPrimary(): void;

  /**
   * @remarks Sets {@linkcode PrimaryCanvasContainer._inPrimary | _inPrimary} to `false`. Unlike the
   * {@linkcode PrimaryCanvasContainer} implementation it does not propagate the event to its children, because
   * particles are not Primary Canvas Objects.
   */
  protected override _onRemovedPrimary(): void;

  /**
   * @remarks A no-op. Elevation is not propagated to the children, because particles are not Primary Canvas Objects.
   */
  protected override _onElevationChange(): void;

  /**
   * @remarks Always `false`. Particle containers do not render depth.
   */
  protected override _shouldRenderDepth(): boolean;

  #PrimaryCanvasParticleContainer: true;
}

declare namespace PrimaryCanvasParticleContainer {
  interface Any extends AnyPrimaryCanvasParticleContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasParticleContainer> {}
}

export default PrimaryCanvasParticleContainer;

declare abstract class AnyPrimaryCanvasParticleContainer extends PrimaryCanvasParticleContainer {
  constructor(...args: never);
}
