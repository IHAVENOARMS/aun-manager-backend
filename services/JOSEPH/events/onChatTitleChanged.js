const { Telegraf } = require('telegraf');
const { chat } = require('../middleware');

const joseph = new Telegraf();

joseph.on('new_chat_title', chat(), async (ctx) => {});
