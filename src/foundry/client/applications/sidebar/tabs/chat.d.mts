import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ChatLog: ChatLog.Any;
    }
  }
}

/**
 * The sidebar chat tab.
 */
declare class ChatLog<
  RenderContext extends ChatLog.RenderContext = ChatLog.RenderContext,
  Configuration extends ChatLog.Configuration = ChatLog.Configuration,
  RenderOptions extends ChatLog.RenderOptions = ChatLog.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: AbstractSidebarTab.DefaultOptions;

  static override tabName: string;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** The maximum number of messages to retain in history. */
  static MAX_MESSAGE_HISTORY: number;

  /** The duration, in milliseconds, for which a notification is shown. */
  static NOTIFY_DURATION: number;

  /** The frequency, in milliseconds, at which notification lifespans are checked. */
  static NOTIFY_TICKER: number;

  /** The duration, in milliseconds, before notifications resume after being paused. */
  static NOTIFY_UNPAUSE: number;

  /** The duration, in milliseconds, for which a pip notification is shown. */
  static PIP_DURATION: number;

  /** How frequently, in milliseconds, to update displayed timestamps. */
  static UPDATE_TIMESTAMP_FREQUENCY: number;

  /** The set of commands which support multiline input. */
  static MULTILINE_COMMANDS: Set<string>;

  /**
   * Parse a chat string to identify the chat command (if any) which was used.
   * @param message - The message to parse.
   */
  static parse(message: string): [string, string[] | RegExpMatchArray | RegExpMatchArray[], unknown];

  /**
   * Render a single ChatMessage to an HTML element for display.
   */
  static renderMessage(message: ChatMessage.Implementation, options?: object): Promise<HTMLElement>;

  /**
   * A reference to the Messages collection that the chat log displays.
   */
  get collection(): foundry.documents.collections.ChatMessages;

  /**
   * Message history management.
   */
  get history(): ChatLog.History;

  /**
   * Whether the chat log is currently scrolled to the bottom.
   */
  get isAtBottom(): boolean;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Get context menu entries for chat messages in the log.
   */
  protected _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the input part.
   */
  protected _prepareInputContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<Record<string, HTMLElement>>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Synchronize the state of the input part before replacement.
   */
  protected _preSyncInputState(newElement: HTMLElement, priorElement: HTMLElement, state: object): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Synchronize the state of the input part after replacement.
   */
  protected _syncInputState(newElement: HTMLElement, priorElement: HTMLElement, state: object): void;

  protected override _attachPartListeners(
    partId: string,
    element: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;

  /**
   * Attach listeners to the chat log part.
   */
  protected _attachLogListeners(
    element: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;

  protected override _onActivate(): void;

  protected override _onDeactivate(): void;

  /**
   * Handle clicking a notification.
   */
  protected _onClickNotification(event: PointerEvent): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Handle configuring the ProseMirror editor plugins.
   */
  protected _onConfigurePlugins(event: Event): void;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Process a chat message, executing any chat commands and creating the message.
   * @param message - The original string of the message content.
   */
  processMessage(message: string, options?: { speaker?: object }): Promise<ChatMessage.Implementation | void>;

  /**
   * Delete a single message from the chat log.
   */
  deleteMessage(messageId: string, options?: object): void;

  /**
   * Trigger a notification that represents the given message.
   */
  notify(message: ChatMessage.Implementation, options?: { existing?: HTMLElement; newMessage?: boolean }): void;

  /**
   * Post a single chat message to the log.
   * @remarks Does nothing if the log is not rendered, or if the message is not visible to this user.
   */
  postOne(message: ChatMessage.Implementation, options?: ChatLog.PostOneOptions): Promise<void>;

  /**
   * Render a batch of additional messages, prepending them to the top of the log.
   * @param size - The batch size.
   */
  renderBatch(size: number): Promise<void>;

  /**
   * Scroll the chat log to the bottom.
   */
  scrollBottom(options?: { popout?: boolean; waitImages?: boolean; scrollOptions?: object }): Promise<void>;

  /**
   * Update the displayed representation of a ChatMessage in the log.
   * @remarks Deletes the message from the log instead if the message is no longer visible to this user.
   */
  updateMessage(message: ChatMessage.Implementation, options?: ChatLog.UpdateMessageOptions): Promise<void>;

  /**
   * Update the displayed timestamps for all rendered messages.
   */
  updateTimestamps(): void;

  /**
   * Determine whether notifications should currently be shown.
   */
  protected _shouldShowNotifications(options?: { closing?: boolean }): boolean;

  /**
   * Toggle the display of chat notifications.
   * @param options - The options which were passed to the render or close operation that triggered this
   *                  method
   *                  (default: `{}`)
   * @remarks v14.365 widened this parameter. The options are forwarded to the `renderChatInput` hook.
   */
  protected _toggleNotifications(options?: ChatLog.ToggleNotificationsOptions): void;

  /**
   * Update the chat message entry mode (roll mode / whisper target).
   */
  protected _updateMessageMode(): void;
}

declare namespace ChatLog {
  interface Any extends AnyChatLog {}
  interface AnyConstructor extends Identity<typeof AnyChatLog> {}

  /** Message-history management state. */
  interface History {
    queue: string[];
    index: number;
    pending: string;
  }

  /** @remarks The `scroll` option was added in v14.365. */
  interface PostOneOptions {
    /**
     * An existing message ID to prepend the posted message to. By default the new message is appended to the
     * end of the log.
     */
    before?: string | undefined;

    /**
     * Trigger a notification which shows the log as having a new unread message.
     * @defaultValue `false`
     */
    notify?: boolean | undefined;

    /**
     * Pass `true` to always scroll to the bottom, or `false` to suppress this. If you omit this option the
     * log keeps its conditional scroll to the bottom: it scrolls only when the log is already at the bottom
     * or when this user is the author.
     */
    scroll?: boolean | undefined;
  }

  interface UpdateMessageOptions {
    /**
     * Trigger a notification which shows the log as having a new unread message.
     * @defaultValue `false`
     */
    notify?: boolean | undefined;
  }

  interface ToggleNotificationsOptions extends DeepPartial<ApplicationV2.RenderOptions & ApplicationV2.ClosingOptions> {
    /**
     * Whether this method has been triggered by the chat popout closing.
     * @defaultValue `false`
     */
    closing?: boolean | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyChatLog extends ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions> {
  constructor(...args: never);
}

export default ChatLog;
