const client = require("../utils/Client")
const controllers = require("../controllers");
const { log } = console;

// set up base path
const basePath = "api/users"
const responsePath = "api/gateway/users"

client.subscribe(basePath)
// add topics to listen to
const topics = [
  { topic: "login", qos: 0 },
  { topic: "register", qos: 0 },
  //{ topic: "frontend", qos: 0 },
];
// loop subscribe
topics.forEach(route => {
  //log(basePath + "/" + route.topic);
  client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

// emit the topic
client.on("message", (t, m) => {
  const msg = JSON.parse(m.toString())
  const topic = t.replace(basePath + "/", ""); // api/users/login -> login
  //log(topic)
  if (topic === "api/users") {
    client.emit("/")
  } else {
    client.emit(topic, msg)
  }
});

// this is where routes go
// so you listen for the topic and call relevant controller functions
client.on("login", async (m) => {
  const res = await controllers.users.login(m)
   client.publish(responsePath + "/login", JSON.stringify(res));
})
client.on("register", (m) => {
  controllers.users.register(m)
});
client.on("/", async () => {
  const res = await controllers.users.findAll()
  // log(res)
  // send back to gateway
  client.publish(responsePath, Buffer.from(res))
})



module.export = client;