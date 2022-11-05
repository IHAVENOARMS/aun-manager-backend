const passwordGenerator = require('generate-password');
const { Telegraf } = require('telegraf');
const commands = require('./startup/commands');

const onChatJoinRequest = require('./events/onChatJoinRequest');
const onNewMember = require('./events/onNewMember');
const onSwearWord = require('./easterEggs/onSwearWord');
const onThankYou = require('./easterEggs/onThankYou');
const onMessage = require('./events/onMessage');
const onMemberLeaves = require('./events/onMemberLeaves');
const messagingModule = require('./utils/messages');

const joseph = new Telegraf(process.env.JOSEPH_TOKEN);

commands(joseph);
onChatJoinRequest(joseph);
onNewMember(joseph);
onMessage(joseph);
onMemberLeaves(joseph);

joseph.launch();

module.exports = {
  generatePassword: () => {
    return passwordGenerator.generate({ length: 10, numbers: true });
  },
  ...messagingModule(joseph),
};
