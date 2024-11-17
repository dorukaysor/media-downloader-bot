import { Telegraf } from "telegraf";
import fsExtra from "fs-extra";
import path from "path";
import handleDatabase from "../handlers/cronHandler";
import settings from "../../config/settings.json";
import mods from "../../config/mods.json"

const settingsFilePath = path.join(__dirname, "../../config/settings.json");
let databaseHandler: cronDatabase | null = null;

// Helper function to save updated settings to the file
const saveSettings = async (newSettings: any) => {
  try {
    await fsExtra.writeJSON(settingsFilePath, newSettings, { spaces: 2 });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw new Error("❌ Failed to save settings.");
  }
};

export default function settingsCommand(bot: Telegraf) {
  // Initialize DatabaseHandler when the command is loaded
  if (!databaseHandler) {
    databaseHandler = new cronDatabase(settings.autoCronDB);
  }

  bot.command("settings", async (ctx) => {
    const senderChatId = ctx.message?.chat?.id;
    const args = ctx.message?.text?.split(" ").slice(1);

    // Authorization (replace with your moderator ID check)
    const isModerator = mods.moderators.find((mod) => mod.userId === Number(senderChatId));
    if (!isModerator) {
      return ctx.reply("❌ You are not authorized to use this command.");
    };

    if (!args || args.length === 0) {
      return ctx.reply(
        "⚙️ Bot Settings Commands:\n" +
          "1️⃣ `/settings view` - View current settings.\n" +
          "2️⃣ `/settings set <key> <value>` - Update a setting.\n" +
          "3️⃣ `/settings addformat <mime>` - Add a supported format.\n" +
          "4️⃣ `/settings removeformat <mime>` - Remove a supported format.\n" +
          "5️⃣ `/settings cron <true|false>` - Enable or disable autoCronDB.\n" +
          "Example: `/settings set defaultCaption Here is your file!`"
      );
    }

    const command = args[0].toLowerCase();

    try {
      if (command === "view") {
        // View current settings
        return ctx.replyWithMarkdown(
          `📖 *Current Settings:*\n\`\`\`${JSON.stringify(settings, null, 2)}\`\`\``
        );
      }

      if (command === "set") {
        // Update a specific setting key-value pair
        const key = args[1];
        const value = args.slice(2).join(" ");
        if (!key || !value) {
          return ctx.reply("❌ Usage: `/settings set <key> <value>`");
        }

        settings[key] = value;
        await saveSettings(settings);
        return ctx.reply(`✅ Successfully updated setting: ${key} = ${value}`);
      }

      if (command === "addformat") {
        // Add a new supported format
        const mime = args[1];
        if (!mime) {
          return ctx.reply("❌ Usage: `/settings addformat <mime>`");
        }

        if (settings.supportedFormats.includes(mime)) {
          return ctx.reply("⚠️ Format already exists in the supported formats.");
        }

        settings.supportedFormats.push(mime);
        await saveSettings(settings);
        return ctx.reply(`✅ Successfully added supported format: ${mime}`);
      }

      if (command === "removeformat") {
        // Remove a supported format
        const mime = args[1];
        if (!mime) {
          return ctx.reply("❌ Usage: `/settings removeformat <mime>`");
        }

        if (!settings.supportedFormats.includes(mime)) {
          return ctx.reply("⚠️ Format not found in the supported formats.");
        }

        settings.supportedFormats = settings.supportedFormats.filter((f: string) => f !== mime);
        await saveSettings(settings);
        return ctx.reply(`✅ Successfully removed supported format: ${mime}`);
      }

      if (command === "cron") {
        // Enable or disable autoCronDB
        const value = args[1]?.toLowerCase();
        if (value !== "true" && value !== "false") {
          return ctx.reply("❌ Usage: `/settings cron <true|false>`");
        }

        const booleanValue = value === "true";
        settings.autoCronDB = booleanValue;

        await saveSettings(settings);
        databaseHandler?.updateAutoCronDB(booleanValue);
        return ctx.reply(
          `✅ Successfully updated autoCronDB to ${booleanValue ? "enabled" : "disabled"}.`
        );
      }

      // Invalid sub-command
      return ctx.reply("❌ Invalid command. Use `/settings` for available commands.");
    } catch (error) {
      console.error("Error in settings command:", error);
      return ctx.reply("❌ An error occurred while processing your request.");
    }
  });
}

interface Settings {
  [key: string]: any;
  botName: string;
  botToken: string;
  defaultCaption: string;
  supportedFormats: string[];
  autoCronDB: boolean;
}