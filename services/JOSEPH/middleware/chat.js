const { TelegramGroup } = require('../../../models/telegramGroup');
const _ = require('underscore');

module.exports = () => async (ctx, next) => {
  const chat = await TelegramGroup.findOne({ id: ctx.chat.id });
  if (!chat) return;
  const chatFor = chat.for.split(' ');
  const isSectionChat = chatFor[0] === 'section';
  ctx.state.chat = {
    dbDocument: chat || undefined,
    type: _.get(chat, 'type', undefined),
    id: _.get(chat, 'id'),
    name: _.get(chat, 'name'),
    for: chatFor[0],
    batchNumber: isSectionChat ? parseInt(chatFor[2]) : parseInt(chatFor[1]),
    sectionNumber: isSectionChat ? parseInt(chatFor[1]) : undefined,
  };
  return next();
};
