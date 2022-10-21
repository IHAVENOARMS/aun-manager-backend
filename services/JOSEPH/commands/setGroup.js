const { Telegraf } = require('telegraf');
const { Batch } = require('../../../models/batch');
const { Section } = require('../../../models/section');
const { TelegramGroup } = require('../../../models/telegramGroup');
const { args, user, auth, group, batch, leader } = require('../middleware');
const { botNotAuthorized } = require('../templates');

module.exports = (joseph, command = 'set_group') => {
  joseph.command(
    command,
    group(),
    args(),
    user(),
    batch(),
    leader(),
    async (ctx) => {
      const user = ctx.state.user;
      const batch = ctx.state.batch;
      const selection = ctx.state.args[0];
      let section;
      if (
        (ctx.state.args.length >= 1 &&
          !['section', 'batch', 'leaders'].includes(selection)) ||
        ctx.state.args.length === 0
      ) {
        return ctx.sendMessage(
          `حدد انت عايز تخزن الجروب دا لدفعة و لا لسيكشن, و لا لليدرز.... تقدر تكتب , "leaders", "data", batch" او "section" بعد الامر...`
        );
      }

      if (selection === 'section') {
        const sectionNumber = parseInt(ctx.state.args[1]);
        if (!ctx.state.args[1] || sectionNumber === NaN) {
          return ctx.sendMessage('لازم تكتب رقم السيكشن بعد الامر..');
        }
        section = await Section.findOne({
          'batch._id': batch._id,
          number: sectionNumber,
        });

        if (!section) {
          return ctx.sendMessage(`دفعتك مفيهاش سيكشن بالرقم دا...`);
        }
      }

      const selectionMapper = {
        batch: 'groupChat',
        leaders: 'leadersChat',
      };

      const group = await TelegramGroup.findOne({
        id: ctx.chat.id,
      });
      if (group) {
        let sectionNumber;
        let batchNumber;
        if (group.for.split(' ').length === 2) {
          if (
            group.for.split(' ')[0] === selection &&
            parseInt(group.for.split(' ')[1]) === batch.number
          ) {
            return ctx.sendMessage(
              `الجروب دا هو اصلا جروب ${
                selection === 'leaders' ? 'ليدرز' : ''
              } الدفعة...`
            );
          } else {
            const batchThatHadGroup = await Batch.findOne({
              number: group.for.split(' ')[1],
            });
            batchThatHadGroup[selectionMapper[group.for.split(' ')[0]]] =
              undefined;
            await batchThatHadGroup.save();
            await group.delete();
          }
        } else if (group.for.split(' ').length === 3) {
          if (group.for.split(' ')[1] === ctx.state.args[1])
            return ctx.sendMessage(`الجروب دا هو جروب السيكشن اصلا...`);
          else {
            const sectionThatHadGroup = await Section.findOne({
              number: group.for.split(' ')[1],
              'batch.number': group.for.split(' ')[2],
            });
            sectionThatHadGroup.groupChat = undefined;
            await sectionThatHadGroup.save();
            await group.delete();
          }
        }
      }
      try {
        var inviteLink = await ctx.createChatInviteLink({
          creates_join_request: true,
          name: 'JOSEPH Generated',
        });
      } catch (exc) {
        return ctx.sendMessage(botNotAuthorized());
      }

      const thisGroup = new TelegramGroup({
        name: ctx.chat.title,
        id: ctx.chat.id,
        type: ctx.chat.type,
        for:
          selection === `batch` || selection === 'leaders'
            ? `${selection} ${batch.number}`
            : `section ${section.number} ${batch.number}`,
        inviteLink: inviteLink.invite_link,
      });
      await thisGroup.save();
      if (section) {
        section.groupChat = thisGroup._id;
        await section.save();
        return ctx.sendMessage(
          `تمام, دلوقت دا بقي الشات الرسمي لسيكشن رقم ${section.number} دفعة ${batch.number}😄`
        );
      } else {
        batch[selectionMapper[selection]] = thisGroup._id;
        await batch.save();
        return ctx.sendMessage(
          `تمام, دلوقت دا بقي الشات الرسمي ${
            selection === 'leaders' ? 'لليدرز' : ''
          } الدفعة رقم ${batch.number}`
        );
      }
    }
  );
};
