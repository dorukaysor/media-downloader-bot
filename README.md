# Media Downloader Bot

A powerful Telegram bot that allows users to download media from various links and formats. Moderators can manage settings, supported formats, and customize the bot dynamically through commands.

---

## Features
- Detects media links in messages and automatically downloads the media.
- Moderators can dynamically manage bot settings using commands.
- AI-powered issue reporting and moderation responses via the OpenAI API.
- Supports automatic database cleanup (`autoCronDB`) for efficient storage management.
- Flexible deployment options: Local, Heroku, or Vercel.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Deploy Locally](#deploy-locally)
4. [Deploy on Heroku](#deploy-on-heroku)
5. [Deploy on Vercel](#deploy-on-vercel)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

---

## Prerequisites
1. [Node.js](https://nodejs.org/en/download/) (v18 or higher)
2. Telegram Bot Token (from [@BotFather](https://core.telegram.org/bots))
3. OpenAI API Key (from [OpenAI](https://openai.com))
4. Optional:
   - Heroku CLI ([Install Guide](https://devcenter.heroku.com/articles/heroku-cli))
   - Vercel CLI ([Install Guide](https://vercel.com/docs/cli))

---

## Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
BOT_TOKEN=<Your_Telegram_Bot_Token>
OPENAI_API=<Your_OpenAI_API_Key>
```

---

## Deploy Locally

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

2. Install dependencies:

```bash
npm install
```

3. Start the bot:

```bash
npm start
```

4. Keep the bot running 24/7 using PM2:

- Install PM2:

```bash
npm install pm2 -g
```

- Start the bot using PM2:

```bash
pm2 start dist/index.js --name media-downloader-bot
```

- Save the PM2 process list:

```bash
pm2 save
```

- Enable PM2 startup script:

```bash
pm2 startup
```

---

## Deploy on Heroku

1. Install the Heroku CLI:

```bash
npm install -g heroku
```

2. Login to Heroku:

```bash
heroku login
```

3. Create a new Heroku app:

```bash
heroku create media-downloader-bot
```

4. Add your environment variables to Heroku:

```bash
heroku config:set BOT_TOKEN=<Your_Telegram_Bot_Token>
heroku config:set OPENAI_API=<Your_OpenAI_API_Key>
```

5. Push the repository to Heroku:

```bash
git push heroku main
```

6. Scale the bot to run continuously:

```bash
heroku ps:scale web=1
```


## Keep Running 24/7

Heroku may suspend free-tier apps after inactivity. To keep the bot alive:

- Use a third-party service like [Kaffeine](https://kaffiene.com) to ping your app periodically.



---

## Deploy on Vercel

Steps to Deploy

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Link the project to Vercel:

```bash
vercel link
```

4. Add your environment variables:

```bash
vercel env add
```

When prompted, add:

- BOT_TOKEN: Your Telegram Bot Token

- OPENAI_API: Your OpenAI API Key


5. Deploy the bot:

```bash
vercel deploy
```

6. Set the deployment to "always running":

- Upgrade to the Pro plan or use external ping services to keep the deployment alive.

---

## Usage

Starting the Bot

Once deployed, the bot will automatically respond to the following commands:

- /start: Welcome message and basic usage instructions.

- /help: Provides a list of all available commands.

- /report <issue>: Report issues to moderators with an AI-generated response.

- /settings: Manage bot settings (moderators only).

Example Commands

Add a supported format:

```
/settings addformat video/mkv
```

Enable auto database cleanup:

```
/settings cron true
```


---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for any feature requests or bug fixes.


---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.