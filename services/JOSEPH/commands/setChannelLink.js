const { Batch } = require('../../../models/batch');
const {
  dontBelongToBatch,
  successfullySetBatchLink,
  pleaseEnterChannelLink,
  channelLinkAlreadySet,
  channelLinkAlreadyTaken,
} = require('../templates');
const { args, user, auth, private } = require('../middleware');

module.exports = (joseph, command = 'set_channel_link') => {
  joseph.command(
    command,
    private(),
    args(),
    user('batch'),
    auth(1000),
    async (ctx) => {
      const user = ctx.state.user;
      const channelLink = ctx.state.args[0];
      if (!channelLink) return ctx.sendMessage(pleaseEnterChannelLink(user));
      if (!user.batch) return ctx.sendMessage(dontBelongToBatch(user));
      const batchWithSameLink = await Batch.find({
        channelInviteLink: channelLink,
      });
      if (batchWithSameLink.length >= 1) {
        batchWithSameLink.forEach(async (b) => {
          if (!b._id.equals(user.batch._id))
            return ctx.sendMessage(channelLinkAlreadyTaken(user));
        });
      }
      const batch = await Batch.findById(user.batch._id);
      if (channelLink === batch.channelInviteLink)
        return ctx.sendMessage(channelLinkAlreadySet(user));
      if (!batch)
        return ctx.sendMessage(
          'FATAL ERROR: INVALID BATCH ID STORED IN DATABASE, DATABASE WAS MODIFIED DIRECTLY OR SOME OTHER INTERNAL ERROR OCCURED PLEASE REFER TO DEVELOPER'
        );
      batch.channelInviteLink = channelLink;
      await batch.save();

      return ctx.sendMessage(successfullySetBatchLink(user));
    }
  );
};
