const { args, user, auth, private, leader, batch } = require('../middleware');
const {
  userInfo,
  userNotFound,
  pleaseEnterUserArabicName,
} = require('../templates');
const { User } = require('../../../models/user');
const simplifyArabic = require('../../../utils/simplifyArabic');
const {
  findUserWithArabicName,
  findUserWithArabicNameInBatch,
} = require('../utils/findUser');
const { Batch } = require('../../../models/batch');
const { Section } = require('../../../models/section');

module.exports = (joseph, command = 'info_for') => {
  joseph.command(
    command,
    private(),
    args(),
    user(),
    batch(),
    leader(),
    async (ctx) => {
      let userArabicName = ctx.state.args.join(' ');
      const guideMessage = `يعني مثلا:
  /${command} يوسف جمال حنين جاد`;
      if (!userArabicName)
        return ctx.sendMessage(
          pleaseEnterUserArabicName(ctx.state.user) + guideMessage
        );
      const user = await findUserWithArabicNameInBatch(
        ctx,
        userArabicName,
        ctx.state.user.batch.number
      );
      if (!user) return;
      const batch = await Batch.findById(user.batch._id).populate('leaders');
      const section = await Section.findById(user.section._id).populate(
        'leader'
      );
      if (user) return ctx.sendMessage(userInfo(user, batch, section));
    }
  );
};
