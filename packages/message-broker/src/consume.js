const open = require('./open');

module.exports = async (queue, consumer) => {
  try {
    const conn = await open;
    const ch = await conn.createChannel();
    await ch.assertQueue(queue, { durable: true });
    await ch.prefetch(1);
    await ch.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          consumer(msg, ch);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }
};
