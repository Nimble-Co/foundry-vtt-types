import type { ConfiguredActiveEffect } from "#configuration";
import type { AnyMutableObject, AnyObject, Identity, InterfaceToObject, MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DataModel, DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseActiveEffect, BaseCombat, BaseCombatant, BaseFolder } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

declare namespace ActiveEffect {
  /**
   * The document's name.
   */
  type Name = "ActiveEffect";

  /**
   * The context used to create an `ActiveEffect`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ActiveEffect`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActiveEffect` document instance configured through
   * {@linkcode CONFIG.ActiveEffect.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredActiveEffect | fvtt-types/configuration/ConfiguredActiveEffect} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActiveEffect` document configured through
   * {@linkcode CONFIG.ActiveEffect.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActiveEffect";
      collection: "effects";
      hasTypeData: true;
      baseTypeAllowed: true;
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      label: "DOCUMENT.ActiveEffect";
      labelPlural: "DOCUMENT.ActiveEffects";
      schemaVersion: "14.353";
      permissions: Metadata.Permissions;
    }>
  > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `ActiveEffect`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.ActiveEffect.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"ActiveEffect">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"ActiveEffect">;

  /**
   * `Known` represents the types of `ActiveEffect` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = ActiveEffect.OfType<ActiveEffect.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `ActiveEffect` with the corresponding type. This works with both the
   * builtin `ActiveEffect` class or a custom subclass if that is set up in
   * {@linkcode ConfiguredActiveEffect | fvtt-types/configuration/ConfiguredActiveEffect}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredActiveEffect<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          ActiveEffect<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ActiveEffect` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.Implementation | Item.Implementation | null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type Descendant = never;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = never;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `ActiveEffect` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ActiveEffect` that comes from the database.
   */
  type Stored<SubType extends ActiveEffect.SubType = ActiveEffect.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode ActiveEffect._source | ActiveEffect#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActiveEffect.create}
   * and {@linkcode ActiveEffect | new ActiveEffect(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode ActiveEffect.create} and {@linkcode ActiveEffect.createDocuments} signatures, and
   * {@linkcode ActiveEffect.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode ActiveEffect.create}, returning (a single | an array of) stored
   * `ActiveEffect`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>> =
    Data extends Array<CreateInput> ? Array<ActiveEffect.Stored> : ActiveEffect.Stored | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode ActiveEffect.name | ActiveEffect#name}.
   *
   * This is data transformed from {@linkcode ActiveEffect.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode ActiveEffect.update | ActiveEffect#update}.
   * It is a distinct type from {@linkcode ActiveEffect.CreateData | DeepPartial<ActiveEffect.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode ActiveEffect.update | ActiveEffect#update} and
   * {@linkcode ActiveEffect.updateDocuments} signatures, and {@linkcode ActiveEffect.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode ActiveEffect}. This is the source of truth for how an ActiveEffect document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActiveEffect}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of the ActiveEffect
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image path used to depict the ActiveEffect as an icon
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    type: fields.DocumentTypeField<typeof BaseActiveEffect, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseActiveEffect>;

    /**
     * Is this ActiveEffect currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * Data which describes when the ActiveEffect first started
     * @defaultValue `null`
     */
    start: fields.SchemaField<StartSchema, { nullable: true }>;

    /**
     * An ActiveEffect.DurationData object which describes the duration of the ActiveEffect
     */
    duration: fields.SchemaField<DurationSchema>;

    /**
     * The HTML text description for this ActiveEffect document.
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * A UUID reference to the document from which this ActiveEffect originated
     * @defaultValue `null`
     */
    // `DocumentUUIDField<Options>` derives its type via `StringField.InitializedType<Options>`, which does not
    // re-apply `DocumentUUIDField`'s own defaults, so the effective defaults are spelled out (cf. table-result).
    origin: fields.DocumentUUIDField<{ required: true; blank: false; nullable: true; initial: null; relative: true }>;

    /**
     * A color string which applies a tint to the ActiveEffect icon
     * @defaultValue `"#ffffff"`
     */
    tint: fields.ColorField<{ nullable: false; initial: "#ffffff" }>;

    /**
     * Does this ActiveEffect automatically transfer from an Item to an Actor?
     * @defaultValue `false`
     */
    transfer: fields.BooleanField<{ initial: true }>;

    /**
     * Special status IDs that pertain to this effect
     * @defaultValue `[]`
     */
    statuses: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * Configure whether the icon of this ActiveEffect is shown on the Token
     * @defaultValue `CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL`
     */
    showIcon: fields.NumberField<
      {
        required: true;
        nullable: false;
        choices: CONST.ACTIVE_EFFECT_SHOW_ICON[];
        initial: typeof CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL;
      },
      CONST.ACTIVE_EFFECT_SHOW_ICON | null | undefined,
      CONST.ACTIVE_EFFECT_SHOW_ICON,
      CONST.ACTIVE_EFFECT_SHOW_ICON
    >;

    /**
     * The _id of a Folder which contains this ActiveEffect
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof BaseFolder>;

    /**
     * The sort value
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;

    _stats: fields.DocumentStatsField;
  }

  interface StartSchema extends fields.DataSchema {
    /**
     * The `_id` of the {@linkcode Combat} in which the effect first started
     * @defaultValue `null`
     */
    combat: fields.ForeignDocumentField<typeof BaseCombat>;

    /**
     * The `_id` of the {@linkcode Combatant} which started the effect
     * @defaultValue `null`
     */
    combatant: fields.ForeignDocumentField<typeof BaseCombatant, { idOnly: true }>;

    /**
     * The initiative value of the Combatant at the time the effect first started
     * @defaultValue `null`
     */
    initiative: fields.NumberField<{ required: true }>;

    /**
     * The round of the CombatEncounter in which the effect first started
     * @defaultValue `null`
     */
    round: fields.NumberField<{ required: true; integer: true; min: 0 }>;

    /**
     * The turn of the CombatEncounter in which the effect first started
     * @defaultValue `null`
     */
    turn: fields.NumberField<{ required: true; integer: true; min: 0 }>;

    /**
     * The world time when the active effect first started
     * @defaultValue `null`
     */
    time: fields.NumberField<{ required: true; nullable: false; integer: true }>;
  }

  interface DurationSchema extends fields.DataSchema {
    /**
     * The maximum duration of the effect, in the units defined by {@linkcode DurationSchema.units | units}
     * @defaultValue `null`
     */
    value: fields.NumberField<{ required: true; nullable: true; integer: true; min: 0 }>;

    /**
     * The units in which the duration value is expressed
     * @defaultValue `"seconds"`
     */
    units: fields.StringField<{
      required: true;
      choices: typeof CONST.ACTIVE_EFFECT_DURATION_UNITS;
      initial: "seconds";
    }>;

    /**
     * The expiry event which causes the effect to be removed
     * @defaultValue `d => typeof d?.duration?.value === "number" ? "turnStart" : null`
     */
    expiry: fields.StringField<{ required: true; blank: false; nullable: true; initial: () => string | null }>;

    /**
     * Has the effect expired?
     * @defaultValue `false`
     */
    expired: fields.BooleanField;
  }

  interface DurationData extends fields.SchemaField.InitializedData<DurationSchema> {}

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `ActiveEffect` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<ActiveEffect.Parent> {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation extends DatabaseBackend.CreateOperation<ActiveEffect.CreateInput, ActiveEffect.Parent> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onCreate | ActiveEffect#_onCreate} is prevented.
       */
      animate?: boolean;

      /**
       * @remarks This property is not intended to be passed by user code, this is a signal to various parts of the database code that this
       * operation is restoring some or all of the data on a {@link TokenDocument.actor | synthetic token actor} to match its
       * {@link TokenDocument.baseActor | base actor}, moderated by its {@linkcode ActorDelta}.
       *
       * It can appear in the `CreateOperation`s and `UpdateOperation`s of any documents with an associated
       * {@linkcode fields.EmbeddedCollectionDeltaField} in the {@linkcode ActorDelta.Schema}, via
       * {@linkcode foundry.abstract.EmbeddedCollectionDelta.restoreDocuments | EmbeddedCollectionDelta#restoreDocuments}.
       */
      restoreDelta?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.create} or {@linkcode ActiveEffect.createDocuments}.
     * @see {@linkcode Document.Database.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation extends Document.Database.CreateDocumentsOperation<CreateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents. (see {@linkcode ActiveEffect.Parent})
     * @see {@linkcode Document.Database.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation extends Document.Database.BackendCreateOperation<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preCreate | ActiveEffect#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preCreateOperation}.
     * @see {@linkcode Document.Database.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation extends Document.Database.PreCreateOperation<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onCreate | ActiveEffect#_onCreate} and
     * {@link Hooks.CreateDocument | the `createActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onCreateOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.update | ActiveEffect#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<ActiveEffect.UpdateInput, ActiveEffect.Parent> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onUpdate | ActiveEffect#_onUpdate} is prevented.
       */
      animate?: boolean;

      /**
       * @remarks This property is not intended to be passed by user code, this is a signal to various parts of the database code that this
       * operation is restoring some or all of the data on a {@link TokenDocument.actor | synthetic token actor} to match its
       * {@link TokenDocument.baseActor | base actor}, moderated by its {@linkcode ActorDelta}.
       *
       * It can appear in the `CreateOperation`s and `UpdateOperation`s of any documents with an associated
       * {@linkcode fields.EmbeddedCollectionDeltaField} in the {@linkcode ActorDelta.Schema}, via
       * {@linkcode foundry.abstract.EmbeddedCollectionDelta.restoreDocuments | EmbeddedCollectionDelta#restoreDocuments}.
       */
      restoreDelta?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.update | ActiveEffect#update}.
     * @see {@linkcode Document.Database.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents (see {@linkcode ActiveEffect.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.updateDocuments}.
     * @see {@linkcode Document.Database.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preUpdate | ActiveEffect#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preUpdateOperation}.
     * @see {@linkcode Document.Database.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onUpdate | ActiveEffect#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onUpdateOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.delete | ActiveEffect#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<ActiveEffect.Parent> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onDelete | ActiveEffect#_onDelete} is prevented.
       */
      animate?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.delete | ActiveEffect#delete}.
     * @see {@linkcode Document.Database.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents (see {@linkcode ActiveEffect.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.deleteDocuments}.
     * @see {@linkcode Document.Database.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preDelete | ActiveEffect#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preDeleteOperation}.
     * @see {@linkcode Document.Database.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onDelete | ActiveEffect#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onDeleteOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap {
        GetDocumentsOperation: ActiveEffect.Database.GetDocumentsOperation;
        BackendGetOperation: ActiveEffect.Database.BackendGetOperation;
        GetOperation: ActiveEffect.Database.GetOperation;

        CreateDocumentsOperation: ActiveEffect.Database.CreateDocumentsOperation;
        CreateEmbeddedOperation: ActiveEffect.Database.CreateEmbeddedOperation;
        BackendCreateOperation: ActiveEffect.Database.BackendCreateOperation;
        CreateOperation: ActiveEffect.Database.CreateOperation;
        PreCreateOptions: ActiveEffect.Database.PreCreateOptions;
        PreCreateOperation: ActiveEffect.Database.PreCreateOperation;
        OnCreateOptions: ActiveEffect.Database.OnCreateOptions;
        OnCreateOperation: ActiveEffect.Database.OnCreateOperation;

        UpdateOneDocumentOperation: ActiveEffect.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: ActiveEffect.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: ActiveEffect.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: ActiveEffect.Database.BackendUpdateOperation;
        UpdateOperation: ActiveEffect.Database.UpdateOperation;
        PreUpdateOptions: ActiveEffect.Database.PreUpdateOptions;
        PreUpdateOperation: ActiveEffect.Database.PreUpdateOperation;
        OnUpdateOptions: ActiveEffect.Database.OnUpdateOptions;
        OnUpdateOperation: ActiveEffect.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: ActiveEffect.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: ActiveEffect.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: ActiveEffect.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: ActiveEffect.Database.BackendDeleteOperation;
        DeleteOperation: ActiveEffect.Database.DeleteOperation;
        PreDeleteOptions: ActiveEffect.Database.PreDeleteOptions;
        PreDeleteOperation: ActiveEffect.Database.PreDeleteOperation;
        OnDeleteOptions: ActiveEffect.Database.OnDeleteOptions;
        OnDeleteOperation: ActiveEffect.Database.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in a future version.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in a future version.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in a future version.  */
    type Create = CreateOperation;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in a future version.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in a future version.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in a future version */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in a future version */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in a future version */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in a future version */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in a future version */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in a future version. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  /**
   * The flags provided by Foundry itself for this document.
   */
  interface CoreFlags {
    core?: { overlay?: boolean };
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode ActiveEffect.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode ActiveEffect.fromDropData}
   * signature that has since been removed. This type will be removed in a future version.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode ActiveEffect.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions
    extends Database.CreateDocumentsOperation, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode ActiveEffect.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  type CreateDialogReturn<Config extends ActiveEffect.CreateDialogOptions | undefined> = Document.CreateDialogReturn<
    ActiveEffect.Stored,
    Config
  >;

  /**
   * The return type for {@linkcode ActiveEffect.deleteDialog | ActiveEffect#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<Config extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    ActiveEffect.Stored,
    Config
  >;

  /* ***********************************************
   *         ACTIVE-EFFECT-SPECIFIC TYPES          *
   *************************************************/

  /**
   * @deprecated since v14, until v16 — the duration "type" concept was removed; use
   * {@linkcode DurationData.units | ActiveEffectDuration#units} instead.
   */
  type DurationType = "seconds" | "turns" | "none";

  /**
   * The prepared duration data produced by {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}.
   * Corresponds to Foundry's `ActiveEffectDuration` typedef (`EffectDurationData & _ActiveEffectDuration`).
   */
  interface Duration extends DurationData {
    /** The total duration in seconds */
    seconds: number | null;

    /** The remaining effect duration in a quantity of the configured unit */
    remaining: number;

    /** The remaining effect duration in seconds, given it is possible to express */
    secondsRemaining?: number;

    /** A formatted string label that represents the remaining duration */
    label: string;

    /** An internal flag used determine when to recompute seconds-based duration */
    _worldTime?: number;

    /** An internal flag used determine when to recompute turns-based duration */
    _combatTime?: number;

    /**
     * @deprecated since v14, until v16 — `ActiveEffectDuration#type` is now at
     * {@linkcode DurationData.units | ActiveEffectDuration#units}.
     * @remarks Defined as a runtime getter by {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}.
     */
    type: string;

    /**
     * @deprecated since v14, until v16 — `ActiveEffectDuration#duration` is now at
     * {@linkcode Duration.seconds | ActiveEffectDuration#seconds}.
     * @remarks Defined as a runtime getter by {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}.
     */
    duration: number | null;
  }

  /**
   * Contextual information passed to {@linkcode ActiveEffect.isExpiryEvent | ActiveEffect#isExpiryEvent} and
   * {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}.
   */
  interface IsExpiryEventContext {
    /** The Combat associated with this event. */
    combat?: Combat.Implementation | null | undefined;
  }

  /**
   * The start data produced by {@linkcode ActiveEffect.getEffectStart}. Corresponds to Foundry's
   * `EffectStartData` typedef.
   */
  interface EffectStartData extends fields.SchemaField.SourceData<StartSchema> {}

  /**
   * The return of the deprecated {@linkcode ActiveEffect.getInitialDuration} shim, which now wraps
   * {@linkcode ActiveEffect.getEffectStart}.
   */
  interface GetInitialDurationReturn {
    start: EffectStartData;
  }

  /**
   * A single change applied by an `ActiveEffect`. Corresponds to Foundry's `ActiveEffectChangeData`
   * (`EffectChangeData & _ActiveEffectChangeData`).
   */
  interface ChangeData {
    /**
     * The parent Effect, populated during data preparation.
     */
    effect?: ActiveEffect.Implementation | undefined;

    // TODO (@LukeAbby): `undefined` is not valid. We can't pull directly from the schema because this interface is used inside of field methods.

    /**
     * The attribute path in the Actor or Item data which the change modifies
     * @defaultValue `""`
     */
    key: string;

    /**
     * The value of the change effect
     * @defaultValue `""`
     */
    value: string;

    /**
     * The modification type of this change — a key of {@linkcode ActiveEffect.CHANGE_TYPES} (e.g. `"add"`).
     * @remarks Replaces v13's numeric `mode`.
     */
    type: string;

    /**
     * The application phase under which this change is applied. Each phase is its own priority group; that is,
     * application of a change in an earlier phase will occur before a change in a later phase, regardless of priority.
     */
    phase: string;

    /**
     * The order in which this change is applied among other changes in a common phase. A `null` value is
     * initialized to its default priority.
     * @defaultValue `null`
     */
    priority: number | null;
  }

  type ApplyFieldReturn<Field extends fields.DataField.Any | null | undefined> = Field extends fields.DataField.Any
    ? fields.DataField.InitializedTypeFor<Field>
    : unknown;

  /** A document type to which an `ActiveEffect` change can be applied. */
  type ChangeTarget = Actor.Implementation | Item.Implementation | TokenDocument.Implementation;

  /**
   * Options for {@linkcode ActiveEffect.shouldApplyChange | ActiveEffect#shouldApplyChange}.
   */
  interface ShouldApplyChangeOptions {
    /** The application phase currently being evaluated. */
    phase?: string | undefined;

    /**
     * Replacement data to be used as part of the change's application.
     *
     * @remarks Foundry documents this parameter as `{string}`, but the description says "Replacement data"
     * and {@linkcode Actor.applyActiveEffects | Actor#applyActiveEffects} passes the return value of
     * {@linkcode ActiveEffect.getReplacementData | ActiveEffect#getReplacementData}, which is an object.
     * The `{string}` tag is a defect in the Foundry source.
     */
    replacementData?: AnyObject | undefined;
  }

  /**
   * Options for {@linkcode ActiveEffect.applyChange}.
   */
  interface ApplyChangeOptions {
    /** Data used to resolve `@` expressions in a string value */
    replacementData?: AnyObject | undefined;

    /**
     * Modify the target Document with the updated value.
     * @defaultValue `true`
     */
    modifyTarget?: boolean | undefined;
  }

  /**
   * Options for {@linkcode ActiveEffect.applyChangeField}.
   */
  interface ApplyChangeFieldOptions extends ApplyChangeOptions {
    /** The field. If not supplied, it will be retrieved from the supplied Document. */
    field?: fields.DataField.Any | undefined;
  }

  /**
   * A function that applies a change to a document, configured via
   * {@linkcode CONFIG.ActiveEffectChangeTypeConfig.handler}. Corresponds to Foundry's `ActiveEffectChangeHandler`
   * callback.
   */
  type ChangeHandler = (
    targetDoc: ChangeTarget,
    change: ChangeData,
    options?: ApplyChangeFieldOptions,
  ) => Promise<AnyMutableObject | void>;

  /**
   * Contextual data passed to a {@linkcode ChangeRenderer}.
   */
  interface ChangeRendererContext {
    /** A copy of the change from the ActiveEffect's source array */
    change: AnyObject;

    /** The object's index in the changes Array */
    index: number;

    fields: fields.DataSchema;

    /** The change type's default priority */
    defaultPriority: number;
  }

  /**
   * A function that renders a stringified `HTMLLIElement` in the changes tab of `ActiveEffectConfig`, configured via
   * {@linkcode CONFIG.ActiveEffectChangeTypeConfig.render}. Corresponds to Foundry's `ActiveEffectChangeRenderer`
   * callback.
   */
  type ChangeRenderer = (context: ChangeRendererContext) => Promise<string>;

  /**
   * The cached, compiled change-phase configuration returned by {@linkcode ActiveEffect.CHANGE_PHASES}.
   */
  interface ChangePhaseConfig {
    label: string;

    hint: string;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in a future version.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode ActiveEffect.ConfiguredSubType} (will be removed in a future version).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
 * Each ActiveEffect belongs to the effects collection of its parent Document.
 * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
 *
 * @see {@linkcode ActiveEffectData}          The ActiveEffect data schema
 * @see {@linkcode Actor}                     The Actor document which contains ActiveEffect embedded documents
 * @see {@linkcode Item}                      The Item document which contains ActiveEffect embedded documents
 */
declare class ActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends BaseActiveEffect
  .Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActiveEffect`
   * @param context - Construction context options
   */
  constructor(data: ActiveEffect.CreateData<SubType>, context?: ActiveEffect.ConstructionContext);

  /**
   * Create an ActiveEffect instance from some status effect ID.
   * Delegates to {@linkcode ActiveEffect._fromStatusEffect} to create the ActiveEffect instance
   * after creating the ActiveEffect data from the status effect data if `CONFIG.statusEffects`.
   * @param statusId - The status effect ID.
   * @param options  - Additional options to pass to the ActiveEffect constructor.
   * @returns The created ActiveEffect instance.
   *
   * @throws An error if there is no status effect in `CONFIG.statusEffects` with the given status ID and if
   * the status has implicit statuses but doesn't have a static _id.
   */
  static fromStatusEffect(
    statusId: string,
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * Create an ActiveEffect instance from status effect data.
   * Called by {@linkcode ActiveEffect.fromStatusEffect}.
   * @param statusId   - The status effect ID.
   * @param effectData - The status effect data.
   * @param options    - Additional options to pass to the ActiveEffect constructor.
   * @returns The created ActiveEffect instance.
   *
   * @remarks Core's implementation doesn't use `statusId`, simply returning `new this(effectData, options)`
   */
  protected static _fromStatusEffect(
    statusId: string,
    effectData: ActiveEffect.CreateData,
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * A cached compilation of core and registered application phases, along with their labels.
   */
  static get CHANGE_PHASES(): Record<string, ActiveEffect.ChangePhaseConfig>;

  /**
   * A cached compilation of core and registered change types, along with their labels and default priorities.
   */
  static get CHANGE_TYPES(): Record<string, CONFIG.ActiveEffectChangeTypeConfig>;

  /**
   * A cached compilation of core and registered expiry events.
   */
  static get EXPIRY_EVENTS(): Record<string, string>;

  /**
   * A helper that accepts registration of ActiveEffects and manages their prepared duration and expiry data.
   */
  static registry: foundry.helpers.ActiveEffectRegistry;

  /**
   * The Actor in which this ActiveEffect is embedded, either directly or as a grandchild Document.
   */
  get actor(): Actor.Implementation | null;

  /**
   * The Item in which this ActiveEffect is embedded.
   */
  get item(): Item.Implementation | null;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string;

  /**
   * Is there some system logic that makes this active effect ineligible for application?
   * @remarks Core's implementation defers to `system.isSuppressed` on a `TypeDataModel`, else `false`. As such all overrides should begin with `if (super.isSuppressed) return true;`
   */
  get isSuppressed(): boolean;

  /**
   * Retrieve the Document that this ActiveEffect targets for modification.
   */
  get target(): Document.Any | null;

  /**
   * Whether the Active Effect currently applying its changes to the target.
   */
  get active(): boolean;

  /**
   *  Does this Active Effect currently modify an Actor?
   */
  get modifiesActor(): boolean;

  override prepareDerivedData(): void;

  /**
   * Update derived Active Effect duration data.
   * @param context - Contextual information indicating what lead to this call
   */
  updateDuration(context?: ActiveEffect.IsExpiryEventContext): ActiveEffect.Duration;

  /**
   * Compute derived data related to active effect duration.
   * @param duration - Unprepared duration data
   * @param context  - Contextual information indicating what lead to this call
   */
  protected _prepareDuration(
    duration?: ActiveEffect.DurationData,
    context?: ActiveEffect.IsExpiryEventContext,
  ): ActiveEffect.Duration;

  /**
   * Prepare duration data from time-based (minutes, seconds, etc.) source data.
   * @param duration - Unprepared duration data
   * @param context  - Contextual information indicating what lead to this call
   */
  protected _prepareTimeBasedDuration(
    duration: ActiveEffect.DurationData,
    context?: ActiveEffect.IsExpiryEventContext,
  ): ActiveEffect.Duration;

  /**
   * Prepare duration data from combat-based (rounds or turns) source data.
   * @param duration - Unprepared duration data
   * @param context  - Contextual information indicating what lead to this call
   */
  protected _prepareCombatBasedDuration(
    duration: ActiveEffect.DurationData,
    context?: ActiveEffect.IsExpiryEventContext,
  ): ActiveEffect.Duration;

  /**
   * Describe whether the ActiveEffect has a temporary duration based on combat turns or rounds.
   */
  get isTemporary(): boolean;

  /**
   * Whether this Active Effect is eligible to be registered with the
   * {@linkcode foundry.helpers.ActiveEffectRegistry | ActiveEffectRegistry}.
   */
  get isExpiryTrackable(): boolean;

  /**
   * A determination of whether the ActiveEffect's expiry event was reached. This check is independent of whether the
   * duration was also reached.
   * @param event   - The event that triggered this check
   * @param context - Contextual information for use in the determination
   */
  isExpiryEvent(event: string, context?: ActiveEffect.IsExpiryEventContext): boolean;

  /**
   * The source name of the Active Effect. The source is retrieved synchronously.
   * Therefore "Unknown" (localized) is returned if the origin points to a document inside a compendium.
   * Returns "None" (localized) if it has no origin, and "Unknown" (localized) if the origin cannot be resolved.
   */
  get sourceName(): string;

  /**
   * Determine whether a change from this ActiveEffect should be applied during the current phase. Systems and
   * modules may override this method to introduce additional conditions under which a change is applied.
   * @param change  - The change being considered.
   * @param options - Options which affect whether the change is applied.
   * @returns Should the change be applied during this phase (or at all)?
   *
   * @remarks The default implementation returns `change.phase === options?.phase`.
   */
  shouldApplyChange(change: ActiveEffect.ChangeData, options?: ActiveEffect.ShouldApplyChangeOptions): boolean;

  /**
   * Acquire replacement data for use in the application of this effect's changes.
   * @param baseData - Base data sourced from elsewhere (by default from
   *                   {@linkcode Actor.getRollData | Actor#getRollData})
   * @returns Data used to resolve `@` expressions in string {@linkcode ActiveEffect.ChangeData | change} values
   *
   * @remarks The default implementation returns `baseData` unchanged.
   */
  getReplacementData(baseData: AnyObject): AnyObject;

  /**
   * Apply this ActiveEffect to a target Document.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param options   - Options affecting the change application
   * @returns An object of property keys and their updated values
   */
  static applyChange(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    options?: ActiveEffect.ApplyChangeOptions,
  ): AnyMutableObject;

  /**
   * Apply EffectChangeData to a field within a Document.
   * @param targetDoc - The model instance.
   * @param change    - The change to apply.
   * @param options   - Additional options to configure the change application.
   * @returns The updated value.
   *
   * @remarks `field` default provided by `??= targetDoc.getFieldForProperty(change.key)`
   */
  static applyChangeField(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    options?: ActiveEffect.ApplyChangeFieldOptions,
  ): unknown;

  /**
   * Apply this ActiveEffect to a provided Document using a heuristic to infer the value types based on the current
   * value and/or the default value in the template.json.
   * @param targetDoc - The Document or DataModel to which this effect should be applied
   * @param change    - The change data being applied.
   * @param changes   - The aggregate update paths and their updated values.
   * @param options   - Additional options to configure the change application.
   */
  protected static _applyChangeUnguided(
    targetDoc: ActiveEffect.ChangeTarget | DataModel.Any,
    change: ActiveEffect.ChangeData,
    changes: AnyMutableObject,
    options?: ActiveEffect.ApplyChangeOptions,
  ): void;

  /**
   * Recursively replace data references in a string change value.
   * @param raw  - The raw value
   * @param data - An object providing replacements
   * @returns The string with all data references resolved
   * @throws An Error if data replacement failed
   */
  protected static _replaceDataRefs(raw: string, data: AnyObject): string | null;

  /**
   * Apply an ActiveEffect that uses an "add" change type.
   * The way that effects are added depends on the data type of the current value.
   *
   * If the current value is null, the change value is assigned directly.
   * If the current type is a string, the change value is concatenated.
   * If the current type is a number, the change value is cast to numeric and added.
   * If the current type is an array, the change value is appended to the existing array if it matches in type.
   *
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeAdd(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a "subtract" change type.
   * The way that effects are subtracted depends on the data type of the current value.
   *
   * If the current value is null, the change value is assigned directly.
   * If the current type is a string, the change value is replaced in the current value with the empty string.
   * If the current type is a number, the change value is cast to numeric and subtracted.
   * If the current type is an array, the change value is spliced out of the array if present.
   *
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeSubtract(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a MULTIPLY application mode.
   * Changes which MULTIPLY must be numeric to allow for multiplication.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeMultiply(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an OVERRIDE application mode.
   * Numeric data is overridden by numbers, while other data types are overridden by any value
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeOverride(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an UPGRADE, or DOWNGRADE application mode.
   * Changes which UPGRADE or DOWNGRADE must be numeric to allow for comparison.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeUpgrade(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a CUSTOM change type.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeCustom(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Retrieve the initial duration configuration.
   * @param combat - The Combat to derive the start data from
   */
  static getEffectStart(combat?: Combat.Implementation | null): ActiveEffect.EffectStartData;

  // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes from BaseActiveEffect.

  /**
   * Display changes to active effects as scrolling Token status text.
   * @param enabled - Is the active effect currently enabled?
   */
  protected _displayScrollingStatus(enabled: boolean): void;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  // Descendant Document operations have been left out because ActiveEffect does not have any descendant documents.

  // TODO: update to include 'pack' in v14
  // `context` must contain a `parent`, so is required.
  static override defaultName(context: ActiveEffect.DefaultNameContext): string;

  // TODO: update to include 'pack' in v14
  // `createOptions` must contain a `parent`, so is required.
  static override createDialog<Options extends ActiveEffect.CreateDialogOptions | undefined = undefined>(
    data: ActiveEffect.CreateDialogData | undefined,
    createOptions: ActiveEffect.Database.CreateDocumentsOperation,
    options?: Options,
    renderOptions?: Document.CreateDialogRenderOptions,
  ): Promise<ActiveEffect.CreateDialogReturn<Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode ActiveEffect.CreateDialogDeprecatedOptions}
   */
  static override createDialog<Options extends ActiveEffect.CreateDialogOptions | undefined = undefined>(
    data: ActiveEffect.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: ActiveEffect.CreateDialogDeprecatedOptions,
    options?: Options,
    renderOptions?: Document.CreateDialogRenderOptions,
  ): Promise<ActiveEffect.CreateDialogReturn<Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: ActiveEffect.Database.DeleteOneDocumentOperation,
  ): Promise<ActiveEffect.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: ActiveEffect.Database.DeleteOneDocumentOperation,
  ): Promise<ActiveEffect.DeleteDialogReturn<Options>>;

  static override fromDropData(data: ActiveEffect.DropData): Promise<ActiveEffect.Implementation | undefined>;

  static override fromImport(
    source: ActiveEffect.Source,
    context?: Document.FromImportContext<ActiveEffect.Parent>,
  ): Promise<ActiveEffect.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#apply` has been moved to
   * {@linkcode ActiveEffect.applyChange}.
   */
  apply(targetDoc: ActiveEffect.ChangeTarget, change: ActiveEffect.ChangeData): AnyMutableObject;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect.applyField` has been moved to
   * {@linkcode ActiveEffect.applyChangeField}.
   *
   * @remarks `field` default provided by `??= model.schema.getField(change.key)`
   */
  static applyField<Field extends fields.DataField.Any | null | undefined = undefined>(
    model: DataModel.Any,
    change: ActiveEffect.ChangeData,
    field?: Field,
  ): ActiveEffect.ApplyFieldReturn<Field>;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyLegacy` has been moved to
   * {@linkcode ActiveEffect._applyChangeUnguided}.
   */
  protected _applyLegacy(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyAdd` has been moved to
   * {@linkcode ActiveEffect._applyChangeAdd}.
   */
  protected _applyAdd(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyMultiply` has been moved to
   * {@linkcode ActiveEffect._applyChangeMultiply}.
   */
  protected _applyMultiply(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyOverride` has been moved to
   * {@linkcode ActiveEffect._applyChangeOverride}.
   */
  protected _applyOverride(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyUpgrade` has been moved to
   * {@linkcode ActiveEffect._applyChangeUpgrade}.
   */
  protected _applyUpgrade(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect#_applyCustom` has been moved to
   * {@linkcode ActiveEffect._applyChangeCustom}.
   */
  protected _applyCustom(
    targetDoc: ActiveEffect.ChangeTarget,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * @deprecated since v14, until v16 — `ActiveEffect.getInitialDuration` has been moved to
   * {@linkcode ActiveEffect.getEffectStart}.
   */
  static getInitialDuration(): ActiveEffect.GetInitialDurationReturn;

  #ActiveEffect: true;
}

export default ActiveEffect;
