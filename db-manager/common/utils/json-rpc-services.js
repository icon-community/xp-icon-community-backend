const {
  makeJsonRpcRequestObject,
  makeJsonRpcCall,
  isXChainWallet,
} = require("./utils");
const config = require("./config");

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

/*
 * getAccountPositions
 * @param {string} _owner - the wallet address of the account
 * @param {number} height - the block height to query
 * @param {string} contract - the contract address to query
 * @returns {object} - the response object from the json-rpc call
 * 
 * Example of type of _owner
 * - can be a ICON wallet: "hx123...789"
 * - can be a cross chain address: "0x38.bsc/0x123...456"
/* Example response from getAccountPositions RPC call
{
  "jsonrpc": "2.0",
  "result": {
    "address": _owner,
    "assets": {
      "bnUSD": "0x741f27c8111b3233f7",
      "sICX": "0x4e0f1a12d30f98da1b1"
    },
    "collateral": "0x64be2fb60cb567e681b",
    "created": "0x61f748a1e373d",
    "holdings": {
      "token": {
        "bnUSD": "0x741f27c8111b3233f7",
        "sICX": "0x4e0f1a12d30f98da1b1"
      },
      ...
    },
    "pos_id": "0xabc",
    "ratio": "0x1be8cf38f58f40d3",
    "standing": "Mining",
    "standings": {
      "token": {
        // value of collateral in ICX
        "collateral": "0x64be2fb60cb567e681b",
        // value of collateral in USD
        "collateral_in_USD": "0xe987d6aec99de475f8",
        "ratio": "0x1be8cf38f58f40d3",
        "standing": "Mining",
        // value of debt in ICX
        "total_debt": "0x321803fd5ad511b9fab",
        // value of debt in USD
        "total_debt_in_USD": "0x741f27c8111b3233f7"
      },
      ...
    },
    "total_debt": "0x321803fd5ad511b9fab"
  },
  "id": 604
}
*/
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

async function getSumOfEntryFromStandings(wallet, entry, height) {
  try {
    if (wallet == null) {
      throw new Error("null wallet");
    }
    const position = await getAccountPositions(wallet, height);

    const tokens = Object.keys(position.standings);
    let sum = 0;
    for (let i = 0; i < tokens.length; i++) {
      sum += parseInt(position.standings[tokens[i]][entry], 16) / 10 ** 18;
    }

    return sum;
  } catch (err) {
    console.log(`Error getting sum of ${entry} for wallet ${wallet}`);
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
    return await getSumOfEntryFromStandings(
      wallet,
      "total_debt_in_USD",
      height,
    );
  } catch (err) {
    console.log(`Error getting total debt value in USD for wallet ${wallet}`);
    console.log(err.message);
    throw new Error(err.message);
  }
}

async function getTotalCollateralInUSDValue(wallet, height) {
  try {
    return await getSumOfEntryFromStandings(
      wallet,
      "collateral_in_USD",
      height,
    );
  } catch (err) {
    console.log(`Error getting total debt value in USD for wallet ${wallet}`);
    console.log(err.message);
    throw new Error(err.message);
  }
}

async function getXChainDebtInUSDValue(wallet, height) {
  try {
    if (!isXChainWallet(wallet)) {
      throw new Error("wallet is not an XChain wallet");
    }
    return await getTotalDebtInUSDValue(wallet, height);
  } catch (err) {
    console.log(`Error getting XChain debt value in USD for wallet ${wallet}`);
    throw new Error(err.message);
  }
}

async function getXChainCollateralInUSDValue(wallet, height) {
  try {
    if (!isXChainWallet(wallet)) {
      throw new Error("wallet is not an XChain wallet");
    }
    return await getTotalCollateralInUSDValue(wallet, height);
  } catch (err) {
    console.log(
      `Error getting XChain collateral value in USD for wallet ${wallet}`,
    );
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

async function getLockedAmountAsDecimal(wallet, height) {
  try {
    const response = await getLockedAmount(wallet, height);
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

async function getIcxBalance(wallet, height = null) {
  try {
    const requestObj = makeJsonRpcRequestObject(
      null,
      null,
      null,
      height,
      "icx_getBalance",
      { address: wallet },
    );
    const response = makeJsonRpcCall(requestObj, config.jvm.default.rpc);

    return response;
  } catch (e) {
    console.log("Error making icx_getBalance request");
    console.error(e);
  }
}

module.exports = {
  getAVAXCollateralInUSDValue,
  getAccountPositions,
  getIcxBalance,
  getLockedAmount,
  getLockedAmountAsDecimal,
  getNetworkInfo,
  getPRepTerm,
  getSICXCollateralInUSDValue,
  getSicxDebtInUSDValue,
  getTotalCollateralInUSDValue,
  getTotalDebtInUSDValue,
  getUserRegistrationBlock,
  getUsersList,
  getXChainCollateralInUSDValue,
  getXChainDebtInUSDValue,
};
