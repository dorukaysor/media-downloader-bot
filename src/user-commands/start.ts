import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

export default function startCommand(bot: Telegraf) {
  bot.command("start", (ctx) => {
    ctx.reply("👋 Welcome to the Media Downloader Bot! Send a link, and I'll fetch the media for you.");
  });
}