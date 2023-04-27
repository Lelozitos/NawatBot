const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	ComponentType,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sorteio')
		.setNameLocalizations({})
		.setDescription('Cria um sorteio para todos participarem')
		.setDescriptionLocalizations({})
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption((option) =>
			option
				.setName('premio')
				.setDescription('O Prêmio do Sorteio')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('descricao')
				.setDescription('Descrição do Sorteio')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('tempo')
				.setDescription('Tempo que irá durar o sorteio')
				.setRequired(true)
				.setChoices(
					{ name: '1 minuto', value: 1 },
					{ name: '5 minutos', value: 5 },
					{
						name: '10 minutos',
						value: 10,
					},
					{
						name: '30 minutos',
						value: 30,
					},
					{
						name: '1 hora',
						value: 60,
					},
					{
						name: '6 horas',
						value: 6 * 60,
					},
					{
						name: '12 horas',
						value: 12 * 60,
					},
					{
						name: '1 dia',
						value: 24 * 60,
					},
					{
						name: '2 dias',
						value: 24 * 60 * 2,
					},
					{
						name: '4 dias',
						value: 24 * 60 * 4,
					},
					{
						name: '7 dias',
						value: 24 * 60 * 7,
					},
					{
						name: '30 dias',
						value: 24 * 60 * 30,
					}
				)
		),

	async run(interaction, bot) {
		interaction.reply({ content: 'Enviando...', ephemeral: true });
		const tempo = interaction.options.getInteger('tempo') * 60 * 1000;

		const button = new ButtonBuilder()
			.setCustomId('sorteio')
			.setEmoji('🎉')
			.setStyle(ButtonStyle.Secondary);

		const embed = new EmbedBuilder()
			.setTitle('**🎉 Sorteio!**')
			.setDescription(
				`Premio: ${interaction.options.getString(
					'premio'
				)}\n${interaction.options.getString(
					'descricao'
				)}\n\nData sorteio: ${new Date(Date.now() + tempo).toLocaleString()}`
			)
			.setColor('Fuchsia')
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setFooter({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: interaction.user.username,
			})
			.setTimestamp();

		let inscritos = [];

		const msg = await interaction.channel.send({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(button)],
		});

		const buttonCollector = msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: tempo,
		});

		buttonCollector.on('collect', async (b) => {
			if (inscritos.includes(b.user.id))
				return b.reply({
					content: 'Você já está inscrito no sorteio',
					ephemeral: true,
				});

			inscritos.push(b.user.id);
			b.reply({
				content: 'Você entrou para o sorteio',
				ephemeral: true,
			});
		});

		buttonCollector.on('end', async () => {
			try {
				button.setDisabled(true);
				msg.edit({
					embeds: [embed],
					components: [new ActionRowBuilder().addComponents(button)],
				});

				if (inscritos.length === 0) return msg.reply('oi');
				let ganhador = inscritos[Math.floor(Math.random() * inscritos.length)];

				await msg.reply(`o <@${ganhador}> ganhou!`);
			} catch (err) {}
		});
	},
};
// MUDAR EMBED PRINCIPAL MOSTRANDO QUE ACABOU
// MELHORAR MENSAGENS E DESIGN
