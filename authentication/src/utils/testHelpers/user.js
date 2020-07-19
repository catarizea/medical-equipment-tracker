const models = require('../../models');
const { generateJwtToken, generateRefreshToken } = require('../../services');
const { REFRESH_TOKEN_COOKIE } = require('../../constants/cookies');

const adminUser = {
  id: 1,
  firstName: 'Catalin',
  lastName: 'Rizea',
  email: 'catalin@medical.equipment',
  password: 'Password1',
  role: ['User', 'Admin'],
  isBlocked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultUser = {
  ...adminUser,
  id: 2,
  firstName: 'Simona',
  lastName: 'Galushka',
  email: 'simona@medical.equipment',
  role: ['User'],
};

const tempUser = {
  ...adminUser,
  firstName: 'Stela',
  lastName: 'Ciompo',
  email: 'stela@medical.equipment',
  role: ['User'],
  isBlocked: false,
  passwordHash: '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6',
};

delete tempUser.id;

module.exports = {
  login: async (user, withRefreshToken = false) => {
    const jwtToken = generateJwtToken(user);
    const jwtTokenExpiry = new Date(
      new Date().getTime() +
        process.env.AUTHENTICATION_JWT_TOKEN_EXPIRES * 60 * 1000
    );

    let refreshToken = null;
    let cookie = null;

    if (withRefreshToken) {
      refreshToken = await generateRefreshToken(user, '127.0.0.1');

      cookie = {
        key: REFRESH_TOKEN_COOKIE,
        value: refreshToken.token,
        options: {
          maxAge: process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        },
      };
    }

    return {
      jwtToken,
      jwtTokenExpiry,
      refreshToken,
      cookie,
    };
  },
  adminUser,
  defaultUser,
  tempUser,
  updateBlocked: async (user, isBlocked = false) => {
    await models.User.update(
      { isBlocked, role: user.role },
      { where: { id: user.id } }
    );
  },
  createTemp: async (user) => {
    const createdUser = await models.User.create(user);
    return createdUser;
  },
  destroyTemp: async (user) => {
    await models.User.destroy({ where: { email: user.email } });
  },
  destroyRemovedUser: async (user) => {
    await models.RemovedUser.destroy({ where: { email: user.email } });
  },
};
