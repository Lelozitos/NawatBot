const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setNameLocalizations({})
		.setDescription('Mostra o avatar de alguém')
		.setDescriptionLocalizations({})
		.addUserOption((option) =>
			option
				.setName('usuario')
				.setDescription('Usuário para pegar o avatar')
				.setRequired(false)
		),

	async run(interaction, bot) {
		let mention;
		if (interaction.options.data != 0)
			mention = interaction.options.getUser('usuario');
		else mention = interaction.user;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: mention.tag,
				iconURL: mention.displayAvatarURL({ dynamic: true }),
			})
			.setImage(mention.displayAvatarURL({ size: 4096, dynamic: true }))
			.setColor(0x00d2ff)
			.setFooter({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: interaction.user.username,
			});

		await interaction.reply({ embeds: [embed] });
	},
};
