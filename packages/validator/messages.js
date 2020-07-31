const get = require('lodash.get');

const translationMessages = require('./translation.json');

const language = typeof window === 'undefined' ? 'en' : get(window, 'navigator.language', 'en').slice(0, 2);
const messages = translationMessages[language];

module.exports = messages;
