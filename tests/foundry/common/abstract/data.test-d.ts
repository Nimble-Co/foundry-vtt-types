import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";
import fields = foundry.data.fields;

declare const myItem: foundry.documents.BaseItem;

myItem.updateSource({ img: "newPath" });

// @ts-expect-error foo isn't a valid property
myItem.updateSource({ foo: "bar" });

type SchemaWithIndexSignatures = {
  genericProperty: fields.StringField;

  [K: string | number | symbol]: fields.StringField | fields.NumberField;
};

class _GenericDataModel<Schema extends SchemaWithIndexSignatures> extends foundry.abstract.DataModel<Schema, null> {
  method() {
    // @ts-expect-error While this shouldn't error it's a current known limitation of the current approach that a generic data model can't resolve properties fully.
    expectTypeOf(this.genericProperty).toEqualTypeOf<string | undefined>();

    // @ts-expect-error string index signatures should be stripped so accessing an arbitrary string should fail.
    this.arbitraryProperty;

    // @ts-expect-error number index signatures should be stripped so accessing an arbitrary number should fail.
    this[0];

    // @ts-expect-error symbol index signatures should be stripped so accessing an arbitrary symbol should fail.
    this[Symbol("symbol")];
  }
}

// v14.367 gave `migrateData` and `migrateDataSafe` a second `options` parameter.
declare const migrationSource: AnyMutableObject;
expectTypeOf(foundry.abstract.DataModel.migrateData(migrationSource)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(foundry.abstract.DataModel.migrateData(migrationSource, {})).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  foundry.abstract.DataModel.migrateData(migrationSource, { partial: true, source: {} }),
).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  foundry.abstract.DataModel.migrateDataSafe(migrationSource, { partial: true }),
).toEqualTypeOf<AnyMutableObject>();

// @ts-expect-error `notAnOption` is not a member of `DataModel.MigrateDataOptions`
foundry.abstract.DataModel.migrateData(migrationSource, { notAnOption: true });

// An override on a Document takes the same options, so a subclass override compiles.
expectTypeOf(
  foundry.documents.BaseItem.migrateData(migrationSource, { partial: true }),
).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(foundry.documents.BaseToken.migrateData(migrationSource, {})).toEqualTypeOf<AnyMutableObject>();
