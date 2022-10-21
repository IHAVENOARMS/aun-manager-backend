const { user, batch, section, private } = require('../middleware');
const _ = require('underscore');
const { dontBelongToBatch, links } = require('../templates');

module.exports = (joseph, command) => {
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
      if (!batch) ctx.sendMessage(dontBelongToBatch(user));
      return ctx.sendMessage(await links(user, batch, section));
    }
  );
};
