const { Telegraf } = require('telegraf');
const { Section } = require('../../../models/section');
const { TelegramGroup } = require('../../../models/telegramGroup');
const { args, user, batch, leader, chat, limitTo } = require('../middleware');
const {
  couldNotDoThat,
  congratsNewSectionLeader,
  introNewSectionLeader,
  groupLink,
} = require('../templates');
const { findUserWithArabicName } = require('../utils/findUser');

// const joseph = new Telegraf();

module.exports = (joseph, command = 'promote_section_leader') => {
  joseph.command(
    command,
    args(),
    user(),
    batch(),
    leader(),
    chat(),
    limitTo('group', 'section'),
    async (ctx) => {
      const userArabicName =
        ctx.state.args.length > 0 ? ctx.state.args.join(' ') : '';
      const user = await findUserWithArabicName(ctx, userArabicName);
      if (!user) return;
      const sectionWithSameLeader = await Section.findOne({
        leader: user._id,
        'batch.number': user.batch.number,
      });
      if (sectionWithSameLeader)
        return ctx.sendMessage(
          `${user.arabicName.split(' ')[0]} بالعفل مسجل${
            user.gender === 'f' ? 'ة' : ''
          } ليدر لسيكشن ${sectionWithSameLeader.number} `
        );
      try {
        const section = await Section.findOne({
          number: ctx.state.chat.sectionNumber,
          'batch.number': ctx.state.chat.batchNumber,
        });

        if (section.number !== user.section.number)
          return ctx.sendMessage(
            `الطالب اللي انت بتحاول تخليه ليدر مش من السيكشن دا اصلا...`
          );
        section.leader = user._id;
        await section.save();
        await ctx.sendMessage(introNewSectionLeader(user));
        let leadersChat;
        if (ctx.state.batch.leadersChat) {
          leadersChat = await TelegramGroup.findById(
            ctx.state.batch.leadersChat
          );
        }
        await ctx.telegram.sendMessage(
          user.josephChatId,
          congratsNewSectionLeader(user) + '\n' + groupLink(leadersChat)
        );
      } catch (exc) {
        console.log(exc);
        ctx.sendMessage(couldNotDoThat());
      }
    }
  );
};
