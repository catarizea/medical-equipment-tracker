const supertest = require('supertest');
const app = require('../server');

module.exports = supertest(app);
