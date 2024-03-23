const authentication = require("./authentication");
const published = require("./published");
const book = require("./book");

function route(app) {
  app.use("/authentication", authentication);
  app.use("/published", published);
  app.use("/book", book);
  // app.use("/order", order);
  // app.use("/orderdetail", orderdetail);
  // app.use("/customer", customer);
}

module.exports = route;
