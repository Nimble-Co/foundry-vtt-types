import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryCategoryConfig: JournalEntryCategoryConfig.Any;
    }
  }
}

/**
 * An Application responsible for managing a journal entry's categories.
 */
declare class JournalEntryCategoryConfig<
  RenderContext extends JournalEntryCategoryConfig.RenderContext = JournalEntryCategoryConfig.RenderContext,
  Configuration extends JournalEntryCategoryConfig.Configuration = JournalEntryCategoryConfig.Configuration,
  RenderOptions extends JournalEntryCategoryConfig.RenderOptions = JournalEntryCategoryConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<DocumentSheetV2.ProcessSubmitDataResult>;

  #journalEntryCategoryConfig: true;
}

declare namespace JournalEntryCategoryConfig {
  interface Any extends AnyJournalEntryCategoryConfig {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryCategoryConfig> {}

  /** A single category row prepared for rendering. */
  interface Category {
    field: foundry.data.fields.StringField;
    placeholder: string;
    name: string;
    id: string;
    sort: number;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<JournalEntry.Implementation> {
    categories: Category[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryCategoryConfig extends JournalEntryCategoryConfig<
  JournalEntryCategoryConfig.RenderContext,
  JournalEntryCategoryConfig.Configuration,
  JournalEntryCategoryConfig.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryCategoryConfig;
