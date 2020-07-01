const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'dev.env') });

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/build/index.html'));
});

const port = process.env.EXPRESS_PORT || 3500;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
