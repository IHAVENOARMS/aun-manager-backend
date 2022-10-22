module.exports = () => (ctx, next) => {
  const user = ctx.state.user;
  const batch = ctx.state.batch;
  if (
    batch &&
    batch.leaders.filter((leader) => user._id.equals(leader._id)).length === 0
  )
    return ctx.sendMessage(`الامر دا متاح لليدرات الدفعات فقط...`);
  else return next();
};
