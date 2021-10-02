const {getChannel} = require('./helpers')

module.exports = function (msg) {
  if (msg.author.bot) return false;
  console.log(`Msg received: ${msg.content}`)

  if (msg.content.startsWith('/')) {
    const msgArr = msg.content.split(' ')

    switch (msgArr[0]) {
      case '/help':
        helpCommand(msg, msgArr)
        break
      default:
        commandNotFound(msg, msgArr[0])
        break
    }
  }
}

function commandNotFound (msg, command) {
  const msgText = `Command '${command}' not found`
  msg.channel.send(msgText)
}

function helpCommand (msg, msgArr) {
  if(!msgArr[1]) {
    const msgText = `Available commands:

    /daily [...options]
    /help [command]
    `
    msg.channel.send(msgText)
  } else {
    let msgText = ''
    switch (msgArr[1]) {
      case 'daily': 
        msgText = `/daily [...options]

        If an option isn't given, the command will select an user from the Daily voice channel

        List of options:
        --reset   Resets the daily
        `
        msg.channel.send(msgText)
        break
      case 'help':
        msgText = `/help [command]

        Gives more information about the command.

        [command] is one of the following:
          daily, help
        `
        msg.channel.send(msgText)
        break
      default:
        commandNotFound(msg, msgArr[1])
        break
    }
  }
}