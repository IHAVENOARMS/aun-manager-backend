const { Telegraf } = require('telegraf');
const { chat } = require('../middleware');

const joseph = new Telegraf();

module.exports = (joseph) => {
  joseph.on('new_chat_members', chat(), async (ctx) => {
    const chatInDb = ctx.state.chat.dbDocument;
    const members = ctx.state.chat.dbDocument.members;
    if (!members) chatInDb.members = [];
    if (!dbDocument.members.includes(ctx.from.id)) {
      chatInDb.members.push(ctx.from.id);
      await chatInDb.save();
    }
  });
};
