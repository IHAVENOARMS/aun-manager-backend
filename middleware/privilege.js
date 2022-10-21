module.exports =
  (privilege, exact = false) =>
  (req, res, next) => {
    if (exact) {
      if (parseInt(req.user.privilege) === privilege) {
        return next();
      }
    }
    if (parseInt(req.user.privilege) >= privilege && !exact) return next();

    return res
      .status(400)
      .send('You do not have the required privilege to perform this operation');
  };
