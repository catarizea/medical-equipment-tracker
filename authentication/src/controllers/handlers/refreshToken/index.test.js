const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');
const { REFRESH_TOKEN_COOKIE } = require('../../../constants/cookies');

let adminUser;
let login;
let tempUser;
let createTemp;
let destroyTemp;
let updateBlocked;

const path = `${prefix}/refresh-token`;

beforeAll(async () => {
  const users = await loadUsers();
  adminUser = users.adminUser;
  login = users.login;
  tempUser = users.tempUser;
  createTemp = users.createTemp;
  destroyTemp = users.destroyTemp;
  updateBlocked = users.updateBlocked;
});

describe('/refresh-token endpoint', () => {
  it('should return a new set of JWT, JWT expiration date and refreshToken', async (done) => {
    const { cookie } = await login(adminUser, true);

    const res = await testApi
      .post(path)
      .set('Cookie', [`${cookie.key}=${cookie.value}`]);

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

  it('should fail when the refreshToken is not valid', async (done) => {
    const res = await testApi
      .post(path)
      .set('Cookie', [`${REFRESH_TOKEN_COOKIE}=some-invalid-token`]);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'Unauthorized',
      })
    );

    done();
  });

  it('should fail when the access was revoked in the mean time', async (done) => {
    const toBeRevokedUser = { ...tempUser };
    
    const createdTemp = await createTemp(toBeRevokedUser);
    
    toBeRevokedUser.id = createdTemp.id;
    
    const { cookie } = await login(toBeRevokedUser, true);
    
    await updateBlocked(toBeRevokedUser, true);

    const res = await testApi
      .post(path)
      .set('Cookie', [`${cookie.key}=${cookie.value}`]);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'Access revoked',
      })
    );

    await destroyTemp(toBeRevokedUser);

    done();
  });
});
