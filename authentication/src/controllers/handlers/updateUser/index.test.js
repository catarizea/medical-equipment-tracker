const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  tempUser,
  adminUser,
  createTemp,
  destroyTemp,
  login,
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/update-user`;

const user = { ...tempUser, email: 'update-user@medical.equipment' };
const userBlocked = { ...tempUser, email: 'update-user-blocked@medical.equipment' };

let createdUser;
let createdUserBlocked;

const updateWith = {
  firstName: 'Simona',
  lastName: 'Galushka',
};

beforeAll(async () => {
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
      role: ['User', 'Admin'],
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
      role: ['User', 'Admin'],
      isBlocked: true,
    };

    const res = await testApi
      .put(`${path}/1`)
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
      role: ['User', 'Admin', 'Admin', 'Funny', 'Chaos'],
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
      role: ['User', 'Admin'],
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
      .put(`${path}/1001`)
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
