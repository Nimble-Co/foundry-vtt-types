import type { AnyObject, Identity, InexactPartial, NullishProps } from "#utils";
import type { BaseShapeData } from "#common/data/_module.mjs";
import type PrimaryCanvasParticleContainer from "#client/canvas/primary/primary-canvas-particle-container.d.mts";
import type SpriteMesh from "#client/canvas/containers/elements/sprite-mesh.d.mts";
import type BaseSamplerShader from "#client/canvas/rendering/shaders/samplers/base-sampler.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type CanvasAnimation from "./canvas-animation.d.mts";

/**
 * A lightweight, native particle generator designed for VFX.
 *
 * `ParticleGenerator` manages:
 * - An internal container on the chosen canvas layer (usually `canvas.primary`)
 * - Particle pooling (reusing sprites instead of constantly allocating new ones)
 * - Lifetime, fade-in/out, basic motion, and optional constraints
 * - Two usage styles:
 *   - **ambient**: keep a steady density in the visible area (viewport-driven budget)
 *   - **effect**: spawn particles in a specific area (manual spawns or a fixed target count)
 *
 * @remarks ParticleGenerator is meant for local, short-lived effects (bursts, embers, motes, small auras),
 * not for filling the entire scene with massive particle counts.
 */
declare class ParticleGenerator {
  /**
   * @param config - The generator configuration
   * @defaultValue `{}`
   */
  constructor(config?: ParticleGenerator.Configuration);

  /**
   * Default generator config.
   * @defaultValue
   * ```typescript
   * {
   *   mode: "ambient",
   *   bounds: null,
   *   count: 0,
   *   spawnRate: 5 * PIXI.Ticker.targetFPMS * 1000,
   *   perFrame: 5,
   *   initial: 0.25,
   *   manual: null,
   *   probability: 1,
   *   viewPadding: 0,
   *   newlyVisible: true,
   *   randomizeAgeInPadding: true,
   *   area: null,
   *   sampleMode: "interior",
   *   positionTest: null,
   *   constraintMode: null,
   *   constraintArea: null,
   *   restitution: 1,
   *   clip: { enabled: null, rect: null },
   *   mask: null,
   *   lifetime: 1000,
   *   fade: { in: 0, out: 0 },
   *   velocity: null,
   *   rotation: {},
   *   drift: { enabled: false, intensity: 1 },
   *   textures: [],
   *   particleAnchor: null,
   *   shaderClass: null,
   *   blend: PIXI.BLEND_MODES.NORMAL,
   *   blur: null,
   *   alpha: { min: 1, max: 1 },
   *   scale: { min: 1, max: 1 },
   *   tint: 0xFFFFFF,
   *   elevation: 0,
   *   sort: 0,
   *   container: null,
   *   ticker: null,
   *   anchor: null,
   *   anchorPoint: "center",
   *   anchorOffset: null,
   *   behavior: null,
   *   orbit: {},
   *   follow: {},
   *   onSpawn: null,
   *   onUpdate: null,
   *   onDeath: null,
   *   onTick: null,
   *   debug: null
   * }
   * ```
   */
  static DEFAULT_OPTIONS: ParticleGenerator.Configuration;

  /**
   * The runtime mode.
   */
  mode: ParticleGenerator.Mode;

  /**
   * The parent container which receives the internal particle container.
   */
  container: PIXI.Container;

  /**
   * An optional anchor used to attach areas and behaviors.
   */
  anchor: ParticleGenerator.Anchor;

  /**
   * Which point to use when anchoring.
   */
  anchorPoint: ParticleGenerator.AnchorPoint;

  /**
   * A fixed offset (scene pixels) applied to the anchor.
   */
  anchorOffset: { x: number; y: number } | null;

  /**
   * The configured particle textures.
   */
  textures: PIXI.Texture[];

  /**
   * An optional sprite anchor override for all particles.
   */
  particleAnchor: { x: number; y: number } | null;

  /**
   * The shader class used to render particles.
   */
  shaderClass: BaseSamplerShader.AnyConstructor;

  /**
   * Viewport-related behavior (used primarily in ambient mode).
   */
  viewport: { padding: number; newlyVisible: boolean; randomizeAgeInPadding: boolean };

  /**
   * The target particle count.
   */
  maxParticles: number;

  /**
   * The initial proportion (0..1) of the computed target particle count to spawn on start.
   */
  initialBatch: number;

  /**
   * If true, particles are never spawned automatically.
   */
  manualSpawning: boolean;

  /**
   * The chance (0..1) that a spawn attempt actually creates a particle.
   */
  spawnProbability: number;

  /**
   * An optional spawn validator.
   */
  positionTest: ParticleGenerator.PositionTest | null;

  /**
   * Which part of the spawn area to sample.
   */
  sampleMode: ParticleGenerator.AreaSampleMode;

  /**
   * Out-of-bounds constraint configuration.
   */
  constraints: {
    mode: ParticleGenerator.ConstraintMode;
    area: "budget" | "view" | "world" | PIXI.Rectangle | null;
    restitution: number;
  };

  /**
   * Clip (mask) options for the default clip behavior.
   */
  clip: { enabled: boolean | null; rect: PIXI.Rectangle | null };

  /**
   * The particle lifetime configuration in milliseconds.
   */
  particleLifetime: number | number[] | { min: number; max: number };

  /**
   * The fade-in duration in milliseconds, or a fraction of lifetime if the value is between 0 and 1 (exclusive).
   */
  fadeInDuration: number;

  /**
   * The fade-out duration in milliseconds, or a fraction of lifetime if the value is between 0 and 1 (exclusive).
   */
  fadeOutDuration: number;

  /**
   * The blend mode used to render particles.
   */
  blendMode: PIXI.BLEND_MODES;

  /**
   * Resolved rotation configuration for particles.
   */
  rotation: {
    alignVelocity: boolean;
    initial: number;
    spread: number;
    speed: { min: number; max: number };
  };

  /**
   * The velocity configuration used to generate per-particle movement.
   */
  velocity: ParticleGenerator.VelocityOptions | null;

  /**
   * Optional random drift configuration.
   */
  drift: { enabled: boolean; intensity: number };

  /**
   * Optional blur filter options applied to the internal container.
   */
  blurOptions: { enabled: boolean; intensity: number; quality: number | undefined } | null;

  /**
   * The elevation for the particle container.
   */
  elevation: number;

  /**
   * The sorting key for the particle container.
   */
  sort: number;

  /**
   * Orbit behavior options.
   */
  orbit: ParticleGenerator.OrbitOptions;

  /**
   * Follow behavior options.
   */
  follow: ParticleGenerator.FollowOptions;

  /**
   * An optional callback called after the particle has been placed and configured.
   */
  onSpawn: ParticleGenerator.ParticleCallback | null;

  /**
   * An optional callback called each frame for each live particle.
   */
  onUpdate: ParticleGenerator.ParticleCallback | null;

  /**
   * An optional callback called when a particle is recycled.
   */
  onDeath: ParticleGenerator.DeathCallback | null;

  /**
   * An optional callback called one time per frame (not per particle!).
   */
  onTick: ParticleGenerator.TickCallback | null;

  /**
   * The computed target particle count based on visible area (ambient mode) or the configured budget (effect mode).
   * @defaultValue `0`
   */
  adjustedMaxParticles: number;

  /**
   * The currently active particle instances.
   * @defaultValue `[]`
   */
  particles: ParticleGenerator.ParticleMesh[];

  /**
   * A pool of recycled particles ready to be reused.
   * @defaultValue `[]`
   */
  particlePool: ParticleGenerator.ParticleMesh[];

  /**
   * Generator bounds in scene coordinates.
   */
  protected _bounds: PIXI.Rectangle;

  /**
   * The configured default spawn area (effect mode).
   * This area is defined in scene coordinates and may be interpreted relative to an anchor.
   * Re-read each frame, so it can be replaced or its values mutated at runtime to animate the spawn region.
   * @defaultValue `null`
   */
  spawnArea: ParticleGenerator.Area | null;

  /**
   * Optional custom constraint rectangle in local coordinates.
   * @defaultValue `null`
   */
  protected _constraintRect: PIXI.Rectangle | null;

  /**
   * Whether the generator is soft-stopped.
   * @defaultValue `true`
   */
  protected _stopped: boolean;

  /**
   * Whether the update callback is attached to the ticker.
   * @defaultValue `false`
   */
  protected _tickerAttached: boolean;

  /**
   * Whether the generator has spawned its initial batch.
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * The internal container which holds all particles.
   * @defaultValue `null`
   */
  protected _particlesContainer: PrimaryCanvasParticleContainer | null;

  /**
   * The display object used to mask particle rendering.
   * @defaultValue `null`
   */
  protected _mask: PIXI.DisplayObject | null;

  /**
   * The blur filter applied to the internal container, if any.
   * @defaultValue `null`
   */
  protected _blurFilter: PIXI.Filter | null;

  /**
   * The local-space viewport rectangle without padding.
   */
  protected _viewRectLocal: PIXI.Rectangle;

  /**
   * The local-space viewport rectangle with padding.
   */
  protected _budgetRectLocal: PIXI.Rectangle;

  /**
   * The local-space generator bounds.
   */
  protected _worldRectLocal: PIXI.Rectangle;

  /**
   * The previous-frame budget rectangle.
   */
  protected _oldBudgetRectLocal: PIXI.Rectangle;

  /**
   * Whether the previous-frame budget rectangle is initialized.
   * @defaultValue `false`
   */
  protected _hasOldBudgetRectLocal: boolean;

  /**
   * A fixed pool of rectangles used to describe newly visible areas.
   */
  protected _newlyVisibleAreaPool: PIXI.Rectangle[];

  /**
   * The list of newly visible areas for the current frame in local coordinates.
   */
  protected _newlyVisibleAreas: PIXI.Rectangle[];

  /**
   * The current anchor position in scene coordinates.
   */
  protected _anchorScene: PIXI.Point;

  /**
   * The current anchor position in local coordinates.
   */
  protected _anchorLocal: PIXI.Point;

  /**
   * The active behavior implementation.
   * @defaultValue `null`
   */
  protected _behavior: ParticleGenerator.Behavior | null;

  /**
   * A cached context object passed to behavior hooks.
   */
  protected _behaviorContext: AnyObject;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _tlScreen: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _brScreen: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _tlLocal: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _brLocal: PIXI.Point;

  /**
   * Temp point used to sample shape-based spawn areas.
   */
  protected _spawnPoint: PIXI.Point;

  /**
   * A function which generates per-particle movement speed vectors.
   */
  protected _generateMovementSpeed: (out: PIXI.Point, particle: ParticleGenerator.ParticleMesh) => void;

  /**
   * Normalized debug options.
   * @defaultValue `null`
   */
  protected _debug: ParticleGenerator.DebugOptions | null;

  /**
   * Debug statistics and profiling output.
   * Null when debug stats are disabled.
   * @defaultValue `null`
   */
  protected _debugStats: ParticleGenerator.DebugStats | null;

  /**
   * Whether profiling is enabled.
   * @defaultValue `false`
   */
  protected _debugProfile: boolean;

  /**
   * Cached debug tint options.
   * @defaultValue `null`
   */
  protected _debugTint: { mode: ParticleGenerator.DebugTintMode; palette: number[] } | null;

  /**
   * The bounding rectangle of the generator in scene coordinates.
   * Used to convert between local particle coordinates and scene coordinates.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * The PIXI container that holds all particle display objects.
   */
  get particlesContainer(): PIXI.Container | null;

  /**
   * The current unpadded viewport rectangle in the generator's local space.
   */
  get viewRectLocal(): PIXI.Rectangle;

  /**
   * The current padded viewport rectangle used for budget/spawning in ambient mode.
   */
  get budgetRectLocal(): PIXI.Rectangle;

  /**
   * The maximum number of particles that may be spawned per second (auto-spawn mode).
   */
  get spawnRate(): number;

  set spawnRate(value: number);

  /**
   * The mask applied to the particle container. Set to null to remove the mask.
   * The generator does not manage the lifecycle of externally assigned masks.
   */
  get mask(): PIXI.DisplayObject | null;

  set mask(value: PIXI.DisplayObject | null);

  /**
   * Debug statistics and profiling output.
   * Returns null if {@linkcode ParticleGenerator.DebugOptions.stats | stats} is not enabled.
   *
   * Note: This getter returns a stable object reference and updates the live values (active/pool/target)
   * on access.
   */
  get debugStats(): ParticleGenerator.DebugStats | null;

  /**
   * Start the generator, create the update loop and optionally spawn an initial batch.
   * @param options - Start options
   */
  start(options?: ParticleGenerator.StartOptions): void;

  /**
   * Stop the generator.
   * @param options - Stop options
   */
  stop(options?: ParticleGenerator.StopOptions): void;

  /**
   * Spawn a single particle.
   * In "ambient" mode, the default spawn area is the current padded viewport rectangle.
   * In "effect" mode, the default spawn area is the configured {@linkcode ParticleGenerator.Area | Area}.
   * @param options - Spawn options
   * @returns The spawned particle, or `null` if no particle was created
   */
  spawnParticle(options?: ParticleGenerator.SpawnParticleOptions): ParticleGenerator.ParticleMesh | null;

  /**
   * Spawn multiple particles.
   * @param count   - The number of particles to spawn.
   * @param options - Spawn options
   * @returns The number of successfully spawned particles.
   */
  spawnParticles(count: number, options?: ParticleGenerator.SpawnParticlesOptions): number;

  /**
   * Migrate deprecated configuration options.
   * @param config - The user-provided configuration object.
   * @param cfg    - The prepared configuration object.
   */
  protected _migrateConfig(config: ParticleGenerator.Configuration, cfg: ParticleGenerator.Configuration): void;

  /**
   * Apply the configuration to the ParticleGenerator instance.
   * @param cfg - The configuration object.
   */
  protected _configureOptions(cfg: ParticleGenerator.Configuration): void;

  /**
   * Configure optional debug helpers.
   * This feature set is fully opt-in and is designed to have near-zero overhead when disabled.
   * @param debug - The raw debug configuration
   */
  protected _configureDebug(debug: ParticleGenerator.DebugOptions | boolean | null | undefined): void;

  /**
   * Initialize behaviors from the configuration object.
   * @param cfg - The configuration object
   */
  protected _initializeBehaviors(cfg: ParticleGenerator.Configuration): void;

  /**
   * Initialize cached generators from the configuration object.
   * @param _cfg - The configuration object
   */
  protected _initializeCachedGenerators(_cfg: ParticleGenerator.Configuration): void;

  /**
   * Compute the current viewport rectangles and target particle count.
   * All rectangles are in the local coordinate space of the internal container.
   */
  protected _calculateGeneratorProperties(): void;

  /**
   * Compute the portions of newRect that were not visible in oldRect.
   * This method reuses a fixed pool of rectangles to avoid per-frame allocations.
   */
  protected _computeNewlyVisibleAreas(oldRect: PIXI.Rectangle, newRect: PIXI.Rectangle): void;

  /**
   * Spawn the initial particle batch.
   * In ambient mode, particle ages are randomized so the scene appears pre-settled.
   */
  protected _initializeParticles(): void;

  /**
   * Ticker callback.
   */
  protected _onTick(): void;

  /**
   * Update all active particles.
   * @param dt - Delta time in milliseconds.
   */
  protected _updateExistingParticles(dt: number): void;

  /**
   * Update particles without constraints.
   * @param dt       - Delta time in milliseconds.
   * @param ds       - Delta time in seconds.
   * @param particles - The particles to update
   * @param behavior - The active behavior
   * @param bctx     - The behavior context
   */
  protected _updateParticlesUnconstrained(
    dt: number,
    ds: number,
    particles: ParticleGenerator.ParticleMesh[],
    behavior: ParticleGenerator.Behavior | null,
    bctx: AnyObject | null,
  ): void;

  /**
   * Update particles with constraints applied.
   */
  protected _updateParticlesConstrained(
    dt: number,
    ds: number,
    bounds: PIXI.Rectangle,
    particles: ParticleGenerator.ParticleMesh[],
    behavior: ParticleGenerator.Behavior | null,
    bctx: AnyObject | null,
    mode: ParticleGenerator.ConstraintMode,
  ): void;

  /**
   * Spawn particles to move toward the current target count.
   */
  protected _autoSpawnParticles(): void;

  /**
   * Apply a random drift vector to a particle.
   * @param particle - The particle to drift
   */
  protected _applyRandomDrift(particle: ParticleGenerator.ParticleMesh): void;

  /**
   * Create a new particle instance.
   * @param texture - The texture to assign to the particle
   */
  protected _createNewParticle(texture: PIXI.Texture): ParticleGenerator.ParticleMesh;

  /**
   * Initialize/refresh base particle properties.
   * @param particle - The particle to set up
   */
  protected _setupParticleBase(particle: ParticleGenerator.ParticleMesh): void;

  /**
   * Recycle a particle to the pool.
   * @param particle - The particle to recycle
   * @param reason   - The reason the particle was recycled
   */
  protected _recycleParticle(particle: ParticleGenerator.ParticleMesh, reason: string): void;

  /**
   * Get a random texture from the configured set.
   * @returns A random configured texture, or `null` if none are configured
   */
  protected _getRandomTexture(): PIXI.Texture | null;

  /**
   * Get default bounds from the current scene dimensions.
   */
  protected _getDefaultBounds(): PIXI.Rectangle;

  /**
   * @deprecated since v14
   * @remarks "ParticleGenerator#maxParticlesPerFrame is deprecated. Use ParticleGenerator#spawnRate instead."
   *
   * `{ since: 14, until: 16 }`
   */
  get maxParticlesPerFrame(): number;

  set maxParticlesPerFrame(value: number);

  /**
   * @deprecated since v14
   * @remarks "ParticleGenerator#alphaRange is deprecated. Use ParticleGeneratorConfiguration#alpha instead."
   *
   * `{ since: 14, until: 16 }`
   */
  get alphaRange(): { min: number; max: number };

  set alphaRange(value: { min: number; max: number });

  /**
   * @deprecated since v14
   * @remarks "ParticleGenerator#scaleRange is deprecated. Use ParticleGeneratorConfiguration#scale instead."
   *
   * `{ since: 14, until: 16 }`
   */
  get scaleRange(): { min: number; max: number };

  set scaleRange(value: { min: number; max: number });
}

declare namespace ParticleGenerator {
  interface Any extends AnyParticleGenerator {}
  interface AnyConstructor extends Identity<typeof AnyParticleGenerator> {}

  /** The runtime mode of a generator. */
  type Mode = "ambient" | "effect";

  /**
   * A numeric range:
   * - number: a fixed value
   * - `[min, max]`: a uniform range
   * - `{min, max}`: a uniform range
   */
  type Range = number | number[] | { min: number; max: number };

  interface CurvePoint {
    /** Normalized lifetime position, from 0 to 1. */
    time: number;

    /** Value at this lifetime position. */
    value: number;
  }

  /**
   * A user-defined function that computes a particle value during particle update.
   * @param particle - The particle being evaluated.
   * @param dt        - Frame delta in milliseconds.
   */
  type ValueFunction = (particle: ParticleMesh, dt: number) => number;

  /** @internal */
  type _ValueOptions = NullishProps<{
    /** Minimum base value sampled once per particle. */
    min: number;

    /** Maximum base value sampled once per particle. */
    max: number;

    /**
     * Optional curve over normalized lifetime. Points must start at time 0, end at time 1, and use
     * strictly increasing times.
     */
    curve: CurvePoint[];

    /**
     * Evaluate curve values in discrete steps instead of interpolation.
     * @defaultValue `false`
     * @remarks Only has an effect together with `curve`.
     */
    step: boolean;

    /** Complete custom value function. */
    fn: ValueFunction;
  }>;

  /**
   * Advanced particle value configuration.
   * If a base range is combined with a curve, the owning attribute decides how they compose.
   * `fn` is a complete override and must not be combined with the other fields.
   */
  interface ValueOptions extends _ValueOptions {}

  type Value = number | number[] | ValueOptions;

  interface ColorCurvePoint {
    /** Normalized lifetime position, from 0 to 1. */
    time: number;

    /** A color source at this lifetime position. */
    value: Color.Source;
  }

  /**
   * A user-defined function that computes a particle color during particle update.
   * @param particle - The particle being evaluated.
   * @param dt        - Frame delta in milliseconds.
   * @returns A 0xRRGGBB color value.
   */
  type ColorFunction = (particle: ParticleMesh, dt: number) => number;

  /** @internal */
  type _ColorValueOptions = NullishProps<{
    /**
     * Optional color curve over normalized lifetime. Points must start at time 0, end at time 1, and use
     * strictly increasing times.
     */
    curve: ColorCurvePoint[];

    /** Complete custom color function. */
    fn: ColorFunction;
  }>;

  /**
   * Advanced particle color configuration.
   * `fn` is a complete override and must not be combined with `curve`.
   */
  interface ColorValueOptions extends _ColorValueOptions {}

  type ColorValue = Color.Source | ColorValueOptions;

  type Point = PIXI.IPointData;

  type Rectangle = PIXI.Rectangle | { x: number; y: number; width: number; height: number };

  /**
   * An anchor source used to attach spawn areas and behaviors to a moving object.
   * Supported sources:
   * - A {@linkcode PlaceableObject} (for example a Token): uses {@linkcode AnchorPoint} to choose a point.
   * - A point in scene coordinates.
   * - A function which returns a point-like object in scene coordinates.
   */
  type Anchor = PIXI.IPointData | (() => Point) | null;

  /**
   * Which point to use when anchoring to an object.
   * - "center": use `source.center` when available (recommended for Tokens).
   * - "position": use `{x: source.x, y: source.y}`.
   * - function: invoked as `(source) => ({x, y})`.
   */
  type AnchorPoint = "center" | "position" | ((source: object) => Point);

  type BehaviorId = "default" | "orbit" | "follow";

  /** @internal */
  type _OrbitOptions = NullishProps<{
    /**
     * Orbit radius in pixels. If null, use the particle's initial distance from the anchor.
     * @defaultValue `null`
     */
    radius: Range;

    /**
     * Angular speed in degrees per second.
     * @defaultValue `120`
     */
    angularSpeed: Range;

    /**
     * Initial angle in degrees. Only used when {@linkcode OrbitOptions.radius | radius} is provided.
     * @defaultValue `[0, 360]`
     */
    phase: Range;

    /**
     * Radial speed in pixels per second.
     * @defaultValue `0`
     */
    radialSpeed: Range;

    /**
     * Orbit direction.
     * @defaultValue `1`
     */
    direction: 1 | -1 | "random";

    /**
     * If set, override sprite rotation each frame.
     * @defaultValue `"none"`
     */
    rotation: "none" | "tangent" | "radial";
  }>;

  interface OrbitOptions extends _OrbitOptions {}

  /** @internal */
  type _FollowOptions = NullishProps<{
    /**
     * Fixed local offset from the anchor in pixels. If null, use the particle's initial offset from the anchor.
     * @defaultValue `null`
     */
    offset: Point;

    /**
     * A 0..1 smoothing factor. 1 snaps to the target every frame.
     * @defaultValue `1`
     */
    stiffness: number;
  }>;

  interface FollowOptions extends _FollowOptions {}

  /** @internal */
  type _Behavior = InexactPartial<{
    /** Called once during construction. */
    initialize: (generator: ParticleGenerator) => void;

    /** Called for each spawned particle. */
    spawn: (particle: ParticleMesh, ctx: object) => void;

    /**
     * Called for each particle during update. Return true to indicate the behavior handled positional
     * integration for this particle.
     */
    update: (particle: ParticleMesh, dt: number, ctx: object) => boolean | void;
  }>;

  interface Behavior extends _Behavior {}

  type AreaSampleMode = "interior" | "boundary";

  /** Source data for a {@linkcode BaseShapeData} subclass. */
  interface ShapeDataSource {
    /** A valid type from {@linkcode BaseShapeData.TYPES}. */
    type: string;
  }

  type PointList = Point[];

  type PolylineDefinition = PointList | PointList[];

  /**
   * A spawn area definition in scene coordinates.
   *
   * When an {@linkcode Anchor} is provided, object-based areas are interpreted as offsets relative to the anchor
   * point. To provide an absolute rectangle while anchored, pass a {@linkcode PIXI.Rectangle}. {@linkcode BaseShapeData}
   * instances and source data are always interpreted in absolute scene coordinates.
   *
   * @remarks `foundry.data.PolygonTree` (one of the supported source values) is not yet modeled in fvtt-types and is
   * typed as `object` here.
   */
  type Area =
    | PIXI.Rectangle
    | object // PolygonTree, not yet modeled in fvtt-types
    | BaseShapeData
    | ShapeDataSource
    | Point
    | { x: number; y: number; width: number; height: number }
    | { x: number; y: number; radius: number | number[] }
    | { x: number; y: number; innerRadius: number; outerRadius: number }
    | { from: Point; to: Point }
    | { points: PointList; shape?: "points" }
    | { path: PolylineDefinition; shape?: "path" | "polyline" }
    | { points: PolylineDefinition; shape: "polyline" }
    | {
        x: number;
        y: number;
        radiusX: number;
        radiusY: number;
        shape?: "ellipse";
        holeScale?: number;
        minAngle?: number;
        maxAngle?: number;
        shapeRotation?: number;
        rotation?: number;
        affectRotation?: boolean;
      };

  /** @internal */
  type _FadeOptions = InexactPartial<{
    /**
     * Fade-in duration in milliseconds, or a fraction of lifetime if the value is between 0 and 1 (exclusive).
     * @defaultValue `0`
     */
    in: number;

    /**
     * Fade-out duration in milliseconds, or a fraction of lifetime if the value is between 0 and 1 (exclusive).
     * @defaultValue `0`
     */
    out: number;
  }>;

  interface FadeOptions extends _FadeOptions {}

  /** @internal */
  type _RotationOptions = InexactPartial<{
    /**
     * Align initial rotation to the particle's velocity direction.
     * @defaultValue `false`
     */
    alignVelocity: boolean;

    /**
     * Fixed rotation offset in radians, additive to the base.
     * @defaultValue `0`
     */
    initial: number;

    /**
     * Symmetric random spread in radians around the base+initial. 0 means no randomization; `Math.PI` gives
     * full-circle random.
     * @defaultValue `Math.PI`
     */
    spread: number;

    /**
     * Rotation speed over the particle lifetime. Initially specified in degrees-per-second, internally managed
     * in radians-per-second.
     * @defaultValue `0`
     */
    speed: Value;
  }>;

  /**
   * Particle rotation configuration that controls initial rotation of spawned particles and their rotational speed.
   */
  interface RotationOptions extends _RotationOptions {}

  /**
   * A user-defined function that computes a particle velocity vector in pixels per second.
   * The function may either write into `out` and return void, or return a point-like velocity object.
   * @param particle - The particle being evaluated.
   * @param dt        - Frame delta in milliseconds.
   * @param out       - Reusable point which may receive the velocity.
   */
  type VelocityFunction = (particle: ParticleMesh, dt: number, out: PIXI.Point) => PIXI.IPointData | void | null;

  /**
   * Particle velocity configuration.
   * Supported shapes:
   * - Fixed vector: `{x, y}`
   * - Cartesian ranges: `{x: range, y: range}`
   * - Polar: `{speed: value, angle: range}` where angle is in degrees.
   * - Function: `{fn: (particle, dt, out) => { ... }}`
   */
  type VelocityOptions = Point | { x: Range; y: Range } | { speed: Value; angle: Range } | { fn: VelocityFunction };

  type ConstraintMode = "none" | "kill" | "clamp" | "wrap" | "bounce";

  type DebugTintMode = "random" | "palette" | "byTexture";

  /** @internal */
  type _DebugTintOptions = InexactPartial<{
    /**
     * How to apply debug tinting.
     * @defaultValue `"random"`
     */
    mode: DebugTintMode;

    /** A list of 0xRRGGBB colors used for "palette" or "byTexture" modes. */
    palette: number[];
  }>;

  interface DebugTintOptions extends _DebugTintOptions {}

  /** @internal */
  type _DebugOptions = NullishProps<{
    /**
     * If true, fall back to {@linkcode PIXI.Texture.WHITE} when no textures are configured.
     * @defaultValue `false`
     */
    useWhiteTexture: boolean;

    /**
     * Optional automatic tinting for spawned particles.
     * @defaultValue `null`
     */
    tint: DebugTintOptions | boolean;

    /**
     * Whether to collect debug statistics.
     * @defaultValue `false`
     */
    stats: boolean;

    /**
     * Whether to capture per-tick timings (requires stats).
     * @defaultValue `false`
     */
    profile: boolean;
  }>;

  interface DebugOptions extends _DebugOptions {}

  interface DebugStats {
    /** Current number of active particles. */
    active: number;

    /** Current number of pooled particles. */
    pool: number;

    /** Current adjusted target particle count. */
    target: number;

    /** Number of spawn attempts. */
    spawnAttempts: number;

    /** Number of successfully spawned particles. */
    spawned: number;

    /** Spawn attempts rejected by probability (auto-spawn only). */
    spawnRejectedProbability: number;

    /** Spawn attempts rejected by {@linkcode Configuration.positionTest | positionTest}. */
    spawnRejectedPositionTest: number;

    /** Spawn attempts rejected because no valid spawn area was available. */
    spawnRejectedNoArea: number;

    /** Particles recycled due to lifetime expiration. */
    recycledLifetime: number;

    /** Particles recycled due to constraint handling. */
    recycledConstraint: number;

    /** Particles recycled/cleared due to a hard stop. */
    recycledStop: number;

    /** Number of newly-visible rectangles this frame (ambient mode). */
    newlyVisibleAreaCount: number;

    /** Time spent updating particles during the most recent tick (milliseconds). */
    updateMS: number;

    /** Time spent auto-spawning particles during the most recent tick (milliseconds). */
    spawnMS: number;

    /** Total tick time for the most recent tick (milliseconds). */
    tickMS: number;
  }

  /** @internal */
  type _ClipOptions = NullishProps<{
    /**
     * Whether to apply a managed clip mask. If null, defaults to true in ambient mode and false in effect mode.
     * @defaultValue `null`
     */
    enabled: boolean;

    /**
     * Optional clip rectangle in scene coordinates. If omitted, a shape-based spawn area is used when available.
     * Otherwise the generator bounds are used.
     * @defaultValue `null`
     */
    rect: Rectangle;
  }>;

  interface ClipOptions extends _ClipOptions {}

  /**
   * @param x       - The candidate x coordinate in scene pixels.
   * @param y       - The candidate y coordinate in scene pixels.
   * @param context - The spawn context.
   */
  type PositionTest = (
    x: number,
    y: number,
    context: { generator: ParticleGenerator; particle: ParticleMesh },
  ) => boolean;

  type ParticleCallback = (particle: ParticleMesh, context: { generator: ParticleGenerator }) => void;

  type DeathCallback = (particle: ParticleMesh, context: { generator: ParticleGenerator; reason: string }) => void;

  type TickCallback = (dt: number, generator: ParticleGenerator) => void;

  /** @internal */
  type _Configuration = NullishProps<{
    /**
     * The runtime mode.
     * - "ambient": maintains a stable density in the visible region (viewport-based budget).
     * - "effect": spawns in a defined area; particles are lifetime-driven unless constrained.
     * @defaultValue `"ambient"`
     */
    mode: Mode;

    /**
     * Optional generator bounds in scene coordinates. This is used for coordinate conversion, viewport clamping,
     * and optional clipping. Defaults to the current Scene dimensions.
     * @defaultValue `null`
     */
    bounds: Rectangle;

    /**
     * The target particle count.
     * - In "ambient" mode, this is the maximum for the full bounds and is scaled by visible area.
     * - In "effect" mode, this is the absolute target.
     * @defaultValue `0`
     */
    count: number;

    /**
     * The maximum number of particles that may be spawned per second (auto-spawn mode).
     * @defaultValue `300`
     */
    spawnRate: number;

    /**
     * The initial proportion (0..1) of the computed target particle count to spawn on start.
     * @defaultValue `0.25`
     */
    initial: number;

    /**
     * If true, particles are never spawned automatically. If null, defaults to true in "effect" mode unless
     * `spawnRate` is explicitly configured and false in "ambient" mode. Legacy `perFrame` does not change the
     * default.
     * @defaultValue `null`
     */
    manual: boolean;

    /**
     * The chance (0..1) that a spawn attempt actually creates a particle.
     * @defaultValue `1`
     */
    probability: number;

    /**
     * A proportion (0..1+) of extra area around the visible region used for spawning. For example, 0.2 extends
     * the spawn region by 20% in each dimension.
     * @defaultValue `0`
     */
    viewPadding: number;

    /**
     * If true, prioritize spawning particles in newly-visible areas when the view changes (pan/zoom).
     * @defaultValue `true`
     */
    newlyVisible: boolean;

    /**
     * If true, particles spawned in padded regions can start partially through their lifetime.
     * @defaultValue `true`
     */
    randomizeAgeInPadding: boolean;

    /**
     * The default spawn area in "effect" mode (scene coordinates).
     * @defaultValue `null`
     */
    area: Area;

    /**
     * Which part of the spawn area to sample.
     * @defaultValue `"interior"`
     */
    sampleMode: AreaSampleMode;

    /**
     * An optional spawn validator. The function is invoked as `(x, y, {generator, particle})` and must return
     * true if the location is valid.
     * @defaultValue `null`
     */
    positionTest: PositionTest;

    /**
     * How to handle particles leaving the constraint area. If null, defaults to "kill" in ambient mode and "none"
     * in effect mode.
     * @defaultValue `null`
     */
    constraintMode: ConstraintMode;

    /**
     * The constraint area.
     * - "budget": the padded viewport rectangle.
     * - "view": the unpadded viewport rectangle.
     * - "world": the generator bounds.
     * - Rectangle: a custom rectangle in scene coordinates.
     * @defaultValue `null`
     */
    constraintArea: "budget" | "view" | "world" | Rectangle;

    /**
     * Bounce restitution factor (0..1) used when constraintMode is "bounce".
     * @defaultValue `1`
     */
    restitution: number;

    /**
     * An explicit mask for the particle container. Accepts either a pre-built PIXI.DisplayObject, a PIXI shape,
     * or a {@linkcode BaseShapeData} which is drawn into a PIXI.Graphics. Presence implies masking is desired, and
     * this mask takes precedence over `clip`.
     * @defaultValue `null`
     */
    mask: PIXI.DisplayObject | PIXI.IShape | BaseShapeData;

    /**
     * The particle velocity in pixels per second.
     * @defaultValue `null`
     */
    velocity: VelocityOptions;

    /**
     * Optional sprite anchor override for particle textures. If null, each texture's `defaultAnchor` is used.
     * @defaultValue `null`
     */
    particleAnchor: Point;

    /**
     * Optional shader class used to render particles. Defaults to {@linkcode BaseSamplerShader}.
     * @defaultValue `null`
     */
    shaderClass: BaseSamplerShader.AnyConstructor;

    /**
     * An optional callback called after the particle has been placed and configured.
     * @defaultValue `null`
     */
    onSpawn: ParticleCallback;

    /**
     * An optional callback called each frame for each live particle, after position, rotation, tint, and alpha
     * have been computed.
     * @defaultValue `null`
     */
    onUpdate: ParticleCallback;

    /**
     * An optional callback called when a particle is recycled.
     * @defaultValue `null`
     */
    onDeath: DeathCallback;

    /**
     * An optional callback called per frame (not per particle!).
     * @defaultValue `null`
     */
    onTick: TickCallback;

    /**
     * Optional debugging helpers.
     * @defaultValue `null`
     */
    debug: DebugOptions | boolean;
  }>;

  /** @internal */
  type _ConfigurationInexact = InexactPartial<{
    /**
     * Deprecated since v14. Use `spawnRate` instead. If `spawnRate` is omitted or null, this legacy per-frame
     * value is converted using the Pixi ticker target frame rate.
     * @deprecated since v14
     * @defaultValue `5`
     */
    perFrame: number;

    /**
     * Clip (mask) configuration. Use true for default clipping.
     */
    clip: ClipOptions | Rectangle | boolean;

    /**
     * The particle lifetime in milliseconds.
     * @defaultValue `1000`
     */
    lifetime: Range;

    /** Fade envelope configuration. */
    fade: FadeOptions;

    /** Rotation configuration for particles. */
    rotation: RotationOptions;

    /**
     * Deprecated since v14. Use `rotation.speed` instead.
     * @deprecated since v14
     */
    rotationSpeed: Value;

    /** Optional random drift configuration. */
    drift: { enabled: boolean; intensity: number };

    /**
     * The particle texture sources. Each entry may be a PIXI.Texture or a string path.
     * @defaultValue `[]`
     */
    textures: (PIXI.Texture | string)[];

    /**
     * The blend mode used to render particles.
     * @defaultValue `PIXI.BLEND_MODES.NORMAL`
     */
    blend: PIXI.BLEND_MODES;

    /**
     * An optional blur filter applied to the internal container.
     * @defaultValue `null`
     */
    blur:
      | number
      | { intensity: number; quality?: number }
      | { enabled: boolean; intensity: number; quality?: number }
      | null;

    /**
     * The alpha value for particles.
     * @defaultValue `1`
     */
    alpha: Value;

    /**
     * The scale value for particles.
     * @defaultValue `1`
     */
    scale: Value;

    /**
     * The tint color for particles.
     * @defaultValue `0xFFFFFF`
     */
    tint: ColorValue;

    /**
     * The elevation for the particle container.
     * @defaultValue `0`
     */
    elevation: number;

    /**
     * The sorting key for the particle container.
     * @defaultValue `0`
     */
    sort: number;

    /**
     * The parent container which receives the internal particle container. Defaults to `canvas.primary`.
     */
    container: PIXI.Container;

    /**
     * The ticker used to drive the update loop. Defaults to {@linkcode CanvasAnimation.ticker}.
     */
    ticker: PIXI.Ticker;

    /**
     * An optional anchor used to attach areas and behaviors.
     * @defaultValue `null`
     */
    anchor: Anchor;

    /**
     * Which point to use when anchoring.
     * @defaultValue `"center"`
     */
    anchorPoint: AnchorPoint;

    /**
     * A fixed offset (scene pixels) applied to the anchor.
     * @defaultValue `null`
     */
    anchorOffset: Point;

    /**
     * Optional behavior.
     * @defaultValue `null`
     */
    behavior: BehaviorId | Behavior;

    /** Orbit behavior options. */
    orbit: OrbitOptions;

    /** Follow behavior options. */
    follow: FollowOptions;
  }>;

  interface Configuration extends _Configuration, _ConfigurationInexact {}

  /**
   * A particle managed by a {@linkcode ParticleGenerator}: a {@linkcode SpriteMesh} augmented with generator
   * bookkeeping fields.
   */
  type ParticleMesh = SpriteMesh & {
    generator: ParticleGenerator;
    elapsedTime: number;
    time: number;
    lifetime: number;
    fadeInDuration: number;
    fadeOutDuration: number;
    maxAlpha: number;
    _baseScale: number;
    _baseTint: number;
    _baseSpeed?: number;
    _baseRotationSpeed: number;
    rotationSpeed: number;
    movementSpeed: PIXI.Point;
    _movementDirectionX?: number;
    _movementDirectionY?: number;
    _movementDriftX?: number;
    _movementDriftY?: number;
    _velocityFunctionBounceX?: number;
    _velocityFunctionBounceY?: number;
  };

  interface PolylineSegment {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    length: number;
  }

  /** @internal */
  type _LocalArea = InexactPartial<{
    data: BaseShapeData | object; // `object` covers `foundry.data.PolygonTree`, not yet modeled
    sampleMode: AreaSampleMode;
    x: number;
    y: number;
    points: PointList;
    segments: PolylineSegment[];
    cumulativeLengths: number[];
    totalLength: number;
    fallbackPoint: Point | null;
    radiusX: number;
    radiusY: number;
    minAngle: number;
    maxAngle: number;
    shapeRotation: number;
    affectRotation: boolean;
    cosRotation: number;
    sinRotation: number;
    holeAreaScale: number;
    rect: PIXI.Rectangle;
    ax: number;
    ay: number;
    bx: number;
    by: number;
  }>;

  interface LocalArea extends _LocalArea {
    type: "shape" | "polygonTree" | "point" | "points" | "polyline" | "ellipse" | "ambientRect" | "line";
  }

  /** @internal */
  type _StartOptions = InexactPartial<{
    /**
     * Spawn this many particles immediately after starting. If {@linkcode ParticleGenerator.manualSpawning} is
     * false, this is capped to the remaining budget (target - active).
     * @defaultValue `0`
     */
    spawn: number;
  }>;

  interface StartOptions extends _StartOptions {}

  /** @internal */
  type _StopOptions = InexactPartial<{
    /**
     * If true, detach the update loop and destroy internal resources. If false, stop spawning and let existing
     * particles expire naturally.
     * @defaultValue `false`
     */
    hard: boolean;
  }>;

  interface StopOptions extends _StopOptions {}

  /** @internal */
  type _SpawnParticleOptions = NullishProps<{
    /** A texture (or texture source string) to force for this particle. */
    texture: PIXI.Texture | string;

    /**
     * Which part of the spawn area to sample. Defaults to the configured generator sample mode.
     */
    sampleMode: AreaSampleMode;

    /**
     * An optional spawn area override.
     * @defaultValue `null`
     */
    area: Area;

    /**
     * An optional explicit spawn position. Coordinates are in scene space.
     * @defaultValue `null`
     */
    position: PIXI.Point | { x: number; y: number };
  }>;

  interface SpawnParticleOptions extends _SpawnParticleOptions {}

  /** @internal */
  type _SpawnParticlesOptions = NullishProps<{
    /** A texture (or texture source string) to force for this burst. */
    texture: PIXI.Texture | string;

    /**
     * Which part of the spawn area to sample. Defaults to the configured generator sample mode.
     */
    sampleMode: AreaSampleMode;

    /**
     * An optional spawn area override.
     * @defaultValue `null`
     */
    area: Area;

    /**
     * An optional explicit spawn position (scene coordinates).
     * @defaultValue `null`
     */
    position: Point;
  }>;

  interface SpawnParticlesOptions extends _SpawnParticlesOptions {}
}

export default ParticleGenerator;

declare abstract class AnyParticleGenerator extends ParticleGenerator {
  constructor(...args: never);
}
