import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

expectTypeOf(new ChatMessage.implementation()).toEqualTypeOf<ChatMessage.Implementation>();
expectTypeOf(new ChatMessage.implementation({})).toEqualTypeOf<ChatMessage.Implementation>();

// v14: `applyMode` is the replacement for the now-deprecated `applyRollMode`. The mode is a key of
// `CONFIG.ChatMessage.modes`; core registers these five, modules may register more (hence any string).
expectTypeOf(ChatMessage.applyMode({})).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "public")).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "gm")).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "blind")).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "self")).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "ic")).toEqualTypeOf<ChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "module.customMode")).toEqualTypeOf<ChatMessage.CreateData>();

/* eslint-disable @typescript-eslint/no-deprecated -- exercising the deprecated-since-v14 applyRollMode surface */
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.BLIND),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PRIVATE),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PUBLIC),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.SELF),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
/* eslint-enable @typescript-eslint/no-deprecated */

declare module "fvtt-types/configuration" {
  namespace CONFIG {
    namespace Dice {
      interface RollModes {
        "custom-roll-mode": "Some Custom Roll Mode";
      }
    }
  }
}

test("Regression test for CONFIG.Dice.rollModes as choices", () => {
  new foundry.data.fields.StringField({
    blank: true,
    required: true,
    choices: CONFIG.Dice.rollModes,
  });
});

expectTypeOf(
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  ChatMessage.applyRollMode({}, "custom-roll-mode"),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();

// @ts-expect-error "unknown-roll-mode" is not a valid roll mode
// eslint-disable-next-line @typescript-eslint/no-deprecated
ChatMessage.applyRollMode({}, "unknown-roll-mode");

expectTypeOf(ChatMessage.getSpeaker()).toEqualTypeOf<ChatMessage.SpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({})).toEqualTypeOf<ChatMessage.SpeakerData>();
if (game instanceof Game) {
  expectTypeOf(ChatMessage.getSpeaker({ scene: game.scenes?.active })).toEqualTypeOf<ChatMessage.SpeakerData>();
  expectTypeOf(ChatMessage.getSpeaker({ actor: game.user?.character })).toEqualTypeOf<ChatMessage.SpeakerData>();
  expectTypeOf(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: new TokenDocument.implementation(),
      alias: "Mario",
    }),
  ).toEqualTypeOf<ChatMessage.SpeakerData>();
}
expectTypeOf(
  ChatMessage.getSpeaker({ token: new TokenDocument.implementation() }),
).toEqualTypeOf<ChatMessage.SpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({ alias: "Mario" })).toEqualTypeOf<ChatMessage.SpeakerData>();

expectTypeOf(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker())).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(ChatMessage.getWhisperRecipients("Mario")).toEqualTypeOf<User.Stored[]>();

const chat = new ChatMessage.implementation();
expectTypeOf(chat.alias).toEqualTypeOf<string>();
expectTypeOf(chat.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(chat.isContentVisible).toEqualTypeOf<boolean>();
expectTypeOf(chat.isRoll).toEqualTypeOf<boolean>();
expectTypeOf(chat.rolls).toEqualTypeOf<Roll[]>();
expectTypeOf(chat.visible).toEqualTypeOf<boolean>();
expectTypeOf(chat.author).toEqualTypeOf<User.Stored | null>();
expectTypeOf(chat.prepareData()).toEqualTypeOf<void>();

// v14: instance `applyMode` replaces `applyRollMode`
expectTypeOf(chat.applyMode("public")).toEqualTypeOf<void>();
expectTypeOf(chat.applyMode("gm")).toEqualTypeOf<void>();
expectTypeOf(chat.applyMode("module.customMode")).toEqualTypeOf<void>();

/* eslint-disable @typescript-eslint/no-deprecated -- exercising the deprecated-since-v14 applyRollMode surface */
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.BLIND)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PRIVATE)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PUBLIC)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.SELF)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("roll")).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("custom-roll-mode")).toEqualTypeOf<void>();

// Ensure that each usage of `rollModes` is compatible.
declare const key: keyof typeof CONFIG.Dice.rollModes;
expectTypeOf(chat.applyRollMode(key)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(game.settings!.get("core", "rollMode"))).toEqualTypeOf<void>();

// @ts-expect-error "unknown-roll-mode" is not a valid roll mode
chat.applyRollMode("unknown-roll-mode");
/* eslint-enable @typescript-eslint/no-deprecated */

expectTypeOf(chat.getRollData()).toEqualTypeOf<AnyObject>();

// deprecated since v13 until v15
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(chat.getHTML()).toEqualTypeOf<Promise<JQuery>>();
expectTypeOf(chat.export()).toEqualTypeOf<string>();

expectTypeOf(chat.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();
expectTypeOf(chat.flags.core?.canPopout).toEqualTypeOf<boolean | undefined>();
await ChatMessage.create({
  flags: {
    core: {
      canPopout: true,
      sheetClass: "foobar",
    },
  },
});

// v14.367: `notify` and `scroll` are forwarded from `_onCreate` to `ChatLog#postOne`
await ChatMessage.create({}, { notify: false, scroll: true });
await ChatMessage.create({}, { notify: undefined, scroll: undefined });
await ChatMessage.create({}, { messageMode: "ic", chatBubble: true, notify: true, scroll: false });

// @ts-expect-error `notify` must be a boolean
await ChatMessage.create({}, { notify: "yes" });

// @ts-expect-error `scroll` must be a boolean
await ChatMessage.create({}, { scroll: "bottom" });

// v14.367: `notify` is forwarded from `_onUpdate` to `ChatLog#updateMessage`; `scroll` is create-only
await chat.update({}, { notify: true });
await chat.update({}, { notify: undefined });

// @ts-expect-error `scroll` is not an update option
await chat.update({}, { scroll: true });
