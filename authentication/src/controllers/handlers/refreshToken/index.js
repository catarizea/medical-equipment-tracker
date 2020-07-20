const Boom = require('@hapi/boom');
const { htmlEscape } = require('escape-goat');

const models = require('../../../models');
const refreshTokens = require('../../../services/refreshTokens');
const {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} = require('../../../constants/cookies');
const { revokeAccess } = require('../logout');

module.exports = {
  refreshToken: async (req, res, next) => {
    const refreshToken = htmlEscape(req.cookies[REFRESH_TOKEN_COOKIE]);

    if (!refreshToken) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    const dbRefreshToken = await models.RefreshToken.findOne({
      include: [
        {
          model: models.User,
          as: 'User',
        },
      ],
      where: { token: refreshToken },
    });

    if (
      !dbRefreshToken ||
      dbRefreshToken.revokedAt ||
      dbRefreshToken.expiresAt < new Date()
    ) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    if (dbRefreshToken.User.isBlocked) {
      await revokeAccess(req, res);
      return next(Boom.unauthorized('Access revoked'));
    }

    const newTokens = await refreshTokens(dbRefreshToken, req.ip, next);

    if (!newTokens) {
      return next(Boom.badImplementation());
    }

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      newTokens.refreshToken.token,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    res.json({ ...newTokens });
  },
};
