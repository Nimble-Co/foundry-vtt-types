import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type CameraPopout from "./camera-popout.d.mts";
import type { DeepPartial, Identity } from "#utils";

import AVSettings = foundry.av.AVSettings;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CameraViews: CameraViews.Any;
    }
  }
}

/**
 * An application that shows docked camera views.
 */
declare class CameraViews<
  RenderContext extends CameraViews.RenderContext = CameraViews.RenderContext,
  Configuration extends CameraViews.Configuration = CameraViews.Configuration,
  RenderOptions extends CameraViews.RenderOptions = CameraViews.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: CameraViews.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Icons for the docked state of the camera dock.
   */
  DOCK_ICONS: Record<AVSettings.DOCK_POSITIONS, [string, string]>;

  /**
   * If all camera views are popped out, hide the dock.
   */
  get hidden(): boolean;

  /**
   * Whether the AV dock is in a horizontal configuration.
   */
  get isHorizontal(): boolean;

  /**
   * Whether the AV dock is in a vertical configuration.
   */
  get isVertical(): boolean;

  /**
   * Cameras which have been popped-out of this dock.
   */
  get popouts(): CameraPopout[];

  /**
   * The cached list of processed user entries.
   */
  get users(): Record<string, CameraViews.UserContext>;

  /**
   * Get a user's camera dock.
   * @param userId - The user's ID.
   */
  getUserCameraView(userId: string): HTMLElement | null;

  /**
   * Get the video element for a user broadcasting video.
   * @param userId - The user's ID.
   */
  getUserVideoElement(userId: string): HTMLVideoElement | null;

  /**
   * Indicate a user is speaking on their camera dock.
   * @param userId   - The user's ID.
   * @param speaking - Whether the user is speaking.
   */
  setUserIsSpeaking(userId: string, speaking: boolean): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for controls.
   */
  protected _prepareControlsContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the given user.
   * @param id - The user's ID.
   * @internal
   */
  _prepareUserContext(id: string): CameraViews.UserContext | void;

  protected override _replaceHTML(result: unknown, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _attachFrameListeners(): void;

  /**
   * Handle blocking a user's audio stream.
   * @internal
   */
  _onBlockAudio(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle blocking a user's video stream.
   * @internal
   */
  _onBlockVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle spawning the AV configuration dialog.
   * @internal
   */
  _onConfigure(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle disabling all incoming video streams.
   * @internal
   */
  _onDisableVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle hiding a user from the AV UI entirely.
   * @internal
   */
  _onHideUser(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle disabling all incoming audio streams.
   * @internal
   */
  _onMutePeers(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle the user toggling their own audio stream.
   * @internal
   */
  _onToggleAudio(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle the user toggling their own video stream.
   * @internal
   */
  _onToggleVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle changing another user's volume.
   */
  protected _onVolumeChange(event: Event): void;

  /**
   * Sort users' cameras in the dock.
   */
  protected static _sortUsers(a: CameraViews.UserContext, b: CameraViews.UserContext): number;
}

declare namespace CameraViews {
  interface Any extends AnyCameraViews {}
  interface AnyConstructor extends Identity<typeof AnyCameraViews> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<CameraViews extends CameraViews.Any = CameraViews.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraViews> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraViews extends CameraViews.Any = CameraViews.Any> = DeepPartial<Configuration<CameraViews>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface ControlContext {
    icon: string;
    label: string;
    display: boolean;
  }

  interface UserContext {
    /** The User instance. */
    user: User.Stored;

    /** The user's AV settings. */
    settings: AVSettings.Data;

    /** Whether the user's AV stream is local. */
    local: boolean;

    /** The user's character name. */
    charname: string;

    /** The CSS class of the user's camera dock. */
    css: string;

    /** Whether the user is broadcasting video. */
    hasVideo: boolean;

    /** Whether the user is broadcasting audio. */
    hasAudio: boolean;

    /** Whether the main camera dock is hidden. */
    hidden: boolean;

    nameplates: Nameplates;

    video: Video;

    volume: Volume;

    controls: Record<string, ControlContext>;
  }

  interface Nameplates {
    /** Whether camera nameplates are entirely hidden. */
    hidden: boolean;

    /** Nameplate CSS classes. */
    css: string;

    /**
     * Whether to show player names on nameplates.
     * @remarks v14.365 corrected the declared type of this member from `string`.
     */
    playerName: boolean;

    /**
     * Whether to show character names on nameplates.
     * @remarks v14.365 corrected the declared type of this member from `string`.
     */
    charname: boolean;
  }

  interface Video {
    /** The video stream's volume. */
    volume: number;

    /** Whether to mute the video stream's audio. */
    muted: boolean;

    /** Whether to show this user's camera. */
    show: boolean;
  }

  interface Volume {
    /** The user's configured volume level. */
    value: number;

    /** The volume range field. */
    field: foundry.data.fields.DataField.Any;

    /** Whether to show a volume bar for this user. */
    show: boolean;
  }
}

declare abstract class AnyCameraViews extends CameraViews<
  CameraViews.RenderContext,
  CameraViews.Configuration,
  CameraViews.RenderOptions
> {
  constructor(...args: never);
}

export default CameraViews;
