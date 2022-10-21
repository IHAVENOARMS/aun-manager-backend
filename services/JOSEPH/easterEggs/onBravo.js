const { approval } = require('../../../utils/regularExpressions');

module.exports = (ctx) => {
  const messageText = ctx.message.text;
  if (!ctx.message.reply_to_message) {
    if (ctx.chat.type === 'private') {
      if (approval.test(messageText)) {
        return ctx.reply('🥺❤️', {
          reply_to_message_id: ctx.message.message_id,
        });
      }
    }
    return;
  }
  const isReplyToSelf = ctx.message.reply_to_message.from.id === ctx.botInfo.id;
  if (isReplyToSelf) {
    if (approval.test(messageText)) {
      return ctx.reply('🥺❤️', {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  }
};
