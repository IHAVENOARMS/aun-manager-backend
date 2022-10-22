const { Batch } = require('../../../models/batch');

module.exports = () => async (ctx, next) => {
  const user = ctx.state.user;
  const batch = await Batch.findOne({ number: user.batch.number }).populate(
    'leaders'
  );
  if (batch) ctx.state.batch = batch;

  return next();
};
