const { Redis } = require("ioredis");
const client = new Redis(process.env.REDIS_URL);

client.on("error", (err) => {
  console.error("Upstash Redis connection error:", err.message);
});

module.exports = {
  setLoggedInUser: async (user) => {
    try {
      client.set(`${user._id}`, user, (error, reply) => {
        if (error) {
          console.log(error, "eeeeeee");
        } else {
          console.log("Data set in Redis:", reply);
        }
      });
    } catch (error) {
      console.log(error, "eeeeeee");
    }
  },
};
