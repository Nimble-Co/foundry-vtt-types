import type { SchemaField } from "#common/data/fields.d.mts";
import type { AnyMutableObject, Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { PrototypeToken } from "../../data/_module.d.mts";

/**
 * A class responsible for managing package-provided art and applying it to Documents in compendium packs.
 */
declare class CompendiumArt extends Map<string, CompendiumArt.Info> {
  /**
   * @remarks
   * @throws "You may not re-initialize the singleton {@linkcode CompendiumArt}. Use {@linkcode game.compendiumArt} instead."
   */
  constructor(iterable?: Iterable<[string, CompendiumArt.Info]> | null);

  /**
   * The key for the package manifest flag used to store the mapping information.
   * @defaultValue `"compendiumArtMappings"`
   */
  FLAG: string;

  /**
   * The key for the setting used to store the World's art preferences.
   * @defaultValue `"compendiumArtConfiguration"`
   */
  SETTING: string;

  /**
   * Whether art application is enabled. This should be switched off when performing client-side compendium migrations
   * in order to avoid persisting injected data.
   * @defaultValue `true`
   */
  enabled: boolean;

  /**
   * Apply any art configured for a Document to its source data as it is initialized from a compendium pack.
   * @param documentClass - The class of the Document being initialized.
   * @param source        - The Document's source data.
   * @param packId        - The ID of the compendium pack the Document is initialized from.
   * @returns The Document's source data.
   *
   * @remarks Added in v14.367. `Actor` and `Item` both call this from `_initializeSource`; before that build
   * `Actor` inlined the logic and `Item` had none.
   *
   * `source` is mutated in place and returned, so the return is the same reference you pass in. The method is
   * a no-op unless {@linkcode CompendiumArt.enabled | enabled} is `true`, `source._id` is set, and the pack's
   * document name agrees with `documentClass`.
   *
   * Calls the `applyCompendiumArt` hook, but only if art was in fact applied.
   */
  applyArt<Source extends AnyMutableObject>(
    documentClass: Document.AnyConstructor,
    source: Source,
    packId?: string | null,
  ): Source;

  /**
   * Retrieve all active packages that provide art mappings in priority order.
   */
  getPackages(): CompendiumArt.Descriptor[];

  /**
   * Collate Document art mappings from active packages.
   * @internal
   */
  protected _registerArt(): Promise<void>;

  #CompendiumArt: true;
}

declare namespace CompendiumArt {
  interface Any extends AnyCompendiumArt {}
  interface AnyConstructor extends Identity<typeof CompendiumArt> {}

  interface Info {
    /**
     * The path to the Document's image.
     * @remarks Renamed from {@linkcode Info.actor | actor} in v14.367, and now applies to `Item` as well as
     * `Actor`.
     */
    img?: string | undefined;

    /**
     * The path to the Actor's portrait image.
     * @deprecated since v14.367. Renamed to {@linkcode Info.img | img}.
     * {@linkcode CompendiumArt.applyArt | CompendiumArt#applyArt} still reads this as a fallback
     * (`art.img ?? art.actor`), so existing art mappings keep working, but
     * {@linkcode foundry.documents.collections.CompendiumCollection.getIndex | CompendiumCollection#getIndex}
     * reads `img` only.
     */
    actor?: string | undefined;

    /**
     * The path to the token image, or an object to merge into the Actor's prototype token.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    token?: string | SchemaField.AssignmentData<PrototypeToken.Schema> | undefined;

    /**
     *An optional credit string for use by the game system to apply in an appropriate place.
     */
    credit?: string | undefined;
  }

  /**
   * A mapping of compendium pack IDs to Document IDs to art information.
   */
  type Mapping = Record<string, Record<string, Info>>;

  interface Descriptor {
    /**
     * The ID of the package providing the art.
     */
    packageId: string;

    /**
     * The title of the package providing the art.
     */
    title: string;

    /**
     * The path to the art mapping file.
     */
    mapping: string;

    /**
     * An optional credit string for use by the game system to apply in an appropriate place.
     */
    credit: string | undefined;

    /**
     * The package's user-configured priority.
     */
    priority: number;
  }
}

export default CompendiumArt;

declare abstract class AnyCompendiumArt extends CompendiumArt {
  constructor(...args: never);
}
