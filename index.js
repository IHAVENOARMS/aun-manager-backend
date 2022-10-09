require("dotenv").config();
const config = require("config");
const { json } = require("express");
const express = require("express");
const app = express();

app.use(json);
app;

app.listen(config.get("testPort"), () => {
  console.log(`Started listening at port ${config.get("testPort")}...`);
});
