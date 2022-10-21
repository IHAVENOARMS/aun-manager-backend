const { user, batch, section, private } = require('../middleware');
const { userInfo } = require('../templates');

module.exports = (joseph, command = 'info') => {
  joseph.command(
    command,
    private(),
    user(),
    batch(),
    section(),
    async (ctx) => {
      const user = ctx.state.user;
      const batch = ctx.state.batch;
      const section = ctx.state.section;
      return ctx.sendMessage(userInfo(user, batch, section));
    }
  );
};
