const path = require("path");

const config = {
  port: process.env.PORT || 3001,
  serviceAccountKeyPath: path.join(
    __dirname,
    "../credentials/service-account.json"
  ),
};

module.exports = config;
