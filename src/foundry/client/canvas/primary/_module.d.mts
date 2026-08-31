// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as PrimaryCanvasParticleContainer } from "./primary-canvas-particle-container.mjs";
export { default as PrimaryCanvasContainer } from "./primary-canvas-container.mjs";
export { default as PrimaryGraphics } from "./primary-graphics.mjs";
export { default as PrimarySpriteMesh } from "./primary-sprite-mesh.mjs";

export { default as PrimaryOccludableObjectMixin } from "./primary-occludable-object.mjs";
export { default as PrimaryCanvasObjectMixin } from "./primary-canvas-object.mjs";
export { default as CanvasTransformMixin } from "./canvas-transform-mixin.mjs";

// Deprecated Exports
// eslint-disable-next-line @typescript-eslint/no-deprecated -- re-exporting the @deprecated (until v16) class, matching the v14 source barrel
export { default as PrimaryParticleEffect } from "./primary-particle-effect.mjs";
