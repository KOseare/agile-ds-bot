
/**
 * Returns the specified channel
 * @param {Object} msg - Instance of Discord message
 * @param {string} channel - Channel name
 * @param {boolean} voiceChannel - Set to true for only return voice channels
 * @returns {Object} - Channel instance
 */
function getChannel(msg, channel, voiceChannel = false) {
  return msg.guild.channels.cache.find(c => c.name === channel && (!voiceChannel || c.isVoice()))
}

module.exports = {
  getChannel
}