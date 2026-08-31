import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Document definition for a Level.
 * Defines the DataSchema and common behaviors for a Level which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseLevel extends Document<"Level", BaseLevel.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseLevel`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseLevel` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Level.implementation | new Level.implementation(...)} instead which will give you
   * a system specific implementation of `Level`.
   */
  constructor(data: BaseLevel.CreateData, context?: BaseLevel.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Level",
   *   collection: "levels",
   *   label: "DOCUMENT.Level",
   *   labelPlural: "DOCUMENT.Levels",
   *   isEmbedded: true,
   *   schemaVersion: "14.364"
   * })
   * ```
   */
  static override metadata: BaseLevel.Metadata;

  static override defineSchema(): BaseLevel.Schema;

  /** @defaultValue `["DOCUMENT", "SCENE_LEVEL"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  override readonly parentCollection: BaseLevel.ParentCollectionName | null;

  static override get implementation(): Level.ImplementationClass;

  static override get baseDocument(): typeof BaseLevel;

  static override get collectionName(): BaseLevel.ParentCollectionName;

  static override get documentName(): BaseLevel.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseLevel.Hierarchy;

  override parent: BaseLevel.Parent;

  override " fvtt_types_internal_document_parent": BaseLevel.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"Level", Action>,
  ): boolean;

  static override createDocuments(
    data: BaseLevel.CreateInput[],
    operation?: BaseLevel.Database.CreateDocumentsOperation,
  ): Promise<Array<Level.Stored>>;

  static override updateDocuments(
    updates: BaseLevel.UpdateInput[],
    operation?: BaseLevel.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Level.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseLevel.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Level.Stored>>;

  static override create<Data extends MaybeArray<BaseLevel.CreateInput>>(
    data: Data,
    operation?: BaseLevel.Database.CreateDocumentsOperation,
  ): Promise<BaseLevel.CreateReturn<Data>>;

  override update(
    data: BaseLevel.UpdateInput,
    operation?: BaseLevel.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseLevel.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `Level`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseLevel.Database.GetDocumentsOperation): null;

  // `Level`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseLevel.Flags.Scope, Key extends BaseLevel.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseLevel.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseLevel.Flags.Scope,
    Key extends BaseLevel.Flags.Key<Scope>,
    Value extends BaseLevel.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseLevel.Flags.Scope, Key extends BaseLevel.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseLevel.CreateData,
    options: BaseLevel.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseLevel.CreateData,
    options: BaseLevel.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Level.Implementation[],
    operation: BaseLevel.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Level.Stored[],
    operation: BaseLevel.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseLevel.UpdateData,
    options: BaseLevel.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseLevel.UpdateData,
    options: BaseLevel.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Level.Stored[],
    operation: BaseLevel.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Level.Stored[],
    operation: BaseLevel.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseLevel.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseLevel.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Level.Stored[],
    operation: BaseLevel.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Level.Stored[],
    operation: BaseLevel.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseLevel.Schema>;

  static override get schema(): SchemaField<BaseLevel.Schema>;

  static override validateJoint(data: BaseLevel.Source): void;

  static override fromSource(source: BaseLevel.CreateData, context?: DataModel.FromSourceOptions): Level.Implementation;

  static override fromJSON(json: string): Level.Implementation;
}

export default BaseLevel;

declare namespace BaseLevel {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Level.Name;
  export import ConstructionContext = Level.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Level.ConstructorArgs;
  export import Hierarchy = Level.Hierarchy;
  export import Metadata = Level.Metadata;
  export import Parent = Level.Parent;
  export import Descendant = Level.Descendant;
  export import DescendantClass = Level.DescendantClass;
  export import Embedded = Level.Embedded;
  export import ParentCollectionName = Level.ParentCollectionName;
  export import CollectionClass = Level.CollectionClass;
  export import Collection = Level.Collection;
  export import Invalid = Level.Invalid;
  export import Source = Level.Source;
  export import CreateData = Level.CreateData;
  export import CreateInput = Level.CreateInput;
  export import CreateReturn = Level.CreateReturn;
  export import InitializedData = Level.InitializedData;
  export import UpdateData = Level.UpdateData;
  export import UpdateInput = Level.UpdateInput;
  export import Schema = Level.Schema;
  export import Database = Level.Database;
  export import Flags = Level.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Level` a name.
    // The expression `ClientDocumentMixin(BaseLevel)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseLevel> {}
    const ClientDocument: ClientDocument;
  }
}
