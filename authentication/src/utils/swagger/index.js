const path = require('path');
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

require('dotenv').config({
  path: path.join(__dirname, '../../..', '.env.development.local'),
});

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

swaggerDocument.servers[0].url = process.env.AUTHENTICATION_EXPRESS_ENDPOINT; 

// console.log(JSON.stringify(swaggerDocument, null, 2));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;