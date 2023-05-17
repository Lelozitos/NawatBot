const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');
const { writeFile } = require('fs');
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
				.addStringOption((option) =>
					option
						.setName('descricao')
						.setDescription('Descrição da reunião')
						.setMaxLength(2000)
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option
						.setName('cargo')
						.setDescription('Cargo para notificar a todos')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('dia')
						.setDescription('Dia da semana')
						.setChoices(
							{ name: 'Domingo | 1', value: 0 },
							{ name: 'Segunda-Feira | 2', value: 1 },
							{ name: 'Terça-Feira | 3', value: 2 },
							{ name: 'Quarta-Feira | 4', value: 3 },
							{ name: 'Quinta-Feira | 5', value: 4 },
							{ name: 'Sexta-Feira | 6', value: 5 },
							{ name: 'Sábado | 7', value: 6 }
						)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('hora')
						.setDescription('Hora da reunião')
						.setMinValue(0)
						.setMaxValue(23)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('minuto')
						.setDescription('Minuto da reunião')
						.setMinValue(0)
						.setMaxValue(59)
						.setRequired(true)
				)
				.addChannelOption(
					(option) =>
						option
							.setName('canal')
							.setDescription('Canal para anunciar a reunião')
							.setRequired(true)
							.addChannelTypes(0) // canal de texto
				)
				.addBooleanOption((option) =>
					option
						.setName('repetir')
						.setDescription('Repetir todas as semanas?')
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remover')
				.setDescription('Remove uma reunião')
				.addIntegerOption((option) =>
					option.setName('reuniao').setDescription('Reunião a remover')
				)
		)

		.addSubcommand((subcommand) =>
			subcommand
				.setName('listar')
				.setDescription('Lista as suas próximas reuniões')
		),

	async run(interaction, bot) {
		if (interaction.options.getSubcommand() === 'listar') {
			console.log(interaction.member.roles.cache);
			// lista com botoes para ver todas as reunioes
			return;
		}

		if (interaction.options.getSubcommand() === 'remover') {
			// lista com autocomplete para apagar uma reuniao
			return;
		}

		let reuniao = {
			descricao: interaction.options.getString('descricao'),
			cargo: interaction.options.getRole('cargo').id,
			dia: interaction.options.getInteger('dia'),
			hora: interaction.options.getInteger('hora'),
			minuto: interaction.options.getInteger('minuto'),
			canal: interaction.options.getChannel('canal').id,
			repetir: interaction.options.getBoolean('repetir') || false,
		};

		if (!bot.meetings[interaction.guild.id])
			bot.meetings[interaction.guild.id] = [reuniao];
		else {
			for (i = 0; i < bot.meetings[interaction.guild.id].length; i++) {
				let reu = bot.meetings[interaction.guild.id][i];

				if (
					reu.cargo === reuniao.cargo &&
					reu.dia === reuniao.dia &&
					reu.hora === reuniao.hora &&
					reu.minuto === reuniao.minuto
				)
					return interaction.reply({
						content: 'Essa reunião já existe!',
						ephemeral: true,
					});
			}

			bot.meetings[interaction.guild.id].push(reuniao);
		}

		writeFile(
			'./reunioes.json',
			JSON.stringify(bot.meetings, null, 4),
			(err) => {
				if (err) {
					console.log(err);
					interaction.reply(`Erro ao definir a reunião!`);
					return;
				}
			}
		);

		this.set(
			interaction.guild.id,
			reuniao.cargo.id,
			reuniao.descricao,
			reuniao.dia,
			reuniao.hora,
			reuniao.minuto,
			reuniao.canal,
			reuniao.repetir,
			bot
		);

		interaction.reply(`Reunião definida com sucesso!`);
	},

	async set(guild, role, descricao, day, hour, minute, channel, repeat, bot) {
		guild = await bot.guilds.fetch(guild);
		role = await guild.roles.fetch(role);

		scheduleJob(`${minute} ${hour} * * ${day}`, () => {
			const embed = new EmbedBuilder()
				.setTitle(`🤝 Reunião`)
				.setDescription(`**• **${descricao}\n\n${role}`)
				.setColor('#696d98')
				.setThumbnail(
					'https://timeqube.com/wp-content/uploads/2018/07/coffee.gif'
				)
				.setTimestamp();

			// se nao encontrar o canal de texto
			// ver se o cargo tem acesso ao canal de texto

			guild.channels
				.fetch(channel)
				.then((channel) => channel.send({ embeds: [embed] }));
		});
	},
};
