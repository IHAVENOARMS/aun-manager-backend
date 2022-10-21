const { Telegraf } = require('telegraf');
const onBravo = require('../easterEggs/onBravo');

const joseph = new Telegraf();
const onSwearWord = require('../easterEggs/onSwearWord');
const onThankYou = require('../easterEggs/onThankYou');
const { user } = require('../middleware');

module.exports = (joseph) => {
  joseph.on('message', async (ctx) => {
    onSwearWord(ctx);
    onThankYou(ctx);
    onBravo(ctx);
  });
};
