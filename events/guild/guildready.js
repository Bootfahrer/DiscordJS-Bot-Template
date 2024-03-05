const { Events } = require('discord.js')

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        //get all ids of the servers
        const guild_ids = client.guilds.cache.map(guild => guild.id);

        guild_ids.map(id => {
            console.log(`Updated commands for Guild ${id}!`);
        })

        client.user.setPresence({ activities: [{ name: 'adding new Features' }], status: 'idle' });
    }
}