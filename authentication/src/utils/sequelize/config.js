module.exports = {
  development: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: process.env.AUTHENTICATION_EXPRESS_IP,
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres'
  },
  test: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: process.env.AUTHENTICATION_EXPRESS_IP,
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.HASURA_POSTGRES_USER,
    password: process.env.HASURA_POSTGRES_PASSWORD,
    database: process.env.AUTHENTICATION_DB_NAME,
    host: process.env.AUTHENTICATION_EXPRESS_IP,
    port: process.env.HASURA_POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
  },
};
