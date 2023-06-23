const { Redis } = require("ioredis");
const client = new Redis(process.env.REDIS_URL);

client.on("error", (err) => {
  console.error("upstash redis connection error:", err.message);
});

module.exports = {
  setLoggedInUser: async (user) => {
    try {
      const userInfo = JSON.stringify(user);
      await client.set(`${user.email}`, userInfo, (error, reply) => {
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
  getLoggedInUser: async (email) => {
    try {
      const value = await client.get(`${email}`);
      return value;
    } catch (error) {
      console.log(error.message);
    }
  },
  setItemIoCart: async (userId, item) => {
    try {
      const itemInfo = JSON.stringify(item);
      await client.set(`${userId}`, itemInfo, (error, reply) => {
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
  getCartItems: async (userId) => {
    try {
      const value = await client.get(`${userId}`);
      return value;
    } catch (error) {
      console.log(error.message);
    }
  },
};
