const { v4: uuidv4 } = require('uuid');

const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');
const {
  createSignupInvitation,
  destroySignupInvitation,
} = require('../../../utils/testHelpers/signupinvitation');
const loadUsers = require('../../../utils/testHelpers/user');

let invited;
const path = `${prefix}/check-signup-invitation`;

const invitee = {
  email: 'boshuruku@medical.equipment',
  name: 'Boshuruku',
  token: uuidv4(),
};

beforeAll(async () => {
  const users = await loadUsers();
  invitee.UserId = users.adminUser.id;
  invited = await createSignupInvitation(invitee);
});

afterAll(async () => {
  await destroySignupInvitation(invitee);
});

describe('/check-signup-invitation endpoint', () => {  
  it('should return valid signup invitation', async (done) => {
    const res = await testApi
      .get(`${path}/${invited.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toEqual('Valid sign up invitation');
    expect(res.body).toHaveProperty('payload');
    expect(res.body.payload).toHaveProperty('email');
    expect(res.body.payload).toHaveProperty('token');
    expect(res.body.payload).toHaveProperty('name');

    done();
  });

  it('should return validation error for sign up invitation', async (done) => {
    const res = await testApi
      .get(`${path}/invalid-token`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });
});
