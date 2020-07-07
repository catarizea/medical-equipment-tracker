const path = require('path');

const envFile = process.env.NODE_ENV === 'development' ? '.env.development.local' : '.env.production.local';
require('dotenv').config({ path: path.join(__dirname, '../../../..', envFile) });

module.exports = {
  development: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: '127.0.0.1',
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres'
  },
  test: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: '127.0.0.1',
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres'
  },
  production: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: '127.0.0.1',
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres'
  },
};
