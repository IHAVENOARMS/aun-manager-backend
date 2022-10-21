const { User } = require('../../../models/user');
const simplifyArabic = require('../../../utils/simplifyArabic');
const { userNotFound } = require('../templates');

const findUserWithArabicName = async (ctx, userArabicName) => {
  if (!userArabicName) {
    await ctx.sendMessage(
      'لو سمحت اكتب اسم الطالب اللي عايز تنفذ عليه الامر دا...'
    );
    return;
  }
  const normalizedUserArabicName = simplifyArabic(userArabicName);
  const regexp = RegExp(`^${normalizedUserArabicName}`);
  const users = await User.find({
    normalizedArabicName: regexp,
  });
  if (users.length === 0) {
    ctx.sendMessage(userNotFound(ctx.state.user));
    return;
  }
  if (users.length > 1) {
    ctx.sendMessage(
      `عندي اكتر من ${userArabicName} في الدفعة, ممكن تحدد اكتر من كدة..؟`
    );
    return;
  }
  return users[0];
};

module.exports = {
  findUserWithArabicName,
};
