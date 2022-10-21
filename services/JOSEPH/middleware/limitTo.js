module.exports =
  (chatType = '', chatFor = '') =>
  (ctx, next) => {
    if (chatType && ctx.state.chat.type !== chatType) return;
    if (chatFor && ctx.state.chat.for !== chatFor) return;
    return next();
  };
