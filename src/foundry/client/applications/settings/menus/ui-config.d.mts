import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      UIConfig: UIConfig.Any;
    }
  }
}

/**
 * A submenu that provides UI configuration settings.
 */
declare class UIConfig<
  RenderContext extends UIConfig.RenderContext = UIConfig.RenderContext,
  Configuration extends UIConfig.Configuration = UIConfig.Configuration,
  RenderOptions extends UIConfig.RenderOptions = UIConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: UIConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The data schema for the core.uiConfig setting.
   */
  static get schema(): foundry.data.fields.SchemaField.Any;

  protected override _preFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void;
}

declare namespace UIConfig {
  interface Any extends AnyUIConfig {}
  interface AnyConstructor extends Identity<typeof AnyUIConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<UIConfig extends UIConfig.Any = UIConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<UIConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<UIConfig extends UIConfig.Any = UIConfig.Any> = DeepPartial<Configuration<UIConfig>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface GameUIConfiguration {
    uiScale: number;
    fontScale: number;
    colorScheme: { applications: "" | "dark" | "light"; interface: "" | "dark" | "light" };

    /** @remarks Added in v14.365. It gives the chat log a background. */
    chatBackground: boolean;

    chatNotifications: "cards" | "pip";
    fade: { opacity: number; speed: number };
  }

  interface RenderContext {
    setting: GameUIConfiguration;
    fields: foundry.data.fields.DataSchema;
    buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
  }
}

declare abstract class AnyUIConfig extends UIConfig<
  UIConfig.RenderContext,
  UIConfig.Configuration,
  UIConfig.RenderOptions
> {
  constructor(...args: never);
}

export default UIConfig;
