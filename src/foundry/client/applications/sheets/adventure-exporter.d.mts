import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AdventureExporter: AdventureExporter.Any;
    }
  }
}

/**
 * An interface for packaging Adventure content and loading it to a compendium pack.
 */
declare class AdventureExporter<
  RenderContext extends AdventureExporter.RenderContext = AdventureExporter.RenderContext,
  Configuration extends AdventureExporter.Configuration = AdventureExporter.Configuration,
  RenderOptions extends AdventureExporter.RenderOptions = AdventureExporter.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The prepared document tree which is displayed in the form.
   */
  contentTree: Record<string, AdventureExporter.ContentTreeRoot>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    options?: unknown,
  ): Promise<DocumentSheetV2.ProcessSubmitDataResult>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Stage a document for addition to the Adventure.
   * This adds the Document locally, the change is not yet submitted to the database.
   * @param document - Some document to be added to the Adventure.
   */
  addContent(document: foundry.abstract.Document.Any): void;

  /**
   * Remove or restore a single Document from the Adventure.
   * @param document - The Document being removed from the Adventure.
   */
  removeContent(document: foundry.abstract.Document.Any): void;
}

declare namespace AdventureExporter {
  interface Any extends AnyAdventureExporter {}
  interface AnyConstructor extends Identity<typeof AnyAdventureExporter> {}

  /** A document entry within a content tree node. */
  interface ContentTreeDocument {
    id: string;
    name: string;
    document: foundry.abstract.Document.Any;
    state: string;
    stateLabel: string;
  }

  /** A node of the adventure content tree, representing a Folder. */
  interface ContentTreeNode {
    /** An alias for folder.id */
    id: string;

    /** An alias for folder.name */
    name: string;

    /** The Folder at this node level */
    folder: Folder.Implementation | null;

    /** The modification state of the Folder */
    state: string;

    /** An array of child nodes */
    children: ContentTreeNode[];

    /** An array of documents */
    documents: ContentTreeDocument[];
  }

  /** The root node of a content tree for a single Document type. */
  interface ContentTreeRoot {
    /** The folder ID is null at the root level */
    id: null;

    /** The Document name contained in this tree */
    documentName: string;

    /** The Document collection name of this tree */
    collection: string;

    /** The name displayed at the root level of the tree */
    name: string;

    /** The icon displayed at the root level of the tree */
    icon: string;

    /** Has the section been tentatively cleared of its contents? */
    cleared: boolean;

    /** CSS classes which describe the display of the tree */
    cssClass: string;

    /** The number of documents which are present in the tree */
    documentCount: number;

    folder: null;
    state: string;
    children: ContentTreeNode[];
    documents: ContentTreeDocument[];
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Adventure.Implementation> {
    contentTree: Record<string, ContentTreeRoot>;
    adventure: Adventure.Implementation;
    tabClasses: string;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Adventure.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAdventureExporter extends AdventureExporter<
  AdventureExporter.RenderContext,
  AdventureExporter.Configuration,
  AdventureExporter.RenderOptions
> {
  constructor(...args: never);
}

export default AdventureExporter;
