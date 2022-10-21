const { Telegraf } = require('telegraf');
const { chat } = require('../middleware');

const joseph = new Telegraf();

module.exports = (joseph) => {
  joseph.on('left_chat_member', chat(), async (ctx) => {
    ctx.sendMessage('يلا اللي راح راح...');
    const chatInDb = ctx.state.chat.dbDocument;
    const members = ctx.state.chat.dbDocument.members;
    if (!members) chatInDb.members = [];
    const index = chatInDb.members.indexOf(ctx.from.id);
    chatInDb.members.splice(index, 1);
    await chatInDb.save();
  });
};
