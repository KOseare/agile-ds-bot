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
      case '/daily':
        dailyCommand(msg, msgArr)
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

const alreadySelectedUsers = []
async function dailyCommand (msg, msgArr) {
  if(!msgArr[1]) {
    const dailyChannel = await getChannel(msg, 'Daily', true, true).fetch(true)
    if (!dailyChannel) {
      msg.channel.send('ERROR: Daily channel not found')
    } else {
      console.log('Members: ', dailyChannel.members)
      // console.log('Daily channel:', dailyChannel)
      // const members = await dailyChannel.members
      // console.log('Daily members:', members)
      // const users = []
      // for (member of members.values()) {
      //   console.log('Member:', member)
      //   users.push(member.user)
      // }
      // console.log('Daily users:', users)
      // const availableUsers = 
      // const msgText = `Te toca ${}`
      // msg.channel.send(msgText)
    }
  }
}

const members = [{
  id: '802571453274390588',
  nickname: 'Dario',
  alreadySelected: false
},
{
  id: 'asdasdasd4390588',
  nickname: 'Juanito',
  alreadySelected: false
}]
const pickMember = () => {
  const leftMembers = members.filter(mem => !mem.alreadySelected)
  const randNumber = Math.floor(Math.random() * leftMembers.length)
  const selectedMember = leftMembers[randNumber]
  selectedMember.alreadySelected = true
  return selectedMember
}

const updateMembers = (newMembers) => {
  newMembers.forEach(newMem => {
    const alreadyPickedMember = members.find(mem => mem.id === newMem.id)
    if (!alreadyPickedMember) {
      members.push({
        id: newMem.id,
        nickname: newMem.nickname,
        alreadySelected: false
      })
    }
  })
  return members
}
