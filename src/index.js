require('dotenv').config({ path: '../.env' });
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});

bot.commands = new Collection();
bot.commandArray = [];
bot.color = 0xe80074;

readdirSync('./functions/handlers')
	.filter((f) => f.endsWith('.js'))
	.forEach((functionFile) => {
		require(`./functions/handlers/${functionFile}`)(bot);
	});

bot.login(process.env.TOKEN);
