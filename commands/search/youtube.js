const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class YouTubeCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'youtube',
            aliases: [
                'video'
            ],
            group: 'search',
            memberName: 'youtube',
            description: 'Searches YouTube for a video. (;youtube video)',
            examples: [';youtube video'],
            args: [{
                key: 'video',
                prompt: 'What would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let videoToSearch = encodeURI(args.video);
        try {
            let response = await request
                .get('https://www.googleapis.com/youtube/v3/search')
                .query({
                    part: 'snippet',
                    type: 'video',
                    maxResults: 1,
                    q: videoToSearch,
                    key: config.youtubekey
                });
            if (!response.body.items[0].snippet) return message.say(':x: Error! No Video Found!');
            const embed = new Discord.RichEmbed()
                .setColor(0xDD2825)
                .setTitle(response.body.items[0].snippet.title)
                .setDescription(response.body.items[0].snippet.description)
                .setAuthor(`YouTube - ${response.body.items[0].snippet.channelTitle}`, 'https://cdn3.iconfinder.com/data/icons/social-icons-5/607/YouTube_Play.png')
                .setURL(`https://www.youtube.com/watch?v=${response.body.items[0].id.videoId}`)
                .setThumbnail(response.body.items[0].snippet.thumbnails.default.url);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! An error has occurred! Try again later! (If this continues to occur, the daily quota may have been reached).");
        }
    }
};
