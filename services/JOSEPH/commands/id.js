const { auth, user } = require('../middleware');

module.exports = (joseph, command = 'id') =>
  joseph.command(command, user(), auth(1000), async (ctx) => {
    ctx.sendMessage(ctx.chat.id.toString());
  });
