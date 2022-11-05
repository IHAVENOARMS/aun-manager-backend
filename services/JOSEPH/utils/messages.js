const { Telegraf } = require('telegraf');
const { Batch } = require('../../../models/batch');
const { Section } = require('../../../models/section');
const { TelegramGroup } = require('../../../models/telegramGroup');
const { User } = require('../../../models/user');
const joseph = require('../joseph');

const josephLog = (joseph) => async (message) => {
  await joseph.telegram.sendMessage(process.env.JOSEPH_LOG_CHAT_ID, message);
};

// const joseph = new Telegraf();
const sendMessageToUserWithId = (joseph) => async (_id, message) => {
  const user = await User.findById(_id);
  const log = josephLog(joseph);
  if (!user)
    return log(
      `Attempted to send a message to a user that does not exist... 
      id: ${_id}`
    );
  if (!user.josephChatId)
    return log(
      `Attempted to send a message to a user that is not linked to JOSEPH: ${user.arabicName}`
    );
  try {
    await joseph.telegram.sendMessage(user.josephChatId, message);
  } catch (exc) {
    await log(
      `Could not communicate with student ${user.arabicName} ${exc.message}`
    );
  }
};

const sendMessageToTelegramGroupWithId = (joseph) => async (_id, message) => {
  const log = josephLog(joseph);
  const telegramGroup = await TelegramGroup.findById(_id);
  if (!telegramGroup)
    return log(`Trying to send a message to a telegram group that does not exist...
  Id: ${_id}`);
  try {
    await joseph.telegram.sendMessage(telegramGroup.id, message);
  } catch (exc) {
    await log(`Could not communicate with telegram group....
    name: ${telegramGroup.name}
    type: ${telegramGroup.type}
    inviteLink: ${telegramGroup.inviteLink}
    ${exc.message}`);
  }
};

const sendMessageToBatchWithId = (joseph) => async (_id, message) => {
  const log = josephLog(joseph);
  const sendMessage = sendMessageToTelegramGroupWithId(joseph);
  const batch = await Batch.findById(_id);
  if (!batch)
    return log(
      `Trying to send a message to a batch that does not exist...
    id: ${_id}`
    );
  if (!batch.channel)
    return log(
      `Trying to send a message to a batch that does not have a channel
      batch:${batch.number}`
    );

  await sendMessage(batch.channel, message);
};

const sendMessageToSectionWithId = (joseph) => async (_id, message) => {
  const log = josephLog(joseph);
  const sendMessage = sendMessageToTelegramGroupWithId(joseph);
  const section = await Section.findById(_id);
  if (!section)
    return log(`Trying to send a message to a section that does not exist...
  id: ${_id}`);
  if (!section.channel)
    return log(`Trying to send a message to a section that does not have a channel..
  section: ${section.number}
  batch: ${section.batch.number}`);

  await sendMessage(section.channel, message);
};

module.exports = {
  josephLog,
  sendMessageToUserWithId,
  sendMessageToBatchWithId,
  sendMessageToSectionWithId,
};
