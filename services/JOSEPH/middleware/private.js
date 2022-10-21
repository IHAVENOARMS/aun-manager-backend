module.exports = () => async (ctx, next) => {
  if (ctx.chat.type === 'private') {
    return next();
  } else {
    return;
  }
};
