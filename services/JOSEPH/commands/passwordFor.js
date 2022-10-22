const { Telegraf } = require('telegraf');
const { args, user, auth } = require('../middleware');
const { findUserWithArabicName } = require('../utils/findUser');

const joseph = new Telegraf();

module.exports = (joseph, command = 'password_for') => {
  joseph.command(command, args(), user(), auth(1000), async (ctx) => {
    const userArabicName = ctx.state.args.join(' ');
    const user = await findUserWithArabicName(ctx, userArabicName);
    if (user) {
      return await ctx.sendMessage(user.josephPassword);
    }
  });
};
