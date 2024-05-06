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

async function getAccountPositions(
  _owner,
  height = null,
  contract = config.jvm.default.contracts.balanced.loans,
) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getAccountPositions",
      {
        _owner: _owner,
      },
      contract,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (err) {
    console.log("Error making getAccountPositions request");
    console.log(err.message);
    throw new Error(err.message);
  }
}

async function getSicxDebtInUSDValue(wallet, height) {
  try {
    const position = await getAccountPositions(wallet, height);
    // console.log("position");
    // console.log(position);
    return parseInt(position.standings.sICX.total_debt_in_USD, 16) / 10 ** 18;
  } catch (err) {
    console.log("Error getting sICX debt in USD value");
    console.log(err.message);
    const str = "does not have a position in Balanced";
    if (err.message.includes(str)) {
      return 0;
    } else {
      throw new Error(err.message);
    }
  }
}
async function getSicxCollateralInUSDValue(wallet, height) {
  try {
    const position = await getAccountPositions(wallet, height);
    // console.log("position");
    // console.log(position);
    return parseInt(position.standings.sICX.collateral_in_USD, 16) / 10 ** 18;
  } catch (err) {
    console.log("Error getting sICX collateral in USD value");
    console.log(err.message);
    const str = "does not have a position in Balanced";
    if (err.message.includes(str)) {
      return 0;
    } else {
      throw new Error(err.message);
    }
  }
}

async function getLockedAmount(
  user,
  height = null,
  contract = config.jvm.default.contracts.balanced.savings,
) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getLockedAmount",
      {
        user: user,
      },
      contract,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (e) {
    console.log("Error making getLockedAmount request");
    console.error(e);
  }
}

async function getUsersList(
  height = null,
  contract = config.jvm.default.contracts.registrationBook,
) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getUsersList",
      null,
      contract,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (e) {
    console.log("Error making getUsersList request");
    console.error(e);
  }
}

async function getUserRegistrationBlock(
  user,
  height = null,
  contract = config.jvm.default.contracts.registrationBook,
) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      "getUserRegistrationBlock",
      { user: user },
      contract,
      height,
    );
    return await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
  } catch (e) {
    console.log("Error making getUserRegistrationBlock request");
    console.error(e);
  }
}

module.exports = {
  getNetworkInfo,
  getPRepTerm,
  getAccountPositions,
  getLockedAmount,
  getUsersList,
  getUserRegistrationBlock,
  getSicxCollateralInUSDValue,
  getSicxDebtInUSDValue,
};
