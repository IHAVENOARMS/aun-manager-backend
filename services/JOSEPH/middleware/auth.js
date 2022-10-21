const { User } = require('../../../models/user');
const templates = require('../templates');

module.exports =
  (privilege = 0) =>
  async (ctx, next) => {
    const user = await ctx.state.user.populate('role');

    if (!user.josephChatId) {
      return ctx.sendMessage(templates.missingPassword(user));
    }
    if (user.role.privilege < privilege) {
      return ctx.sendMessage(templates.userNotAuthorized(user));
    }
    ctx.state.user = user;
    return next();
  };
