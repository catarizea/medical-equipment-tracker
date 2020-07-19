const Boom = require('@hapi/boom');

const generateJwtToken = require('./generateJwtToken');
const generateRefreshToken = require('./generateRefreshToken');
const logger = require('./logger');
const models = require('../models');

const refreshTokens = async (oldRefreshToken, ip, next) => {
  const { User: user } = oldRefreshToken;

  const newRefreshToken = await generateRefreshToken(user, ip);

  if (!newRefreshToken) {
    return next(Boom.badImplementation());
  }

  const revokedToken = {
    revokedAt: new Date(),
    revokedBy: user.id,
    revokedByIp: ip,
    replacedByToken: newRefreshToken.token,
  };

  let tokenRevoked = null;

  try {
    tokenRevoked = await models.RefreshToken.update(revokedToken, {
      where: { id: oldRefreshToken.id },
    });
  } catch (error) {
    logger.error('refreshTokens error', error)
  }
  
  if (!tokenRevoked) {
    return next(Boom.badImplementation());
  }

  const jwtToken = generateJwtToken(user);
  const jwtTokenExpiry = new Date(
    new Date().getTime() +
      process.env.AUTHENTICATION_JWT_TOKEN_EXPIRES * 60 * 1000
  );

  return { jwtToken, jwtTokenExpiry, refreshToken: newRefreshToken };
};

module.exports = refreshTokens;
