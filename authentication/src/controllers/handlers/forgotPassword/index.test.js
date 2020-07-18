const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const { defaultUser } = require('../../../utils/testHelpers/user');

const path = `${prefix}/forgot-password`;

describe('/forgot-password endpoint', () => {
  it('should send the reset password email', async (done) => {
    const res = await testApi.post(path).send({
      email: defaultUser.email,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        result: 'Reset email message sent',
      })
    );

    done();
  });

  it('should fail when trying to reset password for an account that does not exist', async (done) => {
    const res = await testApi.post(path).send({
      email: 'forgot-password@medical.equipment',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'No account for this email',
      })
    );

    done();
  });
});
