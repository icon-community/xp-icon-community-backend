const { makeJsonRpcRequestObject, makeJsonRpcCall } = require("./utils");
const config = require("../../utils/config");

async function getNetworkInfo(height = null) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getNetworkInfo",
      null,
      config.jvm.default.contracts.chain,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (e) {
    console.log("Error making getNetworkInfo request");
    console.error(e);
  }
}

async function getPRepTerm(height = null) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getPRepTerm",
      null,
      config.jvm.default.contracts.chain,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (e) {
    console.log("Error making getPRepTerm request");
    console.error(e);
  }
}
module.exports = {
  getNetworkInfo,
  getPRepTerm,
};
