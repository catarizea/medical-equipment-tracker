const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  defaultUser,
  adminUser,
  login,
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/change-password`;
const newPassword = 'Password12';

describe('/change-password endpoint', () => {
  it('should change password as owner of the record', async (done) => {
    const credentials = await login(defaultUser);

    const res = await testApi
      .put(`${path}/${defaultUser.id}`)
      .set('Authorization', `Bearer ${credentials.jwtToken}`)
      .send({
        currentPassword: defaultUser.password,
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toEqual('Password changed');

    done();
  });

  it('should change password as admin', async (done) => {
    const credentials = await login(adminUser);

    const res = await testApi
      .put(`${path}/${defaultUser.id}`)
      .set('Authorization', `Bearer ${credentials.jwtToken}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toEqual('Password changed');

    done();
  });

  it('should fail when currentPassword is not provided as owner of the record', async (done) => {
    const credentials = await login(defaultUser);

    const res = await testApi
      .put(`${path}/${defaultUser.id}`)
      .set('Authorization', `Bearer ${credentials.jwtToken}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Validation error',
        message: {
          currentPassword: 'Current password is required',
        },
      })
    );

    done();
  });
});
