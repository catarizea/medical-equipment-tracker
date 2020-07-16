const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { httpLogger } = require('./middlewares');

require('dotenv').config({
  path: path.join(__dirname, '../..', `.env.${process.env.NODE_ENV}.local`),
});

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(httpLogger);
}

app.disable('x-powered-by');

app.use('/api/authentication', require('./controllers/users'));
app.use(require('./middlewares/handleErrors'));

if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', require('./utils/swagger'));
}

if (process.env.NODE_ENV !== 'test') {
  const frontendPath = path.join(__dirname, '../..', 'frontend/build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

module.exports = app;
