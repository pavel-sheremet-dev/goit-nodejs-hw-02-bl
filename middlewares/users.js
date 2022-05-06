const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden } = require('http-errors');
const { usersService: service } = require('../services');

const authhorize =
  (...permission) =>
  async (req, res, next) => {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization?.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized(
          'Not authorized. Authorization header didn`t set or invalid',
        );
      }

      const secret = process.env.JWT_SECRET;
      let payload = null;
      try {
        payload = jwt.verify(token, secret);
      } catch (error) {
        throw new Unauthorized('Not authorized. Invalid token');
      }

      const hasPermisson = checkPermissions(payload.permissions, permission);

      if (!hasPermisson) {
        throw new Forbidden('Permission error');
      }

      const user = await service.getCurrentUser(payload.uid);

      if (!user || !user.token) {
        throw new Unauthorized('Not authorized');
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };

const checkPermissions = (tokenPermissions, requiredPermissions) => {
  if (!requiredPermissions.length) {
    return true;
  }

  let hasPermisson = false;

  requiredPermissions.forEach(perm => {
    if (tokenPermissions.includes(perm)) {
      hasPermisson = true;
    }
  });

  return hasPermisson;
};

exports.usersMiddlewares = { authhorize };
