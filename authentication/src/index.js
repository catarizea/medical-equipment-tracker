const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({ path: path.join(__dirname, '../..', envFile) });

const handleErrors = require('./middlewares/handleErrors');

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
app.use(morgan('tiny'));
app.disable('x-powered-by');

const frontendPath = path.join(__dirname, '../..', 'frontend/build');
app.use(express.static(frontendPath));

app.use('/api/authentication', require('./controllers/users'));
app.use(handleErrors);

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = process.env.AUTHENTICATION_EXPRESS_PORT || 3500;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
