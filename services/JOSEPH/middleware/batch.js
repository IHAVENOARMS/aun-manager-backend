const { Batch } = require('../../../models/batch');

module.exports = () => async (ctx, next) => {
  const user = ctx.state.user;
  const batch = await Batch.findById(user.batch._id).populate('leaders');
  if (batch) ctx.state.batch = batch;

  return next();
};
