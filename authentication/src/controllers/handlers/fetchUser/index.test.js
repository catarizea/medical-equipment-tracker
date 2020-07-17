const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  adminUser,
  tempUser,
  createTemp,
  destroyTemp,
  login,
} = require('../../../utils/testHelpers/user');

const path = `${prefix}/fetch-user`;

describe('/fetch-user endpoint', () => {
  it('should return valid signup invitation', async (done) => {
    const user = {
      ...tempUser,
      isBlocked: true,
      blockedBy: adminUser.id,
      blockedByIp: '127.0.0.1',
      email: 'fetch-user@medical.equipment',
    };

    const credentials = await login(adminUser);

    const createdUser = await createTemp(user);
    const res = await testApi
      .get(`${path}/${createdUser.id}`)
      .set('Authorization', `Bearer ${credentials.jwtToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        fullName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isBlocked: user.isBlocked,
        blockedByIp: user.blockedByIp,
        blockedBy: {
          email: adminUser.email,
          fullName: `${adminUser.firstName} ${adminUser.lastName}`,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );

    await destroyTemp(user);

    done();
  });
});
