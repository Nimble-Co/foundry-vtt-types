import type { DeepPartial, Identity } from "#utils";
import type PlaceableConfig from "./placeable-config.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingConfig: DrawingConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Drawing document within a parent Scene.
 */
declare class DrawingConfig<
  RenderContext extends DrawingConfig.RenderContext = DrawingConfig.RenderContext,
  Configuration extends DrawingConfig.Configuration = DrawingConfig.Configuration,
  RenderOptions extends DrawingConfig.RenderOptions = DrawingConfig.RenderOptions,
> extends PlaceableConfig<DrawingDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _previewChanges(changes: object): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<DocumentSheetV2.ProcessSubmitDataResult>;
}

declare namespace DrawingConfig {
  interface Any extends AnyDrawingConfig {}
  interface AnyConstructor extends Identity<typeof AnyDrawingConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<DrawingDocument.Implementation> {
    tabClasses: string;
    userColor: foundry.utils.Color;
    units: { degrees: string; pixels: string };
  }

  interface Configuration extends PlaceableConfig.Configuration<DrawingDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyDrawingConfig extends DrawingConfig<
  DrawingConfig.RenderContext,
  DrawingConfig.Configuration,
  DrawingConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingConfig;
