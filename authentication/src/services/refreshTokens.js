const path = require('path');
const Boom = require('@hapi/boom');

const generateJwtToken = require('./generateJwtToken');
const generateRefreshToken = require('./generateRefreshToken');
const models = require('../models');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../..', envFile),
});

const refreshTokens = async (oldRefreshToken, ip, next) => {
  const { User: user } = oldRefreshToken;

  const newRefreshToken = await generateRefreshToken(user, ip);

  if (!newRefreshToken) {
    return next(Boom.badImplementation());
  }

  const revokedToken = {
    revokedAt: new Date(),
    revokedByIp: ip,
    replacedByToken: newRefreshToken.token,
  };

  let tokenRevoked = null;

  try {
    tokenRevoked = await models.RefreshToken.update(revokedToken, {
      where: { id: oldRefreshToken.id },
    });
  } catch (error) {
    console.log('refreshTokens error');
    console.log(error);
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
