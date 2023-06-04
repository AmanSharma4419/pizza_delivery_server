const { Redis } = require("ioredis");
const client = new Redis(process.env.REDIS_URL);

client.on("error", (err) => {
  console.error("Upstash Redis connection error:", err.message);
});

module.exports = {
  setLoggedInUser: async (user) => {
    try {
      const userInfo = JSON.stringify(user);
      await client.set(`${user._id}`, userInfo, (error, reply) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log("Data set in Redis:", reply);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  getLoggedInUser: async (user) => {
    try {
      const value = await client.get(`${user._id}`);
      console.log("Value retrieved from Redis:", value);
    } catch (error) {
      console.log(error.message);
    }
  },
};
