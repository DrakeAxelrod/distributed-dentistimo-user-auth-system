const client = require("../utils/Client");
const controllers = require("../controllers");
const CircuitBreaker = require("opossum");

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};


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
const breaker = new CircuitBreaker(client.on("message", (t, m) => {
  const msg = JSON.parse(m.toString());
  const topic = t.replace(basePath + "/", ""); // api/users/login -> login
  client.emit(topic, topic, msg);
}), {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 25, // When 25% of requests fail, trip the circuit
  resetTimeout: 10000, // After 10 seconds, try again.
});
breaker.fire()

client.on("login", async (t, m) => {
  const result = await controllers.users.login(m);
  const breaker = new CircuitBreaker(
    client.publish(responsePath + "/login", result),
    options
  );
  const breakerResult = breaker
    .fire()
    .then((res) => res)
    .catch(console.error);
  //client.publish(responsePath + "/login", result);
});
client.on("register", (t, m) => {
  console.log(m)
    const breaker = new CircuitBreaker(
      controllers.users.register(t, m),
      options
    );
    const breakerResult = breaker
      .fire()
      .then((res) => res)
      .catch(console.error);
  //controllers.users.register(t, m);
});


module.export = client;
