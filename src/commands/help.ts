import { Context } from "telegraf";

const helpCommand = (ctx: Context) => {
  ctx.reply("Available commands:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Start", callback_data: "start" }],
        [{ text: "Download", callback_data: "download" }],
      ],
    },
  });
};

export default helpCommand;