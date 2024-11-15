import { Context } from "telegraf";
import fs from "fs";
import path from "path";
import { loadOwners, loadSettings } from "../utils/configLoader";

const settingsPath = path.join(__dirname, "../../config/settings.json");

const configCommand = (ctx: Context) => {
  const userId = String(ctx.from?.id);
  const owners = loadOwners();

  if (!owners.includes(userId)) {
    ctx.reply("You are not authorized to use this command.");
    return;
  }

  const settings = loadSettings();
  ctx.reply(`Current Settings:\n${JSON.stringify(settings, null, 2)}`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Update Auto-Delete Time", callback_data: "update_autodeletetime" }],
        [{ text: "Back to Help", callback_data: "help" }],
      ],
    },
  });

  ctx.telegram.on("callback_query", (callbackQueryCtx) => {
    const callbackData = callbackQueryCtx.callbackQuery?.data;

    if (callbackData === "update_autodeletetime") {
      callbackQueryCtx.reply("Send the new auto-delete time (in seconds):", {
        reply_markup: [{ text: "Cancel", callback_data: "cancel" }],
      });

      callbackQueryCtx.telegram.on("text", (textCtx) => {
        const newTime = parseInt(textCtx.message?.text || "0", 10);
        if (isNaN(newTime) || newTime <= 0) {
          textCtx.reply("Invalid time. Provide a positive number.");
          return;
        }

        settings.autoDeleteTime = newTime;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        textCtx.reply(`Auto-delete time updated to ${newTime} seconds.`);
      });
    }
  });
};

export default configCommand;