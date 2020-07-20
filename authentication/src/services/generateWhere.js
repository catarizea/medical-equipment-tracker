const operators = require('../constants/operators');
const { htmlEscape } = require('escape-goat');

module.exports = (q, attributes) => {
  const where = {};

  attributes.forEach((attr) => {
    if (attr in q) {
      where[attr] = {};

      Object.keys(q[attr]).forEach((key) => {
        if (key in operators) {
          where[attr][operators[key]] =
            typeof q[attr][key] === 'number'
              ? q[attr][key]
              : htmlEscape(q[attr][key]);
        }
      });
    }
  });

  return where;
};
