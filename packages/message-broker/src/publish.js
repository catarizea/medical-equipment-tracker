const open = require('./open');

module.exports = async (queue, task) => {
  let sent = false;

  try {
    const conn = await open;
    const ch = await conn.createChannel();
    await ch.assertQueue(queue, { durable: true });
    res = await ch.sendToQueue(queue, Buffer.from(task), { persistent: true });
    sent = !!res;
  } catch (error) {
    console.log(error);
  }

  return sent;
};
