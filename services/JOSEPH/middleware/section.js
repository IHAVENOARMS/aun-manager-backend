const { Section } = require('../../../models/section');

module.exports = () => async (ctx, next) => {
  const user = ctx.state.user;
  const section = await Section.findById(user.section._id).populate('leader');
  if (section) ctx.state.section = section;
  return next();
};
