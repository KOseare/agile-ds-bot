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

let members = [{
  id: '802571453274390588-',
  nickname: 'Dario',
  alreadySelected: false,
  online: true
},
{
  id: 'asdasdasd4390588',
  nickname: 'Juanito',
  alreadySelected: false,
  online: true
}]
const dailyCommand = async (msg, msgArr) => {
  if(!msgArr[1]) {
    const dailyChannel = await getChannel(msg, 'Daily', true, true).fetch(true)
    if (!dailyChannel) {
      msg.channel.send('ERROR: Daily channel not found')
    } else {
      console.log('Members: ', members)
      members = updateMembers(members, dailyChannel.members)
      const {selectedMember, memberIndex, last} = pickMember(members)
      console.log('Selected member: ', selectedMember)

      if (memberIndex >= 0) {
        members[memberIndex].alreadySelected = true
        msg.channel.send(`Te toca ${selectedMember.nickname}!`)
      }
      if (memberIndex === -1 || last) {
        msg.channel.send(`La daily termino.`)
      }
      
    }
  }
}

/**
 * Custom Member object to keep track of the already selected user
 * @typedef {Object} MemberItem
 * @property {string} id - The user id
 * @property {string} nickname - The user nickname
 * @property {boolean} alreadySelected - True if the user has already been selected
 */

/**
 * @typedef {Object} PickedMemberData
 * @property {MemberItem} selectedMember - The picked member
 * @property {number} memberIndex - The index of the member in the members array, if -1 means there are no more members
 * @property {boolean} last - True if the member is the last one
 */

/**
 * Picks a random unselected member and returns it
 * @param {Array<MemberItem>} members - Array of members
 * @returns {PickedMemberData} - The data of the picked member
 */
const pickMember = (members) => {
  const leftMembers = members.filter(mem => mem.online && !mem.alreadySelected)
  console.log('Left members: ', leftMembers)
  if (leftMembers.length > 0) {
    const randNumber = Math.floor(Math.random() * leftMembers.length)
    const selectedMember = leftMembers[randNumber]
    const memberIndex = members.findIndex(mem => mem.id === selectedMember.id)
    return {selectedMember, memberIndex, last: (leftMembers.length === 1)}
  } else {
    return {selectedMember: {}, memberIndex: -1, last: false}
  }
}

/**
 * Returns the members that are currently connected to the server,
 * if someone isn't connected anymore, it's marked as offline
 * @param {Array<MemberItem>} members - Array of members
 * @param {Array<Object>} channelMembers - Array of member objects from the discord API
 * @returns {Array<MemberItem>}
 */
const updateMembers = (members, channelMembers) => {
  const newMembers = members.map(mem => ({...mem, online: false}))
  channelMembers.forEach(chMem => {
    const alreadyPickedMember = members.find(mem => mem.id === chMem.id)
    if (alreadyPickedMember) {
      alreadyPickedMember.online = true
      newMembers.push(alreadyPickedMember)
    } else {
      newMembers.push({
        id: chMem.id,
        nickname: chMem.nickname,
        alreadySelected: false,
        online: true
      }) 
    }
  })
  return newMembers
}
