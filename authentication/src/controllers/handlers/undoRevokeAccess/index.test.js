const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');

let adminUser;
let login;
let tempUser;
let createTemp;
let destroyTemp;

const path = `${prefix}/undo-revoke-access`;

let user;

beforeAll(async () => {
  const users = await loadUsers();
  adminUser = users.adminUser;
  login = users.login;
  tempUser = users.tempUser;
  createTemp = users.createTemp;
  destroyTemp = users.destroyTemp;

  user = {
    ...tempUser,
    isBlocked: true,
    email: 'undo-revoke-access@medical.equipment',
  };
  const createdTemp = await createTemp(user);
  user.id = createdTemp.id;
});

afterAll(async () => {
  await destroyTemp(user);
});

describe('/undo-revoke-access endpoint', () => {
  it('should undo revoke access to a blocked user', async (done) => {
    const { jwtToken } = await login(adminUser);

    const res = await testApi
      .get(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'Access revoked undone',
      })
    );

    done();
  });

  it('should fail when trying to undo revoke access to an active user', async (done) => {
    const { jwtToken } = await login(adminUser);

    const res = await testApi
      .get(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'Access is not revoked for this account',
      })
    );

    done();
  });

  it('should fail when trying to undo revoke access to own user', async (done) => {
    const { jwtToken } = await login(adminUser);

    const res = await testApi
      .get(`${path}/${adminUser.id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'You cannot undo revoke access your own account',
      })
    );

    done();
  });
});
