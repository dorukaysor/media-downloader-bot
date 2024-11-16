import { Telegraf } from "telegraf";
import dotenv from "dotenv";

//Commands [ users ]
import startCommand from "./user-commands/start";
import helpCommand from "./user-commands/help";
import reportCommand from "./user-commands/report";

//Commands [ mods ]
import settingsCommand from "./mod-commands/settings";
import modsConfigCommand from "./mod-commands/mods-config.ts";

//Handlers
import messageHandler from "./handlers/messageHandler";
import moderatorHandler from "./handlers/moderatorHandler";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

//register commands [ users ]
startCommand(bot);
helpCommand(bot);
reportCommand(bot);

//register commands [ mods ]
settingsCommand(bot);
modsConfigCommand(bot);

//handlers
messageHandler(bot);
moderatorHandler(bot);

bot.launch().then(() => console.log("✅ Bot is running!"));