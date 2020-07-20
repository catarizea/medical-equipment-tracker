const open = require('./open');

module.exports = (queue, task) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      return ch.assertQueue(queue, { durable: true }).then(() => {
        return ch.sendToQueue(
          queue,
          Buffer.from(task),
          { persistent: true },
          (err) => !!err
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
