require('dotenv').config()

const {Client, Intents} = require('discord.js')

const messagesHandler = require('./src/libs/messageHandler')

const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ] 
})

client.on('ready', () => {
  console.log(`Bot is ready as: ${client.user.tag}`)
})

client.on('messageCreate', messagesHandler)

client.login(process.env.BOT_TOKEN).catch(e => console.log('ERROR:', e))
