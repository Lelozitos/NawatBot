const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('falar')
		.setNameLocalizations({})
		.setDescription('Manda uma mensagem personalizada')
		.setDescriptionLocalizations({})
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('texto')
				.setDescription('Manda só um texto personalizado')
				.addStringOption((option) =>
					option
						.setName('texto')
						.setDescription('Mensagem para mandar')
						.setMaxLength(2000)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('embed')
				.setDescription('Manda um embed personalizado')
				.addStringOption((option) =>
					option
						.setName('titulo')
						.setDescription('Título do embed')
						.setMaxLength(256)
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName('descricao')
						.setDescription('Descrição do embed')
						.setMaxLength(2048)
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName('cor')
						.setDescription('Cor do embed')
						.setRequired(false)
						.setChoices(
							{ name: 'Amarelo', value: '#FFFF00' },
							{ name: 'Azul Escuro', value: '#0000FF' }
						)
				)
				.addStringOption((option) =>
					option
						.setName('imagem')
						.setDescription('URL da thumbnail')
						.setMaxLength(2048)
						.setRequired(false)
				)
		),

	async run(interaction, bot) {
		interaction.reply({ content: 'Enviando...', ephemeral: true });

		if (interaction.options.getSubcommand() === 'texto')
			return interaction.channel.send(interaction.options.getString('texto'));

		const titulo = interaction.options.getString('titulo') || ' ';
		const descricao = interaction.options.getString('descricao') || ' ';
		const cor = interaction.options.getString('cor') || '#7B7D7D';
		const imagem = interaction.options.getString('imagem') || null;

		const embed = new EmbedBuilder()
			.setTitle(titulo)
			.setDescription(descricao)
			.setColor(cor)
			.setThumbnail(imagem)
			.setFooter({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: interaction.user.username,
			})
			.setTimestamp();

		await interaction.channel.send({ embeds: [embed] });
	},
};
