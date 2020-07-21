const open = require('./open');

module.exports = (queue, consumer) => {
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      return ch
        .assertQueue(queue, { durable: true })
        .then(() => ch.prefetch(1))
        .then(() => {
          return ch.consume(
            queue,
            (msg) => {
              if (msg !== null) {
                consumer(msg, ch);
              }
            },
            { noAck: false }
          );
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
