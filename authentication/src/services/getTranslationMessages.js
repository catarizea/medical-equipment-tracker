const getRequestLanguage = require('./getRequestLanguage');
const translationMessages = require('../i18n/translation.json');

const getTranslationMessages = (req) => {
  const language = getRequestLanguage(req);
  return translationMessages[language] ? translationMessages[language] : translationMessages.en;
};

module.exports = getTranslationMessages;