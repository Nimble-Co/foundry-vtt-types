/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

// Added in v14.365. Foundry moved these two types here from `autocomplete.mjs`.
//
// FIXME: `Autocomplete` has no declaration in this package, so these two types have no home
// namespace to point at yet. Give them one when `foundry.applications.ux.Autocomplete` is declared.

export {};

type AutocompleteCallback = unknown;

type AutocompleteEntry = unknown;
