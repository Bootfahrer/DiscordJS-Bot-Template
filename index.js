// enter "node ." or "node index.js" in the terminal in order to host the bot locally
const { token } = require('./conf.json')

const { Client, Collection } = require('discord.js');

const fs = require('fs');
const path = require('path');

//some basic intents
const client = new Client({
    intents: ['Guilds','GuildMessages', 'GuildModeration', 'GuildMembers']
});

// 
//<-- command handler -->
//
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

// 
//<-- event handler -->
//
const eventsFolderPath = path.join(__dirname, 'events');
const eventsFolder = fs.readdirSync(eventsFolderPath)
for(const folder of eventsFolder){
	const eventsPath = path.join(eventsFolderPath, folder)
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

client.login(token)