const IconService = require("icon-sdk-js");
const config = require("./config");
const rqst = require("rqst");
const fs = require("fs");
const customPath = require("./customPath");
const { getAllSeasons } = require("../services/v1/seasonService");
const { parseUrl, isValidHex, isXChainWallet, taskRunner } = require("./lib");

const { HttpProvider, IconBuilder } = IconService.default;

const JVM_HTTP_PROVIDER = new HttpProvider(config.jvm.default.rpc);
const JVM_SERVICE = new IconService.default(JVM_HTTP_PROVIDER);

function makeJsonRpcRequestObject(
  method,
  params = null,
  to = "cx0000000000000000000000000000000000000000",
  height = null,
  jsonRpcMethod = "icx_call",
  params2 = null,
) {
  const obj = {
    jsonrpc: "2.0",
    method: jsonRpcMethod,
    id: Math.ceil(Math.random() * 1000),
  };

  if (to == null) {
    if (params2 == null) {
      throw new Error("To and params2 cannot be null at the same time");
    }
    obj.params = { ...params2 };
  } else {
    obj.params = {
      to: to,
      dataType: "call",
      data: {
        method,
      },
    };
    if (params !== null) {
      obj.params.data.params = params;
    }
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
      throw new Error(JSON.stringify(query.error));
    }
  } catch (err) {
    console.log(`Error running node request. query: ${JSON.stringify(query)}`);
    throw new Error(err);
  }
}

async function getInitBlock(db) {
  // This function will try to first fetch the last block from the seed file and if that fails, it will try to fetch it from the database by
  // looking for the active season and returning the blockStart of that season
  // If both fail, it will return null
  try {
    console.log("> Fetching last block from seed file");
    // first try to fetch from seed file
    const mainSeed = JSON.parse(fs.readFileSync(customPath(config.seeds.main)));

    if (mainSeed != null && mainSeed.lastBlock != null) {
      console.log("> Last block found in seed file. Returning block.");
      return mainSeed.lastBlock;
    } else {
      throw new Error("Seed file is empty");
    }
  } catch (err) {
    console.log("> Error fetching last block from seed file. Error: ");
    console.log(err.message);
  }

  try {
    console.log("> Trying to recover last block from database");
    console.log("> Creating connection to database");
    await db.createConnection();

    console.log("> Fetching all seasons from database");
    const allSeasons = await getAllSeasons(db.connection);

    console.log("> Searching active seasons");
    const activeSeason = allSeasons
      .filter((season) => season.active === true)
      .reduce((lowest, current) => {
        return lowest.blockStart < current.blockStart ? lowest : current;
      });

    if (activeSeason != null) {
      // if active season is found, return the blockStart
      console.log(
        "> Active seasons found in database. Returning block from season with lowest blockStart.",
      );
      console.log("> Closing connection to database");
      db.stop();
      return activeSeason.blockStart;
    } else {
      throw new Error("No active season found in database");
    }
  } catch (err) {
    console.log("> Error fetching last block from database. Error: ");
    console.log(err.message);
    console.log("> Closing connection to database");
    db.stop();
  }
}
module.exports = {
  JVM_SERVICE,
  IconBuilder,
  makeJsonRpcRequestObject,
  makeJsonRpcCall,
  isValidHex,
  isXChainWallet,
  taskRunner,
  getInitBlock,
};
