const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('contar')
		.setNameLocalizations({})
		.setDescription('Conta o tamanho do texto')
		.setDescriptionLocalizations({})
		.addStringOption((option) =>
			option
				.setName('texto')
				.setDescription('Mensagem a contar')
				.setRequired(true)
		),

	async run(interaction, bot) {
		interaction.reply(`${interaction.options.getString('texto').length}`);
	},
};
