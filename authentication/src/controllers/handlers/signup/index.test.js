const { v4: uuidv4 } = require('uuid');

const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  createSignupInvitation,
  destroySignupInvitation,
} = require('../../../utils/testHelpers/signupinvitation');

let invited;
const path = `${prefix}/signup`;

const invitee = {
  email: 'max-boshuruku@medical.equipment',
  name: 'Boshuruku',
  UserId: 1,
  token: uuidv4(),
};

const user = {
  firstName: invitee.name,
  lastName: 'Max',
  email: invitee.email,
  password: 'Password1',
  confirmPassword: 'Password1',
};

beforeAll(async () => {
  invited = await createSignupInvitation(invitee);
});

afterAll(async () => {
  await destroySignupInvitation(invitee);
});

describe('/signup endpoint', () => {
  it('should return valid credentials set', async (done) => {
    const { token } = invited;
    user.token = token;

    const res = await testApi.post(path).send(user);

    // expect(res.statusCode).toEqual(200);
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

  it('should fail when trying to reuse the token', async (done) => {
    const pirateUser = {
      ...user,
      email: 'pirate@medical.equipment',
      token: invited.token,
    };

    const res = await testApi.post(path).send(pirateUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: 'Bad Request',
        message: 'Invalid sign up invitation',
      })
    );

    done();
  });
});
