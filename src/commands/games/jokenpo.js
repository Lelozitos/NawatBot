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
		.setName('jokenpo')
		.setNameLocalizations({})
		.setDescription('Jokenpo (Pedra Papel Tesoura)')
		.setDescriptionLocalizations({}),

	async run(interaction, bot) {
		const rock = new ButtonBuilder()
			.setCustomId('🗻')
			.setEmoji('🗻')
			.setStyle(ButtonStyle.Secondary);
		const paper = new ButtonBuilder()
			.setCustomId('📃')
			.setEmoji('📃')
			.setStyle(ButtonStyle.Secondary);
		const scissors = new ButtonBuilder()
			.setCustomId('✂')
			.setEmoji('✂')
			.setStyle(ButtonStyle.Secondary);

		const embed = new EmbedBuilder()
			.setTitle('Jokenpô')
			.setColor('#7B7D7D')
			.setFooter({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: interaction.user.username,
			});

		const button = await interaction.reply({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(rock, paper, scissors)],
		});

		const buttonCollector = button.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 60 * 1000,
		});

		buttonCollector.on('collect', async (b) => {
			await b.deferUpdate();
			const playerChoice = b.customId;
			const options = ['🗻', '📃', '✂'];
			const botChoice = options[Math.floor(Math.random() * options.length)];

			if (
				(playerChoice === '🗻' && botChoice === '✂') ||
				(playerChoice === '📃' && botChoice === '🗻') ||
				(playerChoice === '✂' && botChoice === '📃')
			) {
				embed.setDescription('Você ganhou!');
				embed.setColor('#00FF00');
			} else if (playerChoice === botChoice) {
				embed.setDescription('Empate!');
				embed.setColor('#FFFF00');
			} else {
				embed.setDescription('Você perdeu!');
				embed.setColor('#FF0000');
			}

			embed.setTitle(`Jokenpô  ${playerChoice} X ${botChoice}`);

			interaction.editReply({ embeds: [embed] });
		});

		buttonCollector.on('end', async () => {
			await interaction.editReply({ components: [] });
		});
	},
};
