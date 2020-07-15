const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { httpLogger } = require('./middlewares');
const { logger } = require('./services');
  
require('dotenv').config({ path: path.join(__dirname, '../..', `.env.${process.env.NODE_ENV}.local`) });

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

const frontendPath = path.join(__dirname, '../..', 'frontend/build');
app.use(express.static(frontendPath));

app.use('/api/authentication', require('./controllers/users'));
app.use(require('./middlewares/handleErrors'));

if (process.env.NODE_ENV === 'development') {  
  app.use('/api-docs', require('./utils/swagger'));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = process.env.AUTHENTICATION_EXPRESS_PORT || 3500;

app.listen(port, () => {
  logger.info(`App is listening on port ${port}`);
});
