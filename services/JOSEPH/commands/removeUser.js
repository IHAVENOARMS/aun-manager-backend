const { group, args, user, auth } = require('../middleware');
const {
  pleaseEnterUserArabicName,
  botNotAuthorized,
  couldNotDoThat,
} = require('../templates');
const { findUserWithArabicName } = require('../utils/findUser');

module.exports = (joseph, command = 'remove') => {
  joseph.command(command, group(), args(), user(), auth(1000), async (ctx) => {
    let userArabicName = ctx.state.args;
    if (userArabicName.length === 0)
      return ctx.sendMessage(pleaseEnterUserArabicName(ctx.state.user));
    userArabicName = userArabicName.join(' ');
    const user = await findUserWithArabicName(ctx, userArabicName);
    try {
      if (user) return await ctx.banChatMember(user.telegramId);
    } catch (exc) {
      return ctx.sendMessage(couldNotDoThat());
    }
  });
};
