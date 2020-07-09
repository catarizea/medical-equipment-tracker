const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pick = require('lodash.pick');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../..', envFile),
});

const models = require('../models');

const generateRefreshToken = async (user, ip) => {
  const token = uuidv4();
  let refreshToken = null;

  try {
    const newToken = await models.RefreshToken.create({
      token,
      expiresAt: new Date(
        Date.now() +
          process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES * 60 * 1000
      ),
      createdAt: new Date(),
      createdByIp: ip,
      UserId: user.id,
    });

    refreshToken = pick(newToken, ['token', 'expiresAt']);
  } catch (error) {
    console.log('generateRefreshToken error');
    console.log(error);
  }

  return refreshToken;
};

module.exports = generateRefreshToken;
