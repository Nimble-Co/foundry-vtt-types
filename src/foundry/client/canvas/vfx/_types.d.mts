import type VFXPath from "./vfx-path.d.mts";

export interface VFXComponentData {
  /** The VFX component type. */
  type: string;
}

export interface VFXComponentAnimation {
  setup?: (state: object, params: object) => void;
  animate: (t: number, state: object, params: object) => void;
  tearDown?: (state: object, params: object) => void;
}

export type VFXPathGenerator = (points: VFXBasePathPoint[], params: object) => VFXPath;

export interface VFXBasePathPoint {
  /** The x coordinate of the point */
  x: number;

  /** The y coordinate of the point */
  y: number;

  /** The elevation of the point */
  elevation: number;

  /** The rotation at the point in radians */
  rotation?: number | undefined;

  /** The sort order of the point */
  sort?: number | undefined;

  /**
   * The sort layer for the point
   * @defaultValue `PrimaryCanvasGroup.SORT_LAYERS.TOKENS`
   */
  sortLayer?: string | undefined;
}

export interface VFXPathPoint extends VFXBasePathPoint {
  rotation: number;
  distance: number;
  index: number;
  elevation: number;
  sort: number;
}

export interface VFXPositionalSoundData {
  /** Sound source path */
  src: string;

  /** How sound playback aligns with animation, a value in SOUND_ALIGNMENT (default END) */
  align: number;

  /** Playback volume (default 1.0) */
  volume: number;

  /** Local sound radius in distance units (default 60) */
  radius: number;

  /** Whether to apply easing to local sound (default true) */
  easing: boolean;

  /** Whether sound should be constrained by walls (default true) */
  walls: boolean;
}
