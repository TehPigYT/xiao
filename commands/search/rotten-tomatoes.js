const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { critic, audience } = require('../../assets/json/rotten-tomatoes');

module.exports = class RottenTomatoesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotten-tomatoes',
			aliases: ['tomato-meter'],
			group: 'search',
			memberName: 'rotten-tomatoes',
			description: 'Searches Rotten Tomatoes for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What movie would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await snekfetch
				.get('https://www.rottentomatoes.com/api/private/v2.0/search/')
				.query({
					limit: 10,
					q: query
				});
			if (!search.body.movies.length) return msg.say('Could not find any results.');
			const find = search.body.movies.find(m => m.name.toLowerCase() === query.toLowerCase()) || search.body.movies[0];
			const urlID = find.url.replace('/m/', '');
			const { text } = await snekfetch.get(`https://www.rottentomatoes.com/api/private/v1.0/movies/${urlID}`);
			const body = JSON.parse(text);
			const criticS = body.ratingSummary.allCritics;
			const audienceS = body.ratingSummary.audience;
			const embed = new MessageEmbed()
				.setColor(0xFFEC02)
				.setTitle(`${body.title} (${body.year})`)
				.setURL(`https://www.rottentomatoes.com${body.url}`)
				.setAuthor('Rotten Tomatoes', 'https://i.imgur.com/Sru8mZ3.jpg', 'https://www.rottentomatoes.com/')
				.setDescription(shorten(body.ratingSummary.consensus))
				.setThumbnail(body.posters.original)
				.addField('❯ Critic Score',
					criticS.meterValue ? `${critic[criticS.meterClass]} ${criticS.meterValue}%` : '???', true)
				.addField('❯ Audience Score',
					audienceS.meterScore ? `${audience[body.ratings.audience_rating]} ${audienceS.meterScore}%` : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
