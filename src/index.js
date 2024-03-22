const express = require("express");
const app = express();
const config = require("./app/config");

const PORT = config.app.port;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.json({ message: "hello world!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
