const operators = require('../constants/operators');

module.exports = (q, attributes) => {
  const where = {};

  attributes.forEach((attr) => {
    if (attr in q) {
      where[attr] = {};
      
      Object.keys(q[attr]).forEach((key) => {
        if (key in operators) {
          where[attr][operators[key]] = q[attr][key];
        }
      });
    }
  });

  return where;
};
