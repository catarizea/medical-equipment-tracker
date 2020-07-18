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

let user;
let token;

beforeAll(async () => {
  user = { ...tempUser, email: 'reset-password@medical.equipment' };

  const createdTemp = await createTemp(user);
  user.id = createdTemp.id;

  const forgotPassword = await createForgotPassword({
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    used: false,
    ip: '127.0.0.1',
    UserId: user.id,
    token: uuidv4(),
  });

  token = forgotPassword.token;
});

afterAll(async () => {
  await destroyForgotPassword(token);
  await destroyTemp(user);
});

describe('/reset-password endpoint', () => {
  it('should return a new set of credentials after password reset', async (done) => {
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

    done();
  });

  it('should fail when trying to reuse the password reset token', async (done) => {
    const res = await testApi.put(path).send({
      password: 'Password1',
      confirmPassword: 'Password1',
      token,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'Reset link already used',
      })
    );

    done();
  });

  it('should fail when trying to use an invalid password reset token', async (done) => {
    const res = await testApi.put(path).send({
      password: 'Password1',
      confirmPassword: 'Password1',
      token: 'invalid-token',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Validation error',
        message: {
          token: 'Token is not valid',
        },
      })
    );

    done();
  });

  it('should fail when trying to use an non existent password reset token', async (done) => {
    const res = await testApi.put(path).send({
      password: 'Password1',
      confirmPassword: 'Password1',
      token: 'e1e43d4e-8351-4e96-8831-f1d3914e9066',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'Invalid token'
      })
    );

    done();
  });
});
