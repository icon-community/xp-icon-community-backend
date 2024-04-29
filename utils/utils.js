// const fs = require("fs");
const IconService = require("icon-sdk-js");
const config = require("./config");

const { HttpProvider } = IconService.default;

const JVM_HTTP_PROVIDER = new HttpProvider(config.jvm.default.rpc);
const JVM_SERVICE = new IconService.default(JVM_HTTP_PROVIDER);

module.exports = {
  JVM_SERVICE,
};
