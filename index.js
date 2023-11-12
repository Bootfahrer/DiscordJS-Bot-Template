// "node ." zum starten in die Konsole
require('dotenv').config();

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, ActivityType } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: ['Guilds','GuildMessages', 'GuildModeration', 'GuildMembers']
});

const commands = [];
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON())
	}
}



client.on("ready", () => {
    //get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for(const guildId of guild_ids){
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            {body: commands})
        .then(() => console.log("Successfully updated the commands for guild " + guildId))
        .catch(console.error);

    }

    client.user.setActivity('with the bois', {type: ActivityType.Playing})
    //client.user.setPresence({ activities: [{ name: 'adding new Features' }], status: 'idle' });
})

client.on("guildMemberAdd", guildMember => {
    let welcomeRole =  guildMember.guild.roles.cache.find(role => role.name === 'Member')
    
    guildMember.roles.add(welcomeRole)
})

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command."})
    }
})

client.login(process.env.TOKEN)