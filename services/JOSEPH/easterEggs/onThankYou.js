const { Telegraf } = require('telegraf');
const { gratitude } = require('../../../utils/regularExpressions');
const { user } = require('../middleware');

const joseph = new Telegraf();

module.exports = (ctx) => {
  const messageText = ctx.message.text;
  if (!ctx.message.reply_to_message) {
    if (ctx.chat.type === 'private') {
      if (gratitude.test(messageText))
        return ctx.reply('العفو, اي وقت❤️❤️', {
          reply_to_message_id: ctx.message.message_id,
        });
    }
    return;
  }

  const isReplyToSelf = ctx.message.reply_to_message.from.id === ctx.botInfo.id;

  if (isReplyToSelf) {
    if (gratitude.test(messageText))
      ctx.reply('العفو, اي وقت❤️❤️', {
        reply_to_message_id: ctx.message.message_id,
      });
  }
};
