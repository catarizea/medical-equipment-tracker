const operators = require('../constants/operators');

module.exports = (q, attributes) => {
  const where = {};

  attributes.forEach((attr) => {
    if (q[attr]) {
      where[attr] = {};
      
      Object.keys(q[attr]).forEach((key) => {
        if (operators[key]) {
          where[attr][operators[key]] = q[attr][key];
        }
      });
    }
  });

  return where;
};
