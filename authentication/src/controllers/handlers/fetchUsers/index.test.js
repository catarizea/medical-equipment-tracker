const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const { adminUser, login } = require('../../../utils/testHelpers/user');

const path = `${prefix}/fetch-users`;

describe('/fetch-users endpoint', () => {
  it('should return the users array', async (done) => {
    const credentials = await login(adminUser);

    const res = await testApi
      .get(
        `${path}?email[Op.startsWith]=cat&email[Op.endsWith]=ment&id[Op.lt]=2`
      )
      .set('Authorization', `Bearer ${credentials.jwtToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          fullName: `${adminUser.firstName} ${adminUser.lastName}`,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role,
          isBlocked: adminUser.isBlocked,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ])
    );

    done();
  });
});
