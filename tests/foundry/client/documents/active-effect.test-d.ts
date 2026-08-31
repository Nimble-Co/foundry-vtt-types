import { expectTypeOf } from "vitest";
import type { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import { database, testID } from "../../../utils.ts";
import * as itemHelpers from "./item.test-d.ts";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;

const documentName = "ActiveEffect";
type SubType = ActiveEffect.SubType;
type Implementation = ActiveEffect.Implementation;
type OfType<Type extends SubType = SubType> = ActiveEffect.OfType<Type>;
type Stored<Type extends SubType = SubType> = ActiveEffect.Stored<Type>;
type Parent = ActiveEffect.Parent;
type Source = ActiveEffect.Source;
type CreateData<Type extends SubType = SubType> = ActiveEffect.CreateData<Type>;
type CreateInput = ActiveEffect.CreateInput;
type UpdateData = ActiveEffect.UpdateData;
type UpdateInput = ActiveEffect.UpdateInput;
type ConstructionContext = ActiveEffect.ConstructionContext;

const docsToCleanUp = new Set<foundry.documents.abstract.ClientDocumentMixin.AnyMixed>();

/** The parent document that runtime tests in this file will use. */
const parent = await Item.create(itemHelpers.source);
if (!parent) throw new Error("Couldn't create test Item");
expectTypeOf(parent).toEqualTypeOf<Item.Stored>();
docsToCleanUp.add(parent);

export function isStored<Type extends SubType>(doc: OfType<Type> | Stored<Type>): doc is Stored<Type> {
  if (!doc.id) return false;
  if (!doc.collection) return false;
  if (doc.collection instanceof Document) return doc.collection.id === doc.id;
  if (doc.collection instanceof CompendiumCollection) return doc.collection.index.has(doc.id);
  return doc.collection.has(doc.id);
}

export function isOfType<Type extends SubType>(doc: Implementation, type: Type): doc is OfType<Type> {
  return doc.type === type;
}

export const source = {
  _id: testID,
  name: "Add Suffix", // necessary for construction
  img: "icons/magic/symbols/star-yellow.webp",
  type: "base",
  system: {},
  disabled: true,
  start: null,
  duration: {
    value: 300,
    units: "seconds",
    expiry: "turnStart",
    expired: false,
  },
  description: "Add a suffix to your name",
  origin: "Item.cOdcNWy4hII029DT",
  tint: "#C8888C",
  transfer: true,
  statuses: ["invisible", "flying"],
  showIcon: 1,
  folder: null,
  sort: 7,
  flags: {
    core: {
      overlay: true,
    },
  },
  _stats: {
    coreVersion: "13.348",
    systemId: "universal-tabletop-system",
    systemVersion: "1.0.1",
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
    compendiumSource: "Compendium.mysystem.pack-id.Item.YYYYYSomeIDYYYYY.ActiveEffect.ZZZZZSomeIDZZZZZ",
    duplicateSource: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
    exportSource: null,
  },
} as const satisfies Source;

export const minimalCreateData = {
  name: `FVTT-Types Test ${documentName}`,
} satisfies CreateData;

export const nullishCreateData = {
  _id: null,
  ...minimalCreateData, // necessary for construction
  img: null,
  type: null,
  system: null,
  disabled: null,
  duration: {
    value: null,
    units: null,
    expiry: null,
    expired: null,
  },
  description: null,
  origin: null,
  tint: null,
  transfer: null,
  statuses: null,
  sort: null,
  flags: null,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: null,
    duplicateSource: null,
  },
} satisfies CreateData;

export const constructionContext = ({ parent = null }: { parent?: Parent } = {}) =>
  ({
    dropInvalidEmbedded: false,
    fallback: false,
    pack: null,
    parentCollection: "effects",
    strict: true,
    parent,
  }) satisfies ConstructionContext;

/** Keys added to this Document's base `CreateOperation`. */
const docCreateOpProps = {
  animate: true,
  restoreDelta: false,
};

/** The update props are composed like this because `PreUpdateOptions` explicitly omits `restoreDelta` */
const _docUpdateProps = {
  animate: true,
};

const docUpdateOpProps = {
  ..._docUpdateProps,
  restoreDelta: false,
};

const docDeleteOpProps = {
  animate: true,
};

export const operations = {
  getDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.getDocumentsOperationBase,
      parent,
    }) satisfies ActiveEffect.Database.GetDocumentsOperation,

  backendGetOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.backendGetOperationBase,
      parent,
    }) satisfies ActiveEffect.Database.BackendGetOperation,

  // -----------------

  createEmbeddedOperation: () =>
    ({
      ...database.createEmbeddedOperationBase,
      ...docCreateOpProps,
    }) satisfies ActiveEffect.Database.CreateEmbeddedOperation,

  createDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.createDocumentsOperationBase,
      ...docCreateOpProps,
      parent, // actual creation requires a parent on v13, where AEs are not yet primary documents
    }) satisfies ActiveEffect.Database.CreateDocumentsOperation,

  minimalBackendCreateOperation: ({ data, parent = null }: { data: CreateInput[]; parent?: Parent }) =>
    ({
      data,
      parent,
    }) satisfies ActiveEffect.Database.BackendCreateOperation,

  backendCreateOperation: ({ data, parent = null }: { data: CreateInput[]; parent?: Parent }) =>
    ({
      ...database.createDocumentsOperationBase,
      ...docCreateOpProps,
      data,
      parent,
    }) satisfies ActiveEffect.Database.BackendCreateOperation,

  minimalPreCreateOptions: () =>
    ({
      ...database.minimalPreCreateOptionsBase,
    }) satisfies ActiveEffect.Database.PreCreateOptions,

  preCreateOptions: () =>
    ({
      ...database.preCreateOptionsBase,
      ...docCreateOpProps,
    }) satisfies ActiveEffect.Database.PreCreateOptions,

  minimalPreCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.minimalPreCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.PreCreateOperation,

  preCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.preCreateOperationBase,
      ...docCreateOpProps,
      data,
      parent,
    }) satisfies ActiveEffect.Database.PreCreateOperation,

  minimalOnCreateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.minimalOnCreateOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOptions,

  onCreateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.onCreateOptionsBase,
      ...docCreateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOptions,

  minimalOnCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.minimalOnCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOperation,

  onCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...docCreateOpProps,
      ...database.onCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOperation,

  // -----------------

  updateOneDocumentsOperation: () =>
    ({
      ...database.updateOneDocumentOperationBase,
      ...docUpdateOpProps,
    }) satisfies ActiveEffect.Database.UpdateOneDocumentOperation,

  updateEmbeddedOperation: () =>
    ({
      ...database.updateEmbeddedOperationBase,
      ...docUpdateOpProps,
    }) satisfies ActiveEffect.Database.UpdateEmbeddedOperation,

  updateManyDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.updateManyDocumentsOperationBase,
      ...docUpdateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.UpdateManyDocumentsOperation,

  minimalBackendUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateInput[] }) =>
    ({
      parent,
      updates,
    }) satisfies ActiveEffect.Database.BackendUpdateOperation,

  backendUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateInput[] }) =>
    ({
      ...database.updateManyDocumentsOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.BackendUpdateOperation,

  minimalPreUpdateOptions: () =>
    ({ ...database.minimalPreUpdateOptionsBase }) satisfies ActiveEffect.Database.PreUpdateOptions,

  preUpdateOptions: () =>
    ({ ...database.preUpdateOptionsBase, ..._docUpdateProps }) satisfies ActiveEffect.Database.PreUpdateOptions,

  minimalPreUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.minimalPreUpdateOperationBase,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.PreUpdateOperation,

  preUpdateOperation: ({ parent = null, updates }: { updates: UpdateData[]; parent?: Parent }) =>
    ({
      ...database.preUpdateOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.PreUpdateOperation,

  minimalOnUpdateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.minimalOnUpdateOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnUpdateOptions,

  onUpdateOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.onUpdateOptionsBase,
      ...docUpdateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnUpdateOptions,

  minimalOnUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.minimalOnUpdateOperationBase,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.OnUpdateOperation,

  onUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.onUpdateOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.OnUpdateOperation,

  // -----------------

  deleteOneDocumentOperation: () =>
    ({
      ...database.deleteOneDocumentOperationBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.DeleteOneDocumentOperation,

  deleteEmbeddedOperation: () =>
    ({
      ...database.deleteEmbeddedOperationBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.DeleteEmbeddedOperation,

  deleteManyDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.deleteManyDocumentsOperationBase,
      ...docDeleteOpProps,
      parent,
    }) satisfies ActiveEffect.Database.DeleteManyDocumentsOperation,

  minimalBackendDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ids,
      parent,
    }) satisfies ActiveEffect.Database.BackendDeleteOperation,

  backendDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.backendDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.BackendDeleteOperation,

  minimalPreDeleteOptions: () =>
    ({
      ...database.minimalPreDeleteOptionsBase,
    }) satisfies ActiveEffect.Database.PreDeleteOptions,

  preDeleteOptions: () =>
    ({
      ...database.preDeleteOptionsBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.PreDeleteOptions,

  minimalPreDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.minimalPreDeleteOperationBase,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.PreDeleteOperation,

  preDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.preDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.PreDeleteOperation,

  minimalOnDeleteOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.minimalOnDeleteOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOptions,

  onDeleteOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.onDeleteOptionsBase,
      ...docDeleteOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOptions,

  minimalOnDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.minimalOnDeleteOperationBase,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOperation,

  onDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.onDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOperation,
};

export const realSource = {
  _id: "R5ro4AuNjcdWD56O",
  disabled: false,
  start: null,
  duration: {
    value: null,
    units: "seconds",
    expiry: null,
    expired: false,
  },
  origin: "Item.cOdcNWy4hII029DT",
  showIcon: 0,
  folder: null,
  transfer: true,
  flags: {},
  tint: "#ffffff",
  name: "Unarmored Defense",
  description: "",
  statuses: [],
  _stats: {
    createdTime: 1252345,
    modifiedTime: 13245234623624,
    compendiumSource: null,
    duplicateSource: null,
    exportSource: null,
    coreVersion: "13.348",
    systemId: "dnd5e",
    systemVersion: "5.2.3",
    lastModifiedBy: null,
  },
  img: "icons/magic/control/silhouette-hold-change-blue.webp",
  type: "base",
  system: {},
  sort: 0,
} as const satisfies Source;

export const maximumSource = {
  _id: "R5ro4AuNjcdWD56O",
  disabled: false,
  start: {
    combat: "CCCCCSomeIDCCCCC",
    combatant: "BBBBBSomeIDBBBBB",
    initiative: 17,
    round: 1,
    turn: 3,
    time: 1700000,
  },
  duration: {
    value: 12,
    units: "seconds",
    expiry: "turnStart",
    expired: false,
  },
  showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS,
  folder: null,
  origin: "Item.cOdcNWy4hII029DT",
  transfer: true,
  flags: {
    core: {
      overlay: true,
    },
  },
  tint: "#FEDCBA",
  name: "A Name",
  description: "Some Text",
  _stats: {
    systemVersion: null,
    compendiumSource: null,
    coreVersion: null,
    createdTime: 0,
    modifiedTime: 1,
    duplicateSource: null,
    exportSource: null,
    lastModifiedBy: "UserID",
    systemId: null,
  },
  img: null,
  sort: 0,
  statuses: [],
  system: {},
  type: "base",
} as const satisfies Source;

// @ts-expect-error ActiveEffect requires name.
new ActiveEffect.implementation();

// @ts-expect-error ActiveEffect requires name.
new ActiveEffect.implementation({});

declare const model: DataModel.Any;
declare const change: ActiveEffect.ChangeData;
declare const aeContext: Document.ConstructionContext<ActiveEffect.Parent>;

// Static methods native to this Document

expectTypeOf(ActiveEffect.fromStatusEffect("flying")).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", {})).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", aeContext)).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();

const createData = {
  name: "foo",
  disabled: true,
};

expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData)).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, {})).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, aeContext)).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();

declare const sf: foundry.data.fields.StringField;
declare const nf: foundry.data.fields.NumberField;
declare const edf: foundry.data.fields.EmbeddedDataField<typeof foundry.data.LightData>;

declare const targetDoc: Actor.Implementation;

// v14: the change-application family is now static, taking the target Document first.
expectTypeOf(ActiveEffect.applyChange(targetDoc, change)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(ActiveEffect.applyChange(targetDoc, change, {})).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  ActiveEffect.applyChange(targetDoc, change, { replacementData: {}, modifyTarget: false }),
).toEqualTypeOf<AnyMutableObject>();

expectTypeOf(ActiveEffect.applyChangeField(targetDoc, change)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyChangeField(targetDoc, change, { field: sf })).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyChangeField(targetDoc, change, { field: undefined })).toEqualTypeOf<unknown>();

expectTypeOf(ActiveEffect["_applyChangeUnguided"](targetDoc, change, {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeUnguided"](model, change, {}, { modifyTarget: true })).toBeVoid();

expectTypeOf(ActiveEffect["_replaceDataRefs"]("foo", {})).toEqualTypeOf<string | null>();

expectTypeOf(ActiveEffect["_applyChangeAdd"](targetDoc, change, 5, 1, {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeSubtract"](targetDoc, change, 5, 1, {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeMultiply"](targetDoc, change, 2, 4, {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeOverride"](targetDoc, change, "foo", "bar", {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeUpgrade"](targetDoc, change, 5, 9, {})).toBeVoid();
expectTypeOf(ActiveEffect["_applyChangeCustom"](targetDoc, change, { baz: 17 }, { fizz: false }, {})).toBeVoid();

expectTypeOf(ActiveEffect.getEffectStart()).toEqualTypeOf<ActiveEffect.EffectStartData>();
expectTypeOf(ActiveEffect.getEffectStart(null)).toEqualTypeOf<ActiveEffect.EffectStartData>();

/* eslint-disable @typescript-eslint/no-deprecated -- exercising the v14 deprecation shims */
expectTypeOf(ActiveEffect.applyField(model, change)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyField(model, change, null)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyField(model, change, sf)).toEqualTypeOf<string | undefined>();
expectTypeOf(ActiveEffect.applyField(model, change, nf)).toEqualTypeOf<number | undefined | null>();
expectTypeOf(ActiveEffect.applyField(model, change, edf)).toEqualTypeOf<foundry.data.LightData>();

expectTypeOf(ActiveEffect.getInitialDuration()).toEqualTypeOf<ActiveEffect.GetInitialDurationReturn>();
/* eslint-enable @typescript-eslint/no-deprecated */

// ClientDocument static overrides

declare const someItem: Item.Implementation;

// @ts-expect-error `defaultName` requires a `pack` or `parent`.
ActiveEffect.defaultName();

expectTypeOf(ActiveEffect.defaultName({ pack: "some.pack", parent: someItem, type: "base" })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: undefined, parent: undefined, type: undefined })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: null, parent: null, type: undefined })).toBeString();

// Note: this call will fail at runtime but a validator function to require `pack` or `parent` has not yet been written.
expectTypeOf(ActiveEffect.defaultName({})).toBeString();

// @ts-expect-error `ActiveEffect.createDialog` requires `createOptions` for pack information.
await ActiveEffect.createDialog({});

declare const someActor: Actor.Implementation;
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(
    createData,
    {
      parent: someActor,
      pack: "some.pack",
    },
    {
      // TODO: add mock subtypes so this has valid values to test ("base" is excluded)
      //types: [],
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
      pack: undefined,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(createData, {
    parent: someActor,
    pack: null,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
// v14: `createDialog` accepts a fourth `renderOptions` argument forwarded to the created document's sheet render.
expectTypeOf(ActiveEffect.createDialog(createData, { parent: someActor }, {}, { force: true })).toEqualTypeOf<
  Promise<ActiveEffect.Stored | null>
>();

declare const aeSource: ActiveEffect.Source;
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    uuid: "someUUID", // TODO: This should be allowed
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();

expectTypeOf(ActiveEffect.fromImport(aeSource)).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromImport(aeSource, {})).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: true,
    fallback: true,
    pack: "some.pack",
    parent: someItem,
    parentCollection: "effects",
    strict: true,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: undefined,
    fallback: undefined,
    pack: undefined,
    parent: undefined,
    parentCollection: undefined,
    // strict not allowed to be undefined,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: null,
    fallback: null,
    pack: null,
    parent: null,
    parentCollection: null,
    strict: false,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();

// Instance methods native to this Document

const effect = new ActiveEffect.implementation({ name: "My effect" });
expectTypeOf(effect).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(effect.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(effect.item).toEqualTypeOf<Item.Implementation | null>();
expectTypeOf(effect.thumbnail).toEqualTypeOf<string>();

expectTypeOf(effect.isSuppressed).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.isSuppressed = false;

expectTypeOf(effect.target).toEqualTypeOf<Document.Any | null>();
// @ts-expect-error Only getter, no setter
effect.target = null;

expectTypeOf(effect.active).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.active = false;

expectTypeOf(effect.modifiesActor).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.modifiesActor = false;

expectTypeOf(effect.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(effect.prepareDerivedData()).toEqualTypeOf<void>();

expectTypeOf(effect.updateDuration()).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect.updateDuration({})).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect.isExpiryTrackable).toEqualTypeOf<boolean>();
expectTypeOf(effect.isExpiryEvent("turnEnd")).toEqualTypeOf<boolean>();
expectTypeOf(ActiveEffect.registry).toEqualTypeOf<foundry.helpers.ActiveEffectRegistry>();

declare const someDuration: ActiveEffect.DurationData;
expectTypeOf(effect["_prepareDuration"]()).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect["_prepareDuration"](someDuration)).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect["_prepareDuration"](someDuration, {})).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect["_prepareTimeBasedDuration"](someDuration)).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect["_prepareCombatBasedDuration"](someDuration, {})).toEqualTypeOf<ActiveEffect.Duration>();

expectTypeOf(effect.isTemporary).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.isTemporary = false;

expectTypeOf(effect.sourceName).toEqualTypeOf<string>();
// @ts-expect-error Only getter, no setter
effect.sourceName = "foo";

// Added in v14.367
expectTypeOf(effect.shouldApplyChange(change)).toEqualTypeOf<boolean>();
expectTypeOf(effect.shouldApplyChange(change, {})).toEqualTypeOf<boolean>();
expectTypeOf(effect.shouldApplyChange(change, { phase: "initial" })).toEqualTypeOf<boolean>();
expectTypeOf(
  effect.shouldApplyChange(change, { phase: undefined, replacementData: { abilities: {} } }),
).toEqualTypeOf<boolean>();

// `replacementData` is an object, despite Foundry's `{string}` JSDoc tag
// @ts-expect-error `replacementData` is not a string
effect.shouldApplyChange(change, { replacementData: "not an object" });

expectTypeOf(effect.getReplacementData({ abilities: {} })).toEqualTypeOf<AnyObject>();

// @ts-expect-error `baseData` is required
effect.getReplacementData();

/* eslint-disable @typescript-eslint/no-deprecated -- exercising the v14 instance deprecation shims */
expectTypeOf(effect.apply(someActor, change)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(effect["_applyLegacy"](someActor, change, {})).toBeVoid();

expectTypeOf(effect["_applyAdd"](someActor, change, 5, 1, {})).toBeVoid();
expectTypeOf(effect["_applyMultiply"](someActor, change, 2, 4, {})).toBeVoid();
expectTypeOf(effect["_applyOverride"](someActor, change, "foo", "bar", {})).toBeVoid();
expectTypeOf(effect["_applyUpgrade"](someActor, change, 5, 9, {})).toBeVoid();
expectTypeOf(effect["_applyCustom"](someActor, change, { baz: 17 }, { fizz: false }, {})).toBeVoid();
/* eslint-enable @typescript-eslint/no-deprecated */

// getFlag override has no type changes, handled in BaseActiveEffect tests

expectTypeOf(effect["_displayScrollingStatus"](true)).toBeVoid();

// ClientDocument instance override(s)

declare const mEvent: MouseEvent;
expectTypeOf(effect._onClickDocumentLink(mEvent)).toEqualTypeOf<ClientDocument.OnClickDocumentLinkReturn>();
