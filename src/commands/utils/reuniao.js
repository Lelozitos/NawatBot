const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');
const { scheduleJob } = require('node-schedule');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reuniao')
		.setNameLocalizations({})
		.setDescription('Marco uma reunião em um horário definido')
		.setDescriptionLocalizations({})
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('definir')
				.setDescription('Define uma reunião')
				.addRoleOption((option) =>
					option
						.setName('cargo')
						.setDescription('Cargo para notificar a todos')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('dia')
						.setDescription('Dia do aniversário')
						.setMinValue(1)
						.setMaxValue(31)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('mes')
						.setDescription('Mês do aniversário')
						.setChoices(
							{ name: 'Janeiro | 1', value: 1 },
							{ name: 'Fevereiro | 2', value: 2 },
							{ name: 'Março | 3', value: 3 },
							{ name: 'Abril | 4', value: 4 },
							{ name: 'Maio | 5', value: 5 },
							{ name: 'Junho | 6', value: 6 },
							{ name: 'Julho | 7', value: 7 },
							{ name: 'Agosto | 8', value: 8 },
							{ name: 'Setembro | 9', value: 9 },
							{ name: 'Outubro | 10', value: 10 },
							{ name: 'Novembro | 11', value: 11 },
							{ name: 'Dezembro | 12', value: 12 }
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('listar')
				.setDescription('Lista as suas próximas reuniões')
		),

	async run(interaction, bot) {
		const user = interaction.options.getUser('usuario');

		if (interaction.options.getSubcommand() === 'ver') {
			if (bot.bdays[user.id])
				interaction.reply(
					`O aniversário do ${user} é dia \`${bot.bdays[user.id].dia}/${
						bot.bdays[user.id].mes
					}\``
				);
			else
				interaction.reply(`O aniversário do ${user} ainda não foi definido!`);

			return;
		}

		let aniversario = {
			dia: interaction.options.getInteger('dia'),
			mes: interaction.options.getInteger('mes'),
			ano: interaction.options.getInteger('ano') || null,
			guilds: [interaction.guildId],
		};

		bot.bdays[user.id] = aniversario;

		writeFile(
			'./aniversarios.json',
			JSON.stringify(bot.bdays, null, 4),
			(err) => {
				if (err) {
					console.log(err);
					interaction.reply(`Erro ao definir o aniversário!`);
					return;
				}

				interaction.reply(`Aniversário definido com sucesso!`);

				this.set(
					user.id,
					aniversario.dia,
					aniversario.mes,
					aniversario.ano,
					aniversario.guilds,
					bot
				);
			}
		);
	},

	async set(id, day, month, year, guilds, bot) {
		let currentDate = new Date();

		let birthDate = new Date(currentDate.getFullYear(), month - 1, day, 00, 01);

		const user = await bot.users.fetch(id);

		scheduleJob(birthDate, () => {
			const embed = new EmbedBuilder()
				.setAuthor({
					name: user.username,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.setTitle(`🎉 Feliz Aniversário!`)
				.setDescription(`${user} **• ${day}/${month}**`)
				.setColor('#0099FF')
				.setThumbnail(
					'https://usagif.com/wp-content/uploads/gif/feliz-aniversario-gato-18.gif'
				);

			guilds.forEach((guild) => {
				let bdayChannel = bot.guilds.cache
					.get(guild)
					.channels.cache.find((channel) => channel.name === 'nawat');

				bdayChannel.send({ embeds: [embed] });
			});
		});
	},
};
