import { Telegraf } from "telegraf";
import startCommand from "./commands/start";
import helpCommand from "./commands/help";
import downloadCommand from "./commands/download";
import configCommand from "./commands/config";
import { loadSettings } from "./utils/configLoader";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("Unable to find any bot tokens!!");
}

const bot = new Telegraf(BOT_TOKEN);

// Load settings
const settings = loadSettings();

// Register Commands
bot.start(startCommand);
bot.help(helpCommand);
bot.command("download", downloadCommand);
bot.command("config", configCommand);

// Handle Callback Queries
bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery?.data;

  if (data === "start") {
    startCommand(ctx);
  } else if (data === "help") {
    helpCommand(ctx);
  } else if (data === "download") {
    downloadCommand(ctx);
  } else if (data === "config") {
    configCommand(ctx);
  } else if (data === "cancel") {
    ctx.reply("Action canceled.");
  }
});

// Launch bot
bot.launch()
  .then(() => console.log("Bot is running!"))
  .catch((err) => console.error("Bot launch failed", err));

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));