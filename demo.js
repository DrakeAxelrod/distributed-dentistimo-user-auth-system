const mqtt = require("mqtt");
const dotenv = require("dotenv")
const { log } = console;

dotenv.config();

const client = mqtt.connect({
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on("connect", (ack, err) => {
  if (!err) {
    console.log("connected");
    setInterval(() => client.publish("user", "message from user-management"), 1000)
  } else {
    console.log(err);
  }
});

client.subscribe("gateway");
client.subscribe("users/login")

client.on("message", (topic, message) => {
  log(message.toString());
  if (message.toString() === "stop") {
    client.end();
  }
});
