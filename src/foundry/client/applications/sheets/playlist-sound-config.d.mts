import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistSoundConfig: PlaylistSoundConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single PlaylistSound document within a parent Playlist.
 */
declare class PlaylistSoundConfig<
  RenderContext extends PlaylistSoundConfig.RenderContext = PlaylistSoundConfig.RenderContext,
  Configuration extends PlaylistSoundConfig.Configuration = PlaylistSoundConfig.Configuration,
  RenderOptions extends PlaylistSoundConfig.RenderOptions = PlaylistSoundConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  PlaylistSound.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<DocumentSheetV2.ProcessSubmitDataResult>;
}

declare namespace PlaylistSoundConfig {
  interface Any extends AnyPlaylistSoundConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistSoundConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<PlaylistSound.Implementation> {
    lvolume: number;
    channels: Record<string, string>;
    defaultChannel: string;
    milliseconds: string;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<PlaylistSound.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaylistSoundConfig extends PlaylistSoundConfig<
  PlaylistSoundConfig.RenderContext,
  PlaylistSoundConfig.Configuration,
  PlaylistSoundConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistSoundConfig;
