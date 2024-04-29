// const fs = require("fs");
const IconService = require("icon-sdk-js");
const config = require("../../utils/config");
const rqst = require("rqst");

const { HttpProvider, IconBuilder } = IconService.default;

const JVM_HTTP_PROVIDER = new HttpProvider(config.jvm.default.rpc);
const JVM_SERVICE = new IconService.default(JVM_HTTP_PROVIDER);

function makeJsonRpcRequestObject(
  method,
  params = null,
  to = "cx0000000000000000000000000000000000000000",
  height = null,
  jsonRpcMethod = "icx_call",
) {
  const obj = {
    jsonrpc: "2.0",
    method: jsonRpcMethod,
    id: Math.ceil(Math.random() * 1000),
    params: {
      to: to,
      dataType: "call",
      data: {
        method,
      },
    },
  };

  if (params !== null) {
    obj.params.data.params = params;
  }

  if (height !== null) {
    if (typeof height !== "number") {
      throw new Error("Height must be a number");
    } else {
      obj.params.height = "0x" + height.toString(16);
    }
  }

  return JSON.stringify(obj);
}

function parseUrl(url) {
  const inputInlowercase = url.toLowerCase();
  const urlRegex =
    /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;

  const parsedUrl = {
    protocol: "https",
    path: "/",
    hostname: null,
    port: "443",
  };

  const regexResult = inputInlowercase.match(urlRegex);

  if (regexResult != null) {
    parsedUrl.protocol = regexResult[2] == null ? "https" : regexResult[2];
    parsedUrl.path = regexResult[7] == null ? "/" : regexResult[7];
    parsedUrl.hostname = regexResult[3] == null ? null : regexResult[3];
    parsedUrl.port = regexResult[6] == null ? "" : regexResult[6].slice(1);
  }

  return parsedUrl;
}

async function makeJsonRpcCall(data, url, queryMethod = rqst) {
  let query = null;
  try {
    const parsedUrl = parseUrl(url);
    query = await queryMethod(
      parsedUrl.path,
      data,
      parsedUrl.hostname,
      parsedUrl.protocol == "http" ? false : true,
      parsedUrl.port === "" ? false : parsedUrl.port,
    );

    if (query.error == null) {
      return query.result;
    } else {
      throw new Error(query.error);
    }
  } catch (err) {
    throw new Error(
      `Error running node request. query: ${JSON.stringify(
        query,
      )}. Error: ${JSON.stringify(err)}`,
    );
  }
}

module.exports = {
  JVM_SERVICE,
  IconBuilder,
  makeJsonRpcRequestObject,
  makeJsonRpcCall,
};
