const { user } = require('../middleware');
const { test } = require('../templates');

module.exports = (joseph, command = 'test') => {
  joseph.command(command, user(), async (ctx) => {
    ctx.sendMessage(test(ctx.state.user));
  });
};
