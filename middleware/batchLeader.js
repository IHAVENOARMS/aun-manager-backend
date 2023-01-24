module.exports = function (req, res, next) {
  if (parseInt(req.user.privilege) === 0 && req.user.isLeader) return next();
  if (parseInt(req.user.privilege) > 0) return next();

  return res
    .status(400)
    .send('Only batch leaders can perform this operation..');
};
