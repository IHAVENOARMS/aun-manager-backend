const { User } = require('../../../models/user');
const {
  userAcceptedInChannel,
  chatNotYours,
  acceptedInChat,
} = require('../templates');
const { TelegramGroup } = require('../../../models/telegramGroup');
const { Section } = require('../../../models/section');

module.exports = (joseph) => {
  joseph.on('chat_join_request', async (ctx) => {
    const joinRequest = ctx.chatJoinRequest;
    const user = await User.findOne({
      telegramId: joinRequest.from.id,
    }).select('-password');
    if (!user) {
      return await ctx.declineChatJoinRequest(joinRequest.from.id);
    }
    if (!user.josephChatId)
      return await ctx.declineChatJoinRequest(joinRequest.from.id);

    const thisChat = await TelegramGroup.findOne({ id: ctx.chat.id });
    if (!thisChat) return ctx.declineChatJoinRequest(joinRequest.from.id);
    const chatFor = thisChat.for.split(' ')[0];
    if (chatFor === 'batch') {
      const batchNumber = thisChat.for.split(' ')[1];

      if (user.batch.number !== parseInt(batchNumber)) {
        await ctx.declineChatJoinRequest(user.telegramId);
        return ctx.telegram.sendMessage(
          user.josephChatId,
          chatNotYours(user, thisChat)
        );
      }
    }
    if (chatFor === 'section') {
      const sectionNumber = thisChat.for.split(' ')[1];
      const batchNumber = thisChat.for.split(' ')[2];
      if (user.section.number !== parseInt(sectionNumber)) {
        await ctx.declineChatJoinRequest(user.telegramId);
        return ctx.telegram.sendMessage(
          user.josephChatId,
          chatNotYours(user, thisChat)
        );
      }
      if (user.batch.number !== parseInt(batchNumber)) {
        await ctx.declineChatJoinRequest(user.telegramId);
        return ctx.telegram.sendMessage(
          user.josephChatId,
          chatNotYours(user, thisChat)
        );
      }
    }
    if (chatFor === 'leaders') {
      const batchNumber = thisChat.for.split(' ')[1];

      if (user.batch.number !== parseInt(batchNumber)) {
        await ctx.declineChatJoinRequest(user.telegramId);
        return ctx.telegram.sendMessage(
          user.josephChatId,
          chatNotYours(user, thisChat)
        );
      }

      const sectionWithLeader = await Section.findOne({ leader: user._id });
      if (
        !sectionWithLeader ||
        sectionWithLeader.batch.number !== user.batch.number
      )
        return ctx.telegram.sendMessage(
          user.josephChatId,
          chatNotYours(user, thisChat)
        );
    }
    await ctx.approveChatJoinRequest(user.telegramId);
    return ctx.telegram.sendMessage(
      user.josephChatId,
      acceptedInChat(user, thisChat)
    );
  });
};
