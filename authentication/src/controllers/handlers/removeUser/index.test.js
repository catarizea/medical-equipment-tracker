const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  adminUser,
  login,
  tempUser,
  createTemp,
  destroyRemovedUser,
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/remove-user`;

describe('/remove-user endpoint', () => {
  it('should remove an existing user', async (done) => {
    const { jwtToken } = await login(adminUser, true);

    const user = { ...tempUser };
    const createdTemp = await createTemp(user);
    user.id = createdTemp.id;
    await login(user, true); // creating refresh token for user to be removed

    const res = await testApi
      .delete(`${path}/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'User removed',
      })
    );

    await destroyRemovedUser(user);

    done();
  });

  it('should fail if admin user tries to remove own account', async (done) => {
    const { jwtToken } = await login(adminUser, true);

    const res = await testApi
      .delete(`${path}/1`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Unauthorized',
        message: 'You cannot remove your own account',
      })
    );

    done();
  });
});
