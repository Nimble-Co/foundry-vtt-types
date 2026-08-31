import type { AnyObject, DeepPartial, Identity } from "#utils";
import type PlaceableConfig from "../placeable-config.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenConfig: TokenConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single token document within a parent Scene
 */
declare class TokenConfig<
  RenderContext extends TokenConfig.RenderContext = TokenConfig.RenderContext,
  Configuration extends TokenConfig.Configuration = TokenConfig.Configuration,
  RenderOptions extends TokenConfig.RenderOptions = TokenConfig.RenderOptions,
> extends TokenApplicationMixin(PlaceableConfig)<
  TokenDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  override isPrototype: boolean;

  override get token(): TokenDocument.Implementation;

  override get actor(): Actor.Implementation | null;

  protected override get _fields(): foundry.data.fields.DataSchema;

  override get isVisible(): boolean;

  protected override _prepareAppearanceTab(): Promise<AnyObject>;

  protected override _previewChanges(changes: object): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<DocumentSheetV2.ProcessSubmitDataResult>;
}

declare namespace TokenConfig {
  interface Any extends AnyTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyTokenConfig> {}

  interface RenderContext
    extends
      TokenApplicationMixin.RenderContext<TokenDocument.Implementation>,
      PlaceableConfig.RenderContext<TokenDocument.Implementation> {}

  interface Configuration
    extends TokenApplicationMixin.Configuration, PlaceableConfig.Configuration<TokenDocument.Implementation> {}

  interface RenderOptions extends TokenApplicationMixin.RenderOptions, PlaceableConfig.RenderOptions {}
}

declare abstract class AnyTokenConfig extends TokenConfig<
  TokenConfig.RenderContext,
  TokenConfig.Configuration,
  TokenConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TokenConfig;
