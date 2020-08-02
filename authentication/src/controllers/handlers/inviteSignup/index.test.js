const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');

let adminUser;
let login;
let tempUser;
let defaultUser;

const path = `${prefix}/invite-signup`;

beforeAll(async () => {
  const users = await loadUsers();
  adminUser = users.adminUser;
  login = users.login;
  tempUser = users.tempUser;
  defaultUser = users.defaultUser;
});

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

  it('should fail when trying to invite an existent user', async (done) => {
    const credentials = await login(adminUser);

    const res = await testApi
      .post(path)
      .set('Authorization', `Bearer ${credentials.jwtToken}`)
      .send({
        email: defaultUser.email,
        firstName: defaultUser.firstName,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'Account already exists for this email',
      })
    );

    done();
  });
});
