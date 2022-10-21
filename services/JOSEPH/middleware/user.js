const { Telegraf } = require('telegraf');
const { User } = require('../../../models/user');
const templates = require('../templates');

module.exports =
  (properties = '', populate = '', strict = true) =>
  async (ctx, next) => {
    const userId = ctx.message.from.id;
    let user;
    if (properties) {
      user = await User.findOne({ telegramId: userId }).select(
        'josephPassword josephChatId arabicName role gender ' + properties
      );
    } else {
      user = await User.findOne({ telegramId: userId });
    }
    if (!user) {
      if (strict) return ctx.sendMessage(templates.unRecognized());
    }

    if (populate) {
      user = await user.populate(populate);
    }
    ctx.state.user = user;
    return next();
  };
