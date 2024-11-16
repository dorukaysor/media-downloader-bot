import { Bot } from "telegraf";
import axios from "axios";

export default function reportCommand(bot: Bot) {
  const MODERATOR_CHAT_ID = "MODERATOR_CHAT_ID"; // Replace with the moderator's Telegram Chat ID

  bot.command("report", async (ctx) => {
    const issue = ctx.message?.text?.split(" ").slice(1).join(" ");
    if (!issue) {
      return ctx.reply("❌ Please specify the issue you want to report.\nUsage: /report <issue>");
    }

    ctx.reply("⏳ Your issue is being processed. Please wait...");

    try {
      // Call OpenAI API for an AI-based response
      const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `The user reported this issue: "${issue}". Provide a professional response.` },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiAnswer = openaiResponse.data.choices[0]?.message?.content || "No response generated.";

      // Send the report to moderators
      await ctx.telegram.sendMessage(
        MODERATOR_CHAT_ID,
        `⚠️ *New Report Received:*\n\n*Issue:* ${issue}\n\n*AI Response:* ${aiAnswer}`,
        { parse_mode: "Markdown" }
      );

      ctx.reply("✅ Your issue has been reported. Our moderators will review it shortly.");
    } catch (error) {
      console.error("Error in OpenAI API:", error);
      ctx.reply("❌ There was an error processing your report. Please try again later.");
    }
  });
}