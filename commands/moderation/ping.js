const { SlashCommandBuilder } = require('@discordjs/builders');

//simple command example
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('reply\'s with "Pong!"')
    ,
    async execute(interaction){
        await interaction.reply(`Pong!`)
    }
}