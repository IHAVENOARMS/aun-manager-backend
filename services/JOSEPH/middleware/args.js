module.exports = () => (ctx, next) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) {
    const match = text.match(/^\/([^\s]+)\s?(.+)?/i);
    let args = [];
    let command;
    if (match !== null) {
      if (match[1]) {
        command = match[1];
      }
      if (match[2]) {
        args = match[2].split(' ');
      }
    }

    ctx.state.args = args;
  }
  return next();
};
