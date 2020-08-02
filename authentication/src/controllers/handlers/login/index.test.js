const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');

let adminUser;
let tempUser;
let createTemp;
let destroyTemp;

const path = `${prefix}/login`;

beforeAll(async () => {
  const users = await loadUsers();
  adminUser = users.adminUser;
  tempUser = users.tempUser;
  createTemp = users.createTemp;
  destroyTemp = users.destroyTemp;
});

describe('/login endpoint', () => {
  it('should return tokens when email and password are correct', async (done) => {
    const res = await testApi
      .post(path)
      .send({ email: adminUser.email, password: 'Password1' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('jwtToken');
    expect(res.body).toHaveProperty('jwtTokenExpiry');
    expect(res.body).toHaveProperty('refreshToken');

    done();
  });

  it('should return 400 validation error when email is not valid', async (done) => {
    const res = await testApi
      .post(path)
      .send({ email: 'not an email', password: 'Password1' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });

  it('should return 400 validation error when email and password are missing', async (done) => {
    const res = await testApi.post(path);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });

  it('should return 401 unauthorized when password is incorrect', async (done) => {
    const res = await testApi
      .post(path)
      .send({ email: adminUser.email, password: 'Password1234' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Unauthorized');
    expect(res.body.message).toEqual('Invalid email or password');

    done();
  });

  it('should return 401 unauthorized when access is revoked', async (done) => {
    const user = { ...tempUser, isBlocked: true };
    await createTemp(user);

    const res = await testApi
      .post(path)
      .send({ email: user.email, password: 'Password1' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Unauthorized');
    expect(res.body.message).toEqual('Access revoked');

    await destroyTemp(user);

    done();
  });
});
