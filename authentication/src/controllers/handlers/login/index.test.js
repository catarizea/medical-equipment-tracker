const { testApi } = require('../../../services');
const prefix = require('../../../constants/apiUrlPrefix');

describe('/login endpoint', () => {
  it('should return tokens when email and password are correct', async (done) => {
    const res = await testApi
      .post(`${prefix}/login`)
      .send({ email: 'catalin@medical.equipment', password: 'Password1' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('jwtToken');
    expect(res.body).toHaveProperty('jwtTokenExpiry');
    expect(res.body).toHaveProperty('refreshToken');
    
    done();
  });

  it('should return 400 validation error when email and password are not valid', async (done) => {
    const res = await testApi
      .post(`${prefix}/login`)
      .send({ email: 'not an email', password: 'Password1' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });

  it('should return 400 validation error when email and password are missing', async (done) => {
    const res = await testApi
      .post(`${prefix}/login`);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Validation error');

    done();
  });

  it('should return 401 unauthorized when password is incorrect', async (done) => {
    const res = await testApi
      .post(`${prefix}/login`)
      .send({ email: 'catalin@medical.equipment', password: 'Password1234' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual('Unauthorized');
    expect(res.body.message).toEqual('Invalid email or password');

    done();
  });
});
