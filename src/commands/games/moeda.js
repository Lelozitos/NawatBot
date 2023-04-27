const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	ComponentType,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moeda')
		.setNameLocalizations({})
		.setDescription('Cara ou Coroa')
		.setDescriptionLocalizations({}),

	async run(interaction, bot) {
		const embed = new EmbedBuilder()
			.setTitle(Math.random() >= 0.5 ? '👛 Cara' : '👛 Coroa')
			.setColor('Random')
			.setFooter({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: interaction.user.username,
			});

		const button = await interaction.reply({
			embeds: [embed],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('🔄')
						.setEmoji('🔄')
						.setStyle(ButtonStyle.Secondary)
				),
			],
		});

		const buttonCollector = button.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 30 * 1000,
		});

		buttonCollector.on('collect', async (b) => {
			await b.deferUpdate();

			embed
				.setTitle(Math.random() >= 0.5 ? '👛 Cara' : '👛 Coroa')
				.setColor('Random');

			interaction.editReply({ embeds: [embed] });
		});

		buttonCollector.on('end', async () => {
			try {
				await interaction.editReply({ components: [] });
			} catch (err) {}
		});
	},
};
