module.exports = (req, res, next) => {
  if (
    parseInt(req.user.privilege) === 0 ||
    parseInt(req.user.privilege) === 1000
  )
    return next();

  return res.status(400).send('You are not a student...');
};
