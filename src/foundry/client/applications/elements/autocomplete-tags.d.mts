import type { AbstractMultiSelectElement } from "./multi-select.d.mts";
import type { MultiSelectInputConfig } from "../forms/fields.d.mts";

/** @privateRemarks Only used for a documentation link */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type HTMLStringTagsElement from "./string-tags.d.mts";

/**
 * Provide a multi-select workflow as a text input which offers autocompletion over the available options. Chosen
 * options are displayed as a list of tags which may be individually removed.
 *
 * @example
 * Autocomplete Tags HTML Markup
 * ```html
 * <autocomplete-tags name="select-many-things">
 *   <option value="foo">Foo</option>
 *   <option value="bar">Bar</option>
 *   <option value="baz">Baz</option>
 * </autocomplete-tags>
 * ```
 *
 * @remarks Added in v14.364.
 *
 * The chosen options are rendered with {@linkcode HTMLStringTagsElement.renderTag}.
 */
declare class HTMLAutocompleteTagsElement extends AbstractMultiSelectElement {
  /** @defaultValue `"autocomplete-tags"` */
  static override tagName: string;

  protected override _activateListeners(): void;

  /**
   * @remarks Returns `[tags: HTMLDivElement, input: HTMLInputElement]`.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  /** @remarks Dismisses the autocomplete menu if this element is the one that currently uses it. */
  protected override _disconnect(): void;

  /**
   * @remarks Records each choice with a search key. The key is the label without diacritics, trimmed and in
   * lower case.
   */
  protected override _initialize(): void;

  protected override _refresh(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a {@linkcode HTMLAutocompleteTagsElement} using provided configuration data.
   */
  static create(config: HTMLAutocompleteTagsElement.Config): HTMLAutocompleteTagsElement;

  #HTMLAutocompleteTagsElement: true;
}

declare namespace HTMLAutocompleteTagsElement {
  /**
   * @remarks {@linkcode HTMLAutocompleteTagsElement.create} forwards to
   * {@linkcode foundry.applications.fields.createMultiSelectInput} with `type: "autocomplete"`, so `type` is
   * not part of the configuration a caller provides.
   */
  interface Config extends Omit<MultiSelectInputConfig, "type"> {}
}

export default HTMLAutocompleteTagsElement;
