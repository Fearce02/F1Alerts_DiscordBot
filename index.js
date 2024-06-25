require('dotenv').config(); 
const { Client, IntentsBitField} = require('discord.js');
const {token, channelId} = require ('./config');
const { CommandHandler } = require ('./commands');



const client = new Client({ 
    intents: [IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ] });



client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    
    
    if (!token || !channelId) {
        console.error('Please provide both DISCORD_BOT_TOKEN and CHANNEL_ID in the environment variables.');
    } else {
        client.login(token)
            .catch(error => {
                console.error('Error logging in:', error);
            });
    }

client.on('messageCreate', CommandHandler);
