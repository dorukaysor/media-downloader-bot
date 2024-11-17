import { Telegraf } from "telegraf";
import axios from "axios";
import fsExtra from "fs-extra";
import path from "path";
import settings from "../../config/settings.json";

export default function messageHandler(bot: Telegraf) {
  // Helper function to extract links from a message
  const extractLink = (text: string | undefined): string | null => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  bot.on("message", async (ctx) => {
    let userMessage;
    if ('text' in ctx.message) {
      userMessage = ctx.message.text;
    };
    const link = extractLink(userMessage);
    
    if (link) {
      return ctx.reply("⏳ Processing your link, please wait...");
      

      try {
        // Fetch the media file
        let response;
        if (link) {
          response = await axios.get(link, { responseType: "stream" });
        } else {
          response = "Nullified Link!"
        };
        const contentType = response.headers["content-type"];

        // Validate against supported formats
        if (!settings.supportedFormats.includes(contentType)) {
          return ctx.reply("❌ Unsupported media format. Please check the file type and try again.");
        }

        // Generate file name and path
        const ext = contentType.split("/")[1];
        const filename = `downloaded-file.${ext}`;
        const filepath = path.join(__dirname, "../../downloads", filename);

        // Save the file
        await fsExtra.ensureFile(filepath);
        const writer = fsExtra.createWriteStream(filepath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          return ctx.replyWithDocument({ source: filepath }, { caption: settings.defaultCaption });
        });
        writer.on("error", () => {
          return ctx.reply("❌ Failed to process the media.");
        });
      } catch (err) {
        return ctx.reply("❌ Could not download the media. Ensure the link is correct and accessible.");
      }
    } else {
      return ctx.reply("🤖 I didn't recognize a valid link in your message. Use /help for guidance.");
    }
  });
}