const { v4: uuidv4 } = require('uuid');

const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  tempUser,
  createTemp,
  destroyTemp,
} = require('../../../utils/testHelpers/user');
const {
  createForgotPassword,
  destroyForgotPassword,
} = require('../../../utils/testHelpers/forgotpassword');

const path = `${prefix}/reset-password`;

describe('/reset-password endpoint', () => {
  it('should return a new set of credentials after password reset', async (done) => {
    const user = { ...tempUser, email: 'reset-password@medical.equipment' };
    
    const createdTemp = await createTemp(user);
    user.id = createdTemp.id;

    const { token } = await createForgotPassword({
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
      ip: '127.0.0.1',
      UserId: user.id,
      token: uuidv4(),
    });

    const res = await testApi.put(path).send({
      password: 'Password1234',
      confirmPassword: 'Password1234',
      token,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        jwtToken: expect.any(String),
        jwtTokenExpiry: expect.any(String),
        refreshToken: {
          token: expect.any(String),
          expiresAt: expect.any(String),
        },
      })
    );

    await destroyForgotPassword(token);
    await destroyTemp(user);

    done();
  });
});
