const { Telegraf } = require('telegraf');
const { Batch } = require('../../../models/batch');
const { Section } = require('../../../models/section');
const { TelegramGroup } = require('../../../models/telegramGroup');
const { args, user, auth } = require('../middleware');

module.exports = (joseph, command = 'set_channel') => {
  joseph.on('channel_post', async (ctx) => {
    if(!ctx.channelPost.text) return;
    ctx.state.command = ctx.channelPost.text.slice(0, command.length);
    ctx.state.args = ctx.channelPost.text.slice(command.length).split(' ');
    if (!(ctx.channelPost.text && ctx.state.command === command)) return;
    if (await TelegramGroup.findOne({ id: ctx.chat.id }))
      return ctx.sendMessage(`القناة دي متسجلة عندي اصلا...`);

    const selection = ctx.state.args[1];
    if (
      (ctx.state.args.length >= 1 &&
        !['section', 'batch'].includes(selection)) ||
      ctx.state.args.length === 0
    ) {
      return ctx.sendMessage(
        `حدد انت عايز تخزن القناة دي لدفعة و لا لسيكشن.... تقدر تكتب "batch" او "section" بعد الامر...`
      );
    }
    const number = ctx.state.args[2];
    if (!number) return ctx.sendMessage('لازم تحدد رقم للدفعة او السيكشن');
    let batchNumber;
    if (selection === 'section') {
      batchNumber = parseInt(ctx.state.args[3]);
      if (!batchNumber || batchNumber === NaN) {
        return ctx.sendMessage(`لازم تحدد رقم الدفعة بعد رقم السيكشن..`);
      }
    }
    const inviteLink = await ctx.createChatInviteLink({
      name: 'JOSEPH Generated',
      creates_join_request: true,
    });

    const thisChannel = new TelegramGroup({
      name: ctx.chat.title,
      id: ctx.chat.id,
      type: ctx.chat.type,
      for:
        selection === 'section'
          ? selection + ' ' + number + ' ' + batchNumber
          : selection + ' ' + number,
      inviteLink: inviteLink.invite_link,
    });

    if (selection === 'batch') {
      const batch = await Batch.findOne({ number: number });
      if (!batch) return ctx.sendMessage(`معنديش دفعة بالرقم دا...`);
      else {
        await thisChannel.save();
        batch.channel = thisChannel._id;
        await batch.save();
        return ctx.sendMessage(
          `تمام كدة, دي بقت القناة الرسمية لدفعة ${batch.number}😄❤️`
        );
      }
    } else if (selection === 'section') {
      const section = await Section.findOne({
        number: number,
        'batch.number': batchNumber,
      });
      if (!section)
        return ctx.sendMessage('معنديش سيكشن بالرقم دا في الدفعة دي...');
      else {
        await thisChannel.save();
        section.channel = thisChannel._id;
        await section.save();
        return ctx.sendMessage(
          `تمام كدة, دي بقت القناة الرسمية لسيكشن ${section.number} دفعة ${batchNumber}😄❤️`
        );
      }
    }
  });
};
