const pgtools = require('pgtools');

const config = {
  user: process.env.HASURA_POSTGRES_USER,
  password: process.env.HASURA_POSTGRES_PASSWORD,
  port: process.env.HASURA_POSTGRES_PORT,
  host: '127.0.0.1',
};

pgtools.createdb(config, process.env.AUTHENTICATION_DB_NAME, function (
  err,
  res
) {
  if (err) {
    console.error('Database already exists');
    process.exit(0);
  }
  console.log('Database created');
});
