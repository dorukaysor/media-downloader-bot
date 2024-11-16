import { Bot } from "telegraf";

export default function helpCommand(bot: Bot) {
  bot.command("help", (ctx) => {
    ctx.reply(
      "ℹ️ *Help Menu*\n\n" +
      "/start - Start interacting with the bot\n" +
      "/help - View help menu\n" +
      "/download <link> - Fetch media from the link\n" +
      "/report <issue> - Report any issues",
      { parse_mode: "Markdown" }
    );
  });
}