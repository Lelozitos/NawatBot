const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exodo')
		.setNameLocalizations({})
		.setDescription('Move todos os usuários de um canal para outro')
		.setDescriptionLocalizations({})
		.setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
		.addChannelOption((option) =>
			option
				.setName('canal')
				.setDescription('Canal para mover os usuários')
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true)
		),

	async run(interaction, bot) {
		const channel = interaction.options.getChannel('canal');

		interaction.member.voice.channel.members.forEach((m) => {
			m.voice.setChannel(channel);
		});

		interaction.reply(`Todos os usuários movidos para \`${channel.name}\``);
	},
};
