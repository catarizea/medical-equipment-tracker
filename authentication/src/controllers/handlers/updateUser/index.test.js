const { v4: uuidv4 } = require('uuid');

const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const loadUsers = require('../../../utils/testHelpers/user');
  
let tempUser;
let adminUser;
let createTemp;
let destroyTemp;
let login;

const path = `${prefix}/update-user`;

let user;
let userBlocked;

let createdUser;
let createdUserBlocked;

const updateWith = {
  firstName: 'Simona',
  lastName: 'Galushka',
};

beforeAll(async () => {
  const users = await loadUsers();
  tempUser = users.tempUser;
  adminUser = users.adminUser;
  createTemp = users.createTemp;
  destroyTemp = users.destroyTemp;
  login = users.login;

  user = { ...tempUser, email: 'update-user@medical.equipment' };
  userBlocked = { ...tempUser, email: 'update-user-blocked@medical.equipment' };

  createdUser = await createTemp(user);
  user.id = createdUser.id;

  createdUserBlocked = await createTemp(userBlocked);
  userBlocked.id = createdUserBlocked.id;
});

afterAll(async () => {
  await destroyTemp(user);
  await destroyTemp(userBlocked);
});

describe('/update-user endpoint', () => {
  it('should update own first and last name as user with default role', async (done) => {
    const { jwtToken } = await login(user);

    const res = await testApi
      .put(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWith);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'User updated',
      })
    );

    done();
  });

  it('should update user as an admin user', async (done) => {
    const { jwtToken } = await login(adminUser);
    
    const updateWithFull = {
      ...updateWith,
      role: ['user', 'admin'],
      isBlocked: false,
    };

    const res = await testApi
      .put(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithFull);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'User updated',
      })
    );

    done();
  });

  it('should update user with revoked access as an admin user', async (done) => {
    const { jwtToken } = await login(adminUser);
    
    const updateWithAccess = {
      ...updateWith,
      isBlocked: true,
    };

    const res = await testApi
      .put(`${path}/${userBlocked.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithAccess);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'User updated',
      })
    );

    done();
  });

  it('should fail when trying to update own user as an admin user', async (done) => {
    const { jwtToken } = await login(adminUser);
    
    const updateWithFull = {
      ...updateWith,
      role: ['user', 'admin'],
      isBlocked: true,
    };

    const res = await testApi
      .put(`${path}/${adminUser.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithFull);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'You cannot update your own role',
      })
    );

    done();
  });

  it('should fail when trying to update user as an admin user with a non existent role', async (done) => {
    const { jwtToken } = await login(adminUser);
    
    const updateWithFull = {
      ...updateWith,
      role: ['user', 'admin', 'admin', 'funny', 'chaos'],
    };

    const res = await testApi
      .put(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithFull);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });

  it('should fail when to update user role as a user with default role', async (done) => {
    const { jwtToken } = await login(user);
    
    const updateWithRole = {
      ...updateWith,
      role: ['user', 'admin'],
    };

    const res = await testApi
      .put(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithRole);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'You cannot update your own role',
      })
    );

    done();
  });

  it('should fail when to update user access as a user with default role', async (done) => {
    const { jwtToken } = await login(user);
    
    const updateWithAccess = {
      ...updateWith,
      isBlocked: false,
    };

    const res = await testApi
      .put(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWithAccess);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'You cannot update your own access',
      })
    );

    done();
  });

  it('should fail when to update a non existent account', async (done) => {
    const { jwtToken } = await login(user);

    const res = await testApi
      .put(`${path}/${uuidv4()}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateWith);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'No account for this id',
      })
    );

    done();
  });
});
