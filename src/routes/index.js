const authentication = require("./authentication");
const published = require("./published");
const customer = require("./customer");
const rent = require("./rent");

const book = require("./book");

function route(app) {
  app.use("/authentication", authentication);
  app.use("/published", published);
  app.use("/book", book);
  app.use("/rent", rent);
  app.use("/customer", customer);
}

module.exports = route;
