const { v4: uuidv4 } = require('uuid');

const models = require('../../models');
const { generateJwtToken, generateRefreshToken } = require('../../services');
const {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} = require('../../constants/cookies');

const loadUsers = async () => {
  const adminUser = await models.User.findOne({ where: { email: 'catalin@medical.equipment' } });
  const defaultUser = await models.User.findOne({ where: { email: 'simona@medical.equipment' } });

  const tempUser = {
    firstName: 'Stela',
    lastName: 'Ciompo',
    email: 'stela@medical.equipment',
    role: ['user'],
    isBlocked: false,
    passwordHash: '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6', 
  };

  return {
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
          REFRESH_TOKEN_COOKIE_OPTIONS,
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
      user.id = uuidv4();
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
};

module.exports = loadUsers;
