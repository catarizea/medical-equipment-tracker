const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  adminUser,
  login,
  tempUser,
  createTemp,
  destroyTemp,
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/revoke-token`;

describe('/revoke-token endpoint', () => {
  it('should revoke a valid refresh token', async (done) => {
    const { jwtToken } = await login(adminUser, true);

    const user = { ...tempUser, email: 'revoke-token@medical.equipment' };
    
    const createdTemp = await createTemp(user);
    user.id = createdTemp.id;
    
    const { refreshToken: { token } } = await login(user, true);

    const res = await testApi
      .put(path)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ token });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'Token revoked',
      })
    );

    await destroyTemp(user);

    done();
  });
});
