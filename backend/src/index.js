const path = require('path');
const express = require('express');
const CONFIG = require('@medical-equipment-tracker/config');

const app = express();

const frontendPath = path.join(__dirname, '../..', 'frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = CONFIG.PORT || 3500;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
