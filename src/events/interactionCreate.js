module.exports = {
	name: 'interactionCreate',
	once: false,

	async run(interaction, bot) {
		if (interaction.isChatInputCommand()) {
			const { commands } = bot;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) return;

			try {
				await command.run(interaction, bot);
			} catch (err) {
				console.log(err);
				await interaction.reply({
					content: 'Algo deu errado!',
					ephemeral: true,
				});
			}
			// } else if (interaction.isButton()) {
			// 	console.log(interaction.customId);
		}
	},
};
