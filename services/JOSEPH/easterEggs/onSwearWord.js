const { Telegraf } = require('telegraf');
const { User } = require('../../../models/user');
const { swearWords } = require('../../../utils/regularExpressions');
const simplifyArabic = require('../../../utils/simplifyArabic');
const joseph = require('../joseph');
const { noSwearWordsAllowed, dontSwearInfrontOfMe } = require('../templates');

// const joseph = new Telegraf();
// joseph.on('message', (ctx) => {
//   ctx.message.ctx.telegram.editMessageText();
//   ctx.editMessageText('fasdf', {
//     message_id: ctx.message.id,
//     chat_id: ctx.message.chat.id,
//   });
// });
module.exports = async (ctx) => {
  const messageText = ctx.message.text;
  const isSwearWord = swearWords.test(messageText);
  let user;
  if (isSwearWord) {
    user = await User.findOne({
      telegramId: ctx.message.from.id,
    });
  }

  if (isSwearWord) {
    if (ctx.chat.type === 'private') {
      return ctx.reply(dontSwearInfrontOfMe(user || { gender: 'm' }), {
        reply_to_message_id: ctx.message.message_id,
      });
    }

    await ctx.sendMessage(
      ctx.message.text.replace(swearWords, () => {
        return '****';
      }),
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );

    await ctx.telegram.sendMessage(
      process.env.JOSEPH_LOG_CHAT_ID,
      ctx.message.text
    );
    return ctx.deleteMessage(ctx.message.id);
  }
};
