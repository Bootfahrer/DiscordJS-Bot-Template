const { REST, Routes } = require('discord.js')
const fs = require('fs')
const {token, clientId, testId} = require('./conf.json')
const path = require('path')

const commands = []

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

process.argv.forEach((val) => {
	if(val === "test"){
		updateTestserver()
	} else if(val === "all"){
		updateAll()
	} else {
		console.log("Falscher Parameter angegeben");
	}
})

async function updateTestserver() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, testId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

async function updateAll() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}