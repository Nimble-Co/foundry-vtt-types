import { expectTypeOf } from "vitest";

// @ts-expect-error A Folder requires name.
new Folder.implementation();

// @ts-expect-error A Folder requires name.
new Folder.implementation({});

const folder = new Folder.implementation({ name: "foo", type: "JournalEntry" });
expectTypeOf(folder).toEqualTypeOf<Folder.OfType<"JournalEntry">>();

expectTypeOf(folder.depth).toEqualTypeOf<number | undefined>();
expectTypeOf(folder.children).toEqualTypeOf<Folder.ChildNode[] | undefined>();
expectTypeOf(folder.displayed).toEqualTypeOf<boolean>();
expectTypeOf(folder.expanded).toEqualTypeOf<boolean>();
expectTypeOf(folder.ancestors).toEqualTypeOf<Folder.Stored[]>();

// bugged in 13.351: https://github.com/foundryvtt/foundryvtt/issues/13545
expectTypeOf(Folder.createDialog()).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.getSubfolders(true)).toEqualTypeOf<Folder.Stored<"JournalEntry">[]>();
expectTypeOf(folder.getParentFolders()).toEqualTypeOf<Folder.Stored<"JournalEntry">[]>();

// v14.367: `pack` is optional, defaults to `null`, and now accepts a `CompendiumCollection`
declare const pack: foundry.documents.collections.CompendiumCollection.Any;
expectTypeOf(folder.exportDialog()).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.exportDialog(null)).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.exportDialog(undefined)).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.exportDialog("some.pack")).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.exportDialog(pack)).toEqualTypeOf<Promise<void>>();
expectTypeOf(folder.exportDialog(pack, { merge: false, keepId: false, keepFolders: false })).toEqualTypeOf<
  Promise<void>
>();

// @ts-expect-error `pack` is a pack ID or a CompendiumCollection, not a number
folder.exportDialog(3);
