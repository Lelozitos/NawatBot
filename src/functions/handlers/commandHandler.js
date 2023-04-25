const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const { readdirSync } = require('fs');

module.exports = async (bot) => {
	bot.categories = readdirSync('./commands');

	bot.categories.forEach((categoryFolder) => {
		readdirSync(`./commands/${categoryFolder}`)
			.filter((f) => f.endsWith('.js'))
			.forEach((commandFile) => {
				const command = require(`../../commands/${categoryFolder}/${commandFile}`);
				bot.commands.set(command.data.name, command);

				bot.commandArray.push(command.data.toJSON());
				console.log(`Comando ${command.data.name} foi configurado!`);
			});
	});

	const botUserId = '1091932321348845568'; // Nawat Bot
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
	try {
		await rest.put(Routes.applicationCommands(botUserId), {
			body: bot.commandArray,
		});

		console.log('Comandos por / configurados!');
	} catch (err) {
		console.log(err);
	}
};
