const client = require("../utils/Client");
const controllers = require("../controllers");
const { login, register } = controllers.users
const CircuitBreaker = require("opossum");

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const circuits = {
  login: new CircuitBreaker(login, options),
  register: new CircuitBreaker(register, options)
}
circuits.login.fallback(() =>
  JSON.stringify({
    message: "the service is currently unavailable please try again later.",
  })
);
circuits.register.fallback(() =>
  JSON.stringify({
    message: "the service is currently unavailable please try again later.",
  })
);

circuits.login.on("failure", () => console.log("login failed"));
circuits.register.on("failure", () => console.log("register failed"));


// set up base path
const basePath = "api/users";
const responsePath = "api/gateway/users";

client.subscribe(basePath);
const topics = [
  { topic: "login", qos: 2 },
  { topic: "register", qos: 2 },
  { topic: "all", qos: 2 },
];
topics.forEach((route) => {
  
  client.subscribe(basePath + "/" + route.topic, { qos: route.qos });
});

// emit the topic
client.on("message", (t, m) => {
  const msg = JSON.parse(m.toString());
  const topic = t.replace(basePath + "/", ""); // api/users/login -> login
  client.emit(topic, msg);
})

client.on("login", async (m) => {
  const result = await circuits.login.fire(m);
  client.publish(responsePath + "/login", result);
});
client.on("register", async (m) => {
  const result = await circuits.register.fire(m)
  client.publish(responsePath + "/register", result);
});


module.export = client;
