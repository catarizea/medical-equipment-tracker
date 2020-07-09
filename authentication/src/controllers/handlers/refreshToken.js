const Boom = require('@hapi/boom');

const models = require('../../models');
const refreshTokens = require('../../services/refreshTokens');
const { REFRESH_TOKEN_COOKIE } = require('../../constants/cookies');

module.exports = {
  refreshToken: async (req, res, next) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

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

    const newTokens = await refreshTokens(dbRefreshToken, req.ip, next);

    if (!newTokens) {
      return next(Boom.badImplementation());
    }

    res.cookie(REFRESH_TOKEN_COOKIE, newTokens.refreshToken.token, {
      maxAge: process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ ...newTokens });
  },
};
