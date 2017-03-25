const commando = require('discord.js-commando');

module.exports = class FistBumpCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'fistbump',
            group: 'roleplay',
            memberName: 'fistbump',
            description: 'Fistbumps someone. (;fistbump @User)',
            examples: [';fistbump @User'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = args.thing;
        return message.say(`${message.author} *fist-bumps* ${thingToRoleplay} *badalalala*`);
    }
};
