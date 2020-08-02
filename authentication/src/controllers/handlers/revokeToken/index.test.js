const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');

let adminUser;
let login;
let tempUser;
let createTemp;
let destroyTemp;

const path = `${prefix}/revoke-token`;

beforeAll(async () => {
  const users = await loadUsers();
  adminUser = users.adminUser; 
  login = users.login; 
  tempUser = users.tempUser; 
  createTemp = users.createTemp; 
  destroyTemp = users.destroyTemp; 
});

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
