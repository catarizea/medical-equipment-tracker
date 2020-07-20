const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { httpLogger } = require('./middlewares');

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
app.use(httpLogger);
app.disable('x-powered-by');
app.use(helmet());

app.use('/api/authentication', require('./controllers/users'));
app.use(require('./middlewares/handleErrors'));

if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', require('./utils/swagger'));
}

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../..', 'frontend/build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

module.exports = app;
