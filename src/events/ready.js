module.exports = {
	name: 'ready',
	once: true,

	async run(bot) {
		console.log(`Bot ${bot.user.tag} foi iniciado com sucesso!`);

		// online idle dnd invisible
		// 0 - PLAYING
		// 1 - STREAMING
		// 2 - LISTENING
		// 3 - WATCHING
		// 4 - CUSTOM
		// 5 - COMPETING

		bot.user.setPresence({
			status: 'online', // online idle dnd invisible
			activities: [
				{
					name: 'Sou o bot da Nawat Games',
					type: 0,
					// url: 'https://www.instagram.com/nawat.maua/',
				},
			],
		});

		bot.bdays = require('../aniversarios.json');
		bot.meetings = require('../reunioes.json');
		const birthdaysjs = require('../commands/utils/aniversario');
		const meetingsjs = require('../commands/utils/reuniao');

		Object.entries(bot.bdays).forEach((bday) =>
			birthdaysjs.set(
				bday[0],
				bday[1].dia,
				bday[1].mes,
				bday[1].ano,
				bday[1].guilds,
				bot
			)
		);

		Object.entries(bot.meetings).forEach((guild) =>
			guild[1].forEach((meeting) => {
				meetingsjs.set(
					guild[0],
					meeting.cargo,
					meeting.descricao,
					meeting.dia,
					meeting.hora,
					meeting.minuto,
					meeting.canal,
					meeting.repetir,
					bot
				);
			})
		);
	},
};
