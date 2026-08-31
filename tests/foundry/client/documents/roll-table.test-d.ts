import { expectTypeOf } from "vitest";

const table = new RollTable.implementation({ name: "Loot Table" });

expectTypeOf(table.thumbnail).toEqualTypeOf<typeof table.img>();
expectTypeOf(table.draw()).toEqualTypeOf<Promise<RollTable.Draw>>();
// v14: `messageMode` (a string key of CONFIG.ChatMessage.modes) replaces the deprecated `rollMode`.
expectTypeOf(table.draw({ messageMode: "publicroll" })).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.drawMany(3)).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.normalize()).toEqualTypeOf<Promise<RollTable.Implementation | undefined>>();
expectTypeOf(table.normalize({})).toEqualTypeOf<Promise<RollTable.Implementation | undefined>>();
expectTypeOf(table.normalize({ save: false })).toEqualTypeOf<Promise<RollTable.Implementation | undefined>>();
expectTypeOf(table.normalize({ save: undefined })).toEqualTypeOf<Promise<RollTable.Implementation | undefined>>();

// @ts-expect-error `save` must be a boolean
table.normalize({ save: "yes" });

expectTypeOf(table.resetResults()).toEqualTypeOf<Promise<TableResult.Stored[]>>();
expectTypeOf(table.roll()).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.roll({ normalize: false })).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.roll({ recursive: false, normalize: true, _depth: 2 })).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.roll({ normalize: undefined })).toEqualTypeOf<Promise<RollTable.Draw>>();

// @ts-expect-error `normalize` must be a boolean
table.roll({ normalize: "always" });

expectTypeOf(table.getResultsForRoll(5)).toEqualTypeOf<TableResult.Stored[]>();
expectTypeOf(table.prepareDerivedData()).toEqualTypeOf<void>();

declare const folder: Folder.Implementation;
expectTypeOf(RollTable.fromFolder(folder)).toEqualTypeOf<Promise<RollTable.Stored | undefined>>();

// `rollMode` is deprecated since v14 (until v16) in favor of `messageMode`.
table.draw({ rollMode: "gmroll" });
