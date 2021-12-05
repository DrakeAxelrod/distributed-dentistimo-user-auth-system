const { log } = console;

const client = require("mqtt").connect({
  clientId: "UsersManagement",
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on("error", (err) => {
  log(err);
})

client.on("connect", (ack) => {
    log("mqtt client connected!");
});

module.exports = client
