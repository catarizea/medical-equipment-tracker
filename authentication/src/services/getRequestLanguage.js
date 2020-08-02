const get = require('lodash.get');
const { htmlEscape } = require('escape-goat');

const getRequestLanguage = (req) => {
  let language = htmlEscape(get(req, `headers['accept-language']`, 'en'));
  
  if (!language) language = 'en';

  return language;
}

module.exports = getRequestLanguage;