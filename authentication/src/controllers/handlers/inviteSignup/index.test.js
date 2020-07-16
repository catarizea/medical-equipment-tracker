const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  adminUser,
  login,
  tempUser
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/invite-signup`;

describe('/invite-signup endpoint', () => {
  it('should send the sign up invitation email', async (done) => {
    const credentials = await login(adminUser);

    const res = await testApi
      .post(path)
      .set('Authorization', `Bearer ${credentials.jwtToken}`)
      .send({
        email: tempUser.email,
        firstName: tempUser.firstName,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toEqual('Invitation to signup sent');

    done();
  });
});
