const { Redis } = require("ioredis");
const client = new Redis(process.env.REDIS_URL);

client.on("error", (err) => {
  console.error("upstash redis connection error:", err.message);
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
      return value;
    } catch (error) {
      console.log(error.message);
    }
  },
  setItemIoCart: async (item) => {
    try {
      const itemInfo = JSON.stringify(item);
      await client.set(`${item._id}`, itemInfo, (error, reply) => {
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
};
