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
async function getDataFromStandings(wallet, token, data, height) {
  try {
    const position = await getAccountPositions(wallet, height);

    if (position.standings[token] == null) {
      throw new Error(
        `token ${token} not found in standings at height ${height}`,
      );
    }
    return parseInt(position.standings[token][data], 16) / 10 ** 18;
  } catch (err) {
    console.log(`Error getting ${data} value for ${token}`);
    console.log(err.message);
    const str = [
      "does not have a position in Balanced",
      "not found in standings",
    ];
    for (let i = 0; i < str.length; i++) {
      if (err.message.includes(str[i])) {
        return 0;
      }
    }
    throw new Error(err.message);
  }
}

async function getTotalDebtInUSDValue(wallet, height) {
  try {
    const position = await getAccountPositions(wallet, height);

    const tokens = Object.keys(position.standings);
    let totalDebt = 0;
    for (let i = 0; i < tokens.length; i++) {
      totalDebt +=
        parseInt(position.standings[tokens[i]]["total_debt_in_USD"], 16) /
        10 ** 18;
    }

    return totalDebt;
  } catch (err) {
    console.log(`Error getting total debt value in USD for ${wallet}`);
    console.log(err.message);
    const str = [
      "does not have a position in Balanced",
      "not found in standings",
    ];
    for (let i = 0; i < str.length; i++) {
      if (err.message.includes(str[i])) {
        return 0;
      }
    }
    throw new Error(err.message);
  }
}

async function getSicxDebtInUSDValue(wallet, height) {
  return getDataFromStandings(wallet, "sICX", "total_debt_in_USD", height);
}

async function getAVAXCollateralInUSDValue(wallet, height) {
  return getDataFromStandings(wallet, "AVAX", "collateral_in_USD", height);
}

async function getSICXCollateralInUSDValue(wallet, height) {
  return getDataFromStandings(wallet, "sICX", "collateral_in_USD", height);
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
    const response = await makeJsonRpcCall(requestObj, config.jvm.default.rpc);
    if (response != null) {
      return response;
    } else {
      throw new Error("null response from saving rates contract");
    }
  } catch (err) {
    console.log("Error making getLockedAmount request");
    console.log(err.message);
    throw new Error(err.message);
  }
}

async function getLockedAmountAsDecimal(user, height) {
  try {
    const response = await getLockedAmount(user, height);
    // console.log("response");
    // console.log(response);
    return parseInt(response, 16) / 10 ** 18;
  } catch (err) {
    console.log("Error getting locked amount in USD value");
    console.log(err.message);
    const str = "null response from saving rates contract";
    if (err.message.includes(str)) {
      return 0;
    } else {
      throw new Error(err.message);
    }
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
  getAVAXCollateralInUSDValue,
  getAccountPositions,
  getLockedAmount,
  getLockedAmountAsDecimal,
  getNetworkInfo,
  getPRepTerm,
  getSICXCollateralInUSDValue,
  getSicxDebtInUSDValue,
  getTotalDebtInUSDValue,
  getUserRegistrationBlock,
  getUsersList,
};
