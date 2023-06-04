const { createClient } = require("redis");

const redisConnectionSetUp = async (url) => {
  try {
    const client = createClient({
      url: url,
    });
    await client.connect();
    await client.set("connection", "successfull");
    return true;
  } catch (error) {
    console.log(`Redis Connection Failed ${error.message}`);
  }
};

module.exports = { redisConnectionSetUp };
