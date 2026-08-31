import type { AnyMutableObject, Identity } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type { VFXPointSourcePolygonField, VFXReferenceField } from "../fields/_module.d.mts";

/**
 * A component which emits particles using a PIXI particle system, configured by emission rate, lifetime, scale,
 * velocity, and other particle parameters.
 */
declare class VFXParticleGeneratorComponent extends VFXComponent<VFXParticleGeneratorComponent.Schema> {
  static override TYPE: "particleGenerator";

  static override defineSchema(): fields.DataSchema;

  static override migrateData(source: AnyMutableObject, options?: DataModel.MigrateDataOptions): AnyMutableObject;

  #VFXParticleGeneratorComponent: true;
}

declare namespace VFXParticleGeneratorComponent {
  interface Any extends VFXParticleGeneratorComponent {}
  interface AnyConstructor extends Identity<typeof VFXParticleGeneratorComponent> {}

  interface AlphaSchema extends fields.DataSchema {
    max: fields.AlphaField;
    min: fields.AlphaField;
  }

  interface FadeSchema extends fields.DataSchema {
    in: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    out: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
  }

  interface LifetimeSchema extends fields.DataSchema {
    max: fields.NumberField<{ initial: null; positive: true }>;
    min: fields.NumberField<{ required: true; nullable: false; initial: 1000; positive: true }>;
  }

  interface RotationSchema extends fields.DataSchema {
    alignVelocity: fields.BooleanField;
    initial: fields.NumberField<{ nullable: false; initial: 0 }>;
    spread: fields.NumberField<{ nullable: false }>;
    speed: fields.NumberField<{ nullable: false; initial: 0 }>;
  }

  interface ScaleSchema extends fields.DataSchema {
    max: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;
    min: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;
  }

  interface VelocitySchema extends fields.DataSchema {
    angle: fields.NumberField<{ nullable: false }>;
    speed: fields.NumberField<{ nullable: false }>;
    x: fields.NumberField<{ nullable: false }>;
    y: fields.NumberField<{ nullable: false }>;
  }

  interface Schema extends VFXComponent.Schema {
    alpha: fields.SchemaField<AlphaSchema>;
    area: VFXReferenceField;
    blend: fields.NumberField<{ nullable: false; initial: 0 }>;
    count: VFXReferenceField;
    duration: fields.NumberField<{ nullable: false }>;
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    fade: fields.SchemaField<FadeSchema, { required: false; nullable: true; initial: null }>;
    initial: fields.NumberField<{ required: true; nullable: false; initial: 0.25; min: 0; max: 1 }>;
    lifetime: fields.SchemaField<LifetimeSchema>;
    mode: fields.StringField<{ required: true; blank: false; initial: "effect"; choices: ["ambient", "effect"] }>;
    config: fields.ObjectField<{ required: false }>;
    spawnRate: fields.NumberField<{ required: true; nullable: false; initial: 300; positive: true }>;
    rotation: fields.SchemaField<RotationSchema, { required: false }>;
    scale: fields.SchemaField<ScaleSchema>;
    sort: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    textures: fields.ArrayField<fields.StringField<{ required: true; blank: false }>>;
    velocity: fields.SchemaField<VelocitySchema, { required: false; nullable: true; initial: null }>;
    pointSourceMask: VFXPointSourcePolygonField;
  }
}

export default VFXParticleGeneratorComponent;
