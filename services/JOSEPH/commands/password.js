const {
  welcome,
  pleaseEnterPassword,
  wrongPassword,
  alreadyEnteredPassword,
  links,
} = require('../templates');

const { args, user, private } = require('../middleware');
const { User } = require('../../../models/user');
const { Batch } = require('../../../models/batch');
const { Section } = require('../../../models/section');

module.exports = (joseph, command = 'password') => {
  joseph.command(command, private(), args(), async (ctx) => {
    const password = ctx.state.args[0];
    const telegramId = ctx.message.from.id;
    const userWithChatId = await User.findOne({ josephChatId: ctx.chat.id });
    if (userWithChatId)
      return ctx.sendMessage(alreadyEnteredPassword(userWithChatId));

    const user = await User.findOne({ josephPassword: password });

    if (user && user.josephChatId) {
      return ctx.sendMessage(alreadyEnteredPassword(user));
    }

    if (!password) return ctx.sendMessage(pleaseEnterPassword());
    if (!user) return ctx.sendMessage(wrongPassword());

    user.josephChatId = ctx.chat.id;
    user.telegramId = telegramId;
    await user.save();
    ctx.sendMessage(welcome(user));
    const batch = await Batch.findOne({ number: user.batch.number });
    const section = await Section.findOne({
      number: user.section.number,
      'batch.number': batch.number,
    });
    ctx.sendMessage(links(user, batch, section));
  });
};
