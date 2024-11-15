import { Context } from "telegraf";

const startCommand = (ctx: Context) => {
  ctx.reply("Welcome to Media Downloader Bot! Select an option to continue:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Help", callback_data: "help" }],
        [{ text: "Download Media", callback_data: "download" }]
      ],
    },
  });
};

export default startCommand;