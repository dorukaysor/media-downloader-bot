import { Context } from "telegraf";
import { downloadMedia } from "../utils/downloader";
import path from "path";
import fs from "fs";

const downloadCommand = async (ctx: Context) => {
  const userId = ctx.from?.id;

  ctx.reply("Please provide the media link you want to download:", {
    reply_markup: {
      inline_keyboard: [{ text: "Cancel", callback_data: "cancel" }],
    },
  });

  ctx.telegram.on("text", async (messageCtx) => {
    const link = messageCtx.message?.text;

    if (!link.startsWith("http")) {
      messageCtx.reply("Invalid link! Please provide a valid URL.");
      return;
    }

    try {
      const filePath = await downloadMedia(link);
      const stats = fs.statSync(filePath);

      // Telegram file size limit check (50 MB)
      if (stats.size > 52428800) {
        ctx.reply("The downloaded file exceeds Telegram's size limit of 50 MB.");
        return;
      }

      const absolutePath = path.resolve(filePath);
      const fileStream = fs.createReadStream(absolutePath);

      await ctx.telegram.sendDocument(
        userId,
        { source: fileStream, filename: path.basename(filePath) },
        { caption: "Here is your downloaded media." }
      );

      ctx.reply("Media sent successfully!", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Download Another", callback_data: "download" }],
            [{ text: "Back to Help", callback_data: "help" }],
          ],
        },
      });

      const settings = loadSettings();
      if (settings.autoDelete) {
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, settings.autoDeleteTime * 1000);
      }
    } catch (error) {
      ctx.reply(`Failed to download media: ${error.message}`);
    }
  });
};

export default downloadCommand;