
/**
 * Returns the specified channel
 * @param {Object} client - Instance of Discord client
 * @param {string} channel - Channel name
 * @returns {Object} - Channel instance
 */
function getChannel(client, channel) {
  return client.channels.find(c => c.name === channel)
}


module.exports = {
  getChannel
}