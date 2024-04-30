const { REST, Routes } = require('discord.js')
const fs = require('fs')
const {token, clientId} = require('./conf.json')
const path = require('path')

const commands = []

//get all the commands and put them into an array
const folderPath = path.join(__dirname, "commands")
const commandsFolders = fs.readdirSync(folderPath)
for(const folder of commandsFolders){
    const commandsPath = path.join(folderPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles){
        const filepath = path.join(commandsPath, file)
        const command = require(filepath)
        commands.push(command.data.toJSON())
    }
}

const rest = new REST().setToken(token);

//Get the id from the server you want to update from the parameters
for (let i = 2; i < process.argv.length; i++) {
	updateCommands(process.argv[i])
}

async function updateCommands(serverId) {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, serverId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}