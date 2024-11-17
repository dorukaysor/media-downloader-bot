import { Telegraf } from "telegraf";
import axios from "axios";

export default function moderatorHandler(bot: Telegraf) {
  const MODERATOR_CHAT_ID = "MODERATOR_CHAT_ID"; // Replace with the moderator's Telegram Chat ID

  bot.on("message", async (ctx) => {
    const senderChatId = String(ctx.message?.chat?.id);
    let userMessage;
    if ('text' in ctx.message) {
      userMessage = ctx.message.text;
    };

    // Ensure the message is from the moderator
    if (senderChatId !== MODERATOR_CHAT_ID || !userMessage) return;

    ctx.reply("⏳ Generating AI-based response, please wait...");

    try {
      // Call OpenAI API for an AI-generated response
      const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert assistant responding to questions professionally." },
            { role: "user", content: userMessage },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = openaiResponse.data.choices[0]?.message?.content || "No response generated.";
      ctx.reply(`🤖 *AI Response:*\n\n${aiResponse}`, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Error in OpenAI API:", error);
      ctx.reply("❌ There was an error generating the response. Please try again later.");
    }
  });
}