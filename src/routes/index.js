const authentication = require("./authentication");
const published = require("./published");

function route(app) {
  app.use("/authentication", authentication);
  app.use("/published", published);
  // app.use("/cart", cart);
  // app.use("/order", order);
  // app.use("/orderdetail", orderdetail);
  // app.use("/customer", customer);
}

module.exports = route;
