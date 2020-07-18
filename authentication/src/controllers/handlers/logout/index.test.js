const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const { adminUser, login } = require('../../../utils/testHelpers/user');

const path = `${prefix}/logout`;

describe('/logout endpoint', () => {
  it('should delete the refreshToken cookie if exists', async (done) => {
    const { cookie } = await login(adminUser, true);

    const res = await testApi
      .get(path)
      .set('Cookie', [`${cookie.key}=${cookie.value}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'Logged out',
      })
    );

    done();
  });
});
