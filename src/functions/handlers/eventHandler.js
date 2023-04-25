const { readdirSync } = require('fs');

module.exports = (bot) => {
	bot.events = readdirSync('./events/');

	bot.events
		.filter((f) => f.endsWith('.js'))
		.forEach((eventFile) => {
			const event = require(`../../events/${eventFile}`);
			if (event.once)
				bot.once(event.name, (...args) => event.run(...args, bot));
			else bot.on(event.name, (...args) => event.run(...args, bot));
		});
};
