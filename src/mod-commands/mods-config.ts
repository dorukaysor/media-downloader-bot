import { Bot } from "telegraf";
import fsExtra from "fs-extra";
import path from "path";

const modsFilePath = path.join(__dirname, "../../config/mods.json");

export default function modsConfigCommand(bot: Bot) {
  // Helper function to load moderators from file
  const loadMods = async (): Promise<string[]> => {
    try {
      if (await fsExtra.pathExists(modsFilePath)) {
        const data = await fsExtra.readJSON(modsFilePath);
        return data.moderators || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error loading moderators:", error);
      throw new Error("❌ Failed to load moderators.");
    }
  };

  // Helper function to save moderators to file
  const saveMods = async (moderators: string[]) => {
    try {
      await fsExtra.writeJSON(modsFilePath, { moderators }, { spaces: 2 });
    } catch (error) {
      console.error("Error saving moderators:", error);
      throw new Error("❌ Failed to save moderators.");
    }
  };

  bot.command("mods", async (ctx) => {
    const senderChatId = String(ctx.message?.from?.id);
    const args = ctx.message?.text?.split(" ").slice(1);

    if (!args || args.length < 2) {
      return ctx.reply(
        "🔧 Moderator Management Commands:\n" +
          "1️⃣ `/mods add <user_id>` - Add a new moderator.\n" +
          "2️⃣ `/mods remove <user_id>` - Remove an existing moderator.\n" +
          "3️⃣ `/mods list` - List all current moderators.\n"
      );
    }

    const command = args[0].toLowerCase();
    const userId = args[1];

    try {
      // Load current moderators
      const currentMods = await loadMods();

      // Ensure the sender is a current moderator
      if (!currentMods.includes(senderChatId)) {
        return ctx.reply("❌ You are not authorized to manage moderators.");
      }

      if (command === "add") {
        if (!userId) {
          return ctx.reply("❌ Usage: `/mods add <user_id>`");
        }

        if (currentMods.includes(userId)) {
          return ctx.reply("⚠️ This user is already a moderator.");
        }

        currentMods.push(userId);
        await saveMods(currentMods);
        return ctx.reply(`✅ Successfully added user ${userId} as a moderator.`);
      }

      if (command === "remove") {
        if (!userId) {
          return ctx.reply("❌ Usage: `/mods remove <user_id>`");
        }

        if (!currentMods.includes(userId)) {
          return ctx.reply("⚠️ This user is not a moderator.");
        }

        const updatedMods = currentMods.filter((id) => id !== userId);
        await saveMods(updatedMods);
        return ctx.reply(`✅ Successfully removed user ${userId} from moderators.`);
      }

      if (command === "list") {
        return ctx.reply(
          "📜 *Current Moderators:*\n" + currentMods.map((id) => `- ${id}`).join("\n"),
          { parse_mode: "Markdown" }
        );
      }

      return ctx.reply("❌ Invalid command. Use `/mods` for available options.");
    } catch (error) {
      console.error("Error managing moderators:", error);
      ctx.reply("❌ An error occurred while processing your request.");
    }
  });
}