import type { MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseLevel } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";
import type CanvasEdges from "#client/canvas/geometry/edges/edges.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

declare namespace Level {
  /**
   * The document's name.
   */
  type Name = "Level";

  /**
   * The context used to create a `Level`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Level`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Level` document instance configured through
   * {@linkcode CONFIG.Level.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Level` document configured through
   * {@linkcode CONFIG.Level.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Level";
      collection: "levels";
      label: "DOCUMENT.Level";
      labelPlural: "DOCUMENT.Levels";
      isEmbedded: true;
      schemaVersion: "14.359";
    }>
  > {}

  // No need for Metadata namespace

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

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
   * An instance of `Level` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Level` that comes from the database.
   */
  type Stored = Document.Internal.Stored<Level.Implementation>;

  /**
   * The data put in {@linkcode Level._source | Level#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Level.create}
   * and {@linkcode Level | new Level(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode Level.create} and {@linkcode Level.createDocuments} signatures, and
   * {@linkcode Level.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Level.create}, returning (a single | an array of) stored
   * `Level`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>> =
    Data extends Array<CreateInput> ? Array<Level.Stored> : Level.Stored | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Level.name | Level#name}.
   *
   * This is data transformed from {@linkcode Level.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Level.update | Level#update}.
   * It is a distinct type from {@linkcode Level.CreateData | DeepPartial<Level.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Level.update | Level#update} and
   * {@linkcode Level.updateDocuments} signatures, and {@linkcode Level.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Level}. This is the source of truth for how a Level document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Level}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this Level embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this Level
     */
    // FIXME: This field is `required` with `blank: false` and no `initial`, so actually required for construction
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The elevation range occupied by this Level.
     * @defaultValue see properties
     * @remarks A `null` `bottom` is treated as `-Infinity`; a `null` `top` is treated as `+Infinity`.
     */
    elevation: fields.SchemaField<{
      /** @defaultValue `0` */
      bottom: fields.NumberField<{ required: true; nullable: true; initial: 0 }>;

      /** @defaultValue `20` */
      top: fields.NumberField<{ required: true; nullable: true; initial: 20 }>;
    }>;

    /**
     * The background texture configuration for this Level.
     * @defaultValue see properties
     */
    background: fields.SchemaField<{
      /** @defaultValue `"#999999"` */
      color: fields.ColorField<{ nullable: false; initial: "#999999" }>;

      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;

      /** @defaultValue `"#ffffff"` */
      tint: fields.ColorField<{ required: true; nullable: false; initial: "#ffffff" }>;

      /** @defaultValue `0.75` */
      alphaThreshold: fields.AlphaField<{ nullable: false; initial: 0.75 }>;
    }>;

    /**
     * The foreground texture configuration for this Level.
     * @defaultValue see properties
     */
    foreground: fields.SchemaField<{
      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;

      /** @defaultValue `"#ffffff"` */
      tint: fields.ColorField<{ required: true; nullable: false; initial: "#ffffff" }>;

      /** @defaultValue `0.75` */
      alphaThreshold: fields.AlphaField<{ nullable: false; initial: 0.75 }>;
    }>;

    /**
     * The fog texture configuration for this Level.
     * @defaultValue see properties
     */
    fog: fields.SchemaField<{
      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;
    }>;

    /**
     * The texture transform applied to this Level's background, foreground, and fog.
     * @defaultValue see properties
     */
    textures: fields.SchemaField<{
      /** @defaultValue `0.5` */
      anchorX: fields.NumberField<{ required: true; nullable: false; initial: 0.5 }>;

      /** @defaultValue `0.5` */
      anchorY: fields.NumberField<{ required: true; nullable: false; initial: 0.5 }>;

      /** @defaultValue `0` */
      offsetX: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /** @defaultValue `0` */
      offsetY: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /** @defaultValue `"fill"` */
      fit: fields.StringField<
        {
          required: true;
          initial: "fill";
          choices: typeof CONST.TEXTURE_DATA_FIT_MODES;
        },
        CONST.TEXTURE_DATA_FIT_MODES | null | undefined,
        CONST.TEXTURE_DATA_FIT_MODES,
        CONST.TEXTURE_DATA_FIT_MODES
      >;

      /** @defaultValue `1` */
      scaleX: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;

      /** @defaultValue `1` */
      scaleY: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;

      /** @defaultValue `0` */
      rotation: fields.AngleField<{ initial: 0 }>;
    }>;

    /**
     * Visibility configuration for this Level.
     * @defaultValue see properties
     */
    visibility: fields.SchemaField<{
      /**
       * The set of other Levels which are visible from this Level.
       * @defaultValue `new Set()`
       */
      levels: fields.SceneLevelsSetField;
    }>;

    /**
     * The sort order of this Level relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Level` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Level.Parent> {}

    /**
     * The interface for passing to {@linkcode Level.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Level` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Level` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Level.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation
      extends
        DatabaseBackend.CreateOperation<Level.CreateInput, Level.Parent>,
        DatabaseBackend._CommonCanvasDocumentCreateProperties {}

    /**
     * The interface for passing to {@linkcode Level.create} or {@linkcode Level.createDocuments}.
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
     * can contain `Level` documents. (see {@linkcode Level.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Level` documents.
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
     * The interface passed to {@linkcode Level._preCreate | Level#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateLevel` hook}.
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
     * The interface passed to {@linkcode Level._preCreateOperation}.
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
     * The interface passed to {@linkcode Level._onCreate | Level#_onCreate} and
     * {@link Hooks.CreateDocument | the `createLevel` hook}.
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
     * The interface passed to {@linkcode Level._onCreateOperation} and `Level`-related collections'
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
     * interface for `Level` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Level.update | Level#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends
        DatabaseBackend.UpdateOperation<Level.UpdateInput, Level.Parent>,
        DatabaseBackend._CommonCanvasDocumentUpdateProperties {}

    /**
     * The interface for passing to {@linkcode Level.update | Level#update}.
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
     * can contain `Level` documents (see {@linkcode Level.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Level.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Level` documents.
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
     * The interface passed to {@linkcode Level._preUpdate | Level#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateLevel` hook}.
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
     * The interface passed to {@linkcode Level._preUpdateOperation}.
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
     * The interface passed to {@linkcode Level._onUpdate | Level#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateLevel` hook}.
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
     * The interface passed to {@linkcode Level._onUpdateOperation} and `Level`-related collections'
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
     * interface for `Level` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Level.delete | Level#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Level.Parent> {}

    /**
     * The interface for passing to {@linkcode Level.delete | Level#delete}.
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
     * can contain `Level` documents (see {@linkcode Level.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Level.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Level` documents.
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
     * The interface passed to {@linkcode Level._preDelete | Level#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteLevel` hook}.
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
     * The interface passed to {@linkcode Level._preDeleteOperation}.
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
     * The interface passed to {@linkcode Level._onDelete | Level#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteLevel` hook}.
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
     * The interface passed to {@linkcode Level._onDeleteOperation} and `Level`-related collections'
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
        GetDocumentsOperation: Level.Database.GetDocumentsOperation;
        BackendGetOperation: Level.Database.BackendGetOperation;
        GetOperation: Level.Database.GetOperation;

        CreateDocumentsOperation: Level.Database.CreateDocumentsOperation;
        CreateEmbeddedOperation: Level.Database.CreateEmbeddedOperation;
        BackendCreateOperation: Level.Database.BackendCreateOperation;
        CreateOperation: Level.Database.CreateOperation;
        PreCreateOptions: Level.Database.PreCreateOptions;
        PreCreateOperation: Level.Database.PreCreateOperation;
        OnCreateOptions: Level.Database.OnCreateOptions;
        OnCreateOperation: Level.Database.OnCreateOperation;

        UpdateOneDocumentOperation: Level.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: Level.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Level.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Level.Database.BackendUpdateOperation;
        UpdateOperation: Level.Database.UpdateOperation;
        PreUpdateOptions: Level.Database.PreUpdateOptions;
        PreUpdateOperation: Level.Database.PreUpdateOperation;
        OnUpdateOptions: Level.Database.OnUpdateOptions;
        OnUpdateOperation: Level.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: Level.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: Level.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Level.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Level.Database.BackendDeleteOperation;
        DeleteOperation: Level.Database.DeleteOperation;
        PreDeleteOptions: Level.Database.PreDeleteOptions;
        PreDeleteOperation: Level.Database.PreDeleteOperation;
        OnDeleteOptions: Level.Database.OnDeleteOptions;
        OnDeleteOperation: Level.Database.OnDeleteOperation;
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
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

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

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode Level.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Level.fromDropData}
   * signature that has since been removed. This type will be removed in a future version.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Level.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Level.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Level.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions
    extends Database.CreateDocumentsOperation, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Level.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Level.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  type CreateDialogReturn<Config extends Level.CreateDialogOptions | undefined> = Document.CreateDialogReturn<
    Level.Stored,
    Config
  >;

  /**
   * The return type for {@linkcode Level.deleteDialog | Level#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<Config extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Level.Stored,
    Config
  >;

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in a future version.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Level document which extends the common BaseLevel model.
 *
 * @see {@linkcode Scene}      The Scene document type which contains Level embedded documents
 */
declare class Level extends BaseLevel.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Level`
   * @param context - Construction context options
   */
  constructor(data: Level.CreateData, context?: Level.ConstructionContext);

  /**
   * The integer index of the Level, assigned during Scene data preparation.
   */
  index: number;

  /**
   * Is this level currently viewed?
   */
  get isView(): boolean;

  /**
   * Is this level currently visible?
   */
  get isVisible(): boolean;

  /**
   * The edges of this Level.
   */
  get edges(): CanvasEdges;

  override prepareBaseData(): void;

  /**
   * Clamp the given elevation (of a token with a depth) to the elevation range of this Level.
   *
   * The elevation is clamped such that the head of the token is in the range if possible, but
   * the feet are never outside of the range.
   * @param elevation - The elevation (of the token)
   * @param depth     - The depth of the token
   * @returns The clamped elevation
   */
  clampElevation(elevation: number, depth?: number): number;

  /**
   * Update the shape constraints of all Regions in this Level the current User is designated for
   * (for the given restriction types).
   * @param types - The types to update. Default: all.
   *
   * @remarks Throws if this Level is not persisted.
   * @defaultValue
   * ```typescript
   * // types
   * CONST.EDGE_RESTRICTION_TYPES
   * ```
   */
  updateRegionShapeConstraints(types?: Iterable<CONST.EDGE_RESTRICTION_TYPES>): void;

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

  // Descendant Document operations have been left out because Level does not have any descendant documents.

  // `context` must contain a `parent`, so is required.
  static override defaultName(context: Level.DefaultNameContext): string;

  // `createOptions` must contain a  `parent`, so is required.
  static override createDialog<Options extends Level.CreateDialogOptions | undefined = undefined>(
    data: Level.CreateDialogData | undefined,
    createOptions: Level.Database.CreateDocumentsOperation,
    options?: Options,
    renderOptions?: Document.CreateDialogRenderOptions,
  ): Promise<Level.CreateDialogReturn<Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Level.CreateDialogDeprecatedOptions}
   */
  static override createDialog<Options extends Level.CreateDialogOptions | undefined = undefined>(
    data: Level.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Level.CreateDialogDeprecatedOptions,
    options?: Options,
    renderOptions?: Document.CreateDialogRenderOptions,
  ): Promise<Level.CreateDialogReturn<Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Level.Database.DeleteOneDocumentOperation,
  ): Promise<Level.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Level.Database.DeleteOneDocumentOperation,
  ): Promise<Level.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Level.DropData): Promise<Level.Implementation | undefined>;

  static override fromImport(
    source: Level.Source,
    context?: Document.FromImportContext<Level.Parent>,
  ): Promise<Level.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because Level does not have any embedded documents.
}

export default Level;
