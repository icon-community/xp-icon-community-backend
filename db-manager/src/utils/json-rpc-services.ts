import {
  makeJsonRpcCall,
  makeIcxGetBalanceRequestObject,
  makeJsonRpcRequestTemplate,
  makeIcxCallRequestObject,
} from './utils';
import { isXChainWallet } from './lib';
import { ICON_CHAIN_INFO } from '../constants';
import { Logger } from '@nestjs/common';
import {
  LastBlockDto,
  GetNetworkInfoDto,
  GetPRepTermDto,
  GetAccountPositionsDto,
} from '../shared/dto/json-rpc-services.dto';
import {
  StandingTokensDataEnum,
  TokensEnum,
} from '../shared/enum/general-enum';
import { validate } from 'class-validator';

const logger = new Logger('json-rpc-services');

export async function getNetworkInfo(
  height = null,
): Promise<GetNetworkInfoDto | null> {
  try {
    const requestObj = makeIcxCallRequestObject(
      'getNetworkInfo',
      null,
      ICON_CHAIN_INFO.mainnet.contracts.chain,
      height,
    );
    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    const result = Object.assign(new GetNetworkInfoDto(), response);
    const errors = await validate(result);

    if (errors.length > 0) {
      throw new Error(`Invalid Api response. ${JSON.stringify(errors)}`);
    }

    return result;
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error making getNetworkInfo request. ${err.message}`,
      error: err,
    });
  }
}

export async function getPRepTerm(
  height = null,
): Promise<GetPRepTermDto | null> {
  try {
    const requestObj = makeIcxCallRequestObject(
      'getPRepTerm',
      null,
      ICON_CHAIN_INFO.mainnet.contracts.chain,
      height,
    );
    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    const result = Object.assign(new GetPRepTermDto(), response);

    const errors = await validate(result);

    if (errors.length > 0) {
      throw new Error(`Invalid Api response. ${JSON.stringify(errors)}`);
    }

    return result;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error making getPRepTerm request',
      error: err,
    });
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
export async function getAccountPositions(
  _owner: string,
  height: number | null = null,
  contract = ICON_CHAIN_INFO.mainnet.contracts.balanced.loans,
): Promise<GetAccountPositionsDto | null> {
  try {
    const requestObj = makeIcxCallRequestObject(
      'getAccountPositions',
      {
        _owner: _owner,
      },
      contract,
      height,
    );
    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    const result = Object.assign(new GetAccountPositionsDto(), response);

    const errors = await validate(result);

    if (errors.length > 0) {
      throw new Error(`Invalid Api response. ${JSON.stringify(errors)}`);
    }

    return result;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error making getAccountPositions request',
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getDataFromStandings(
  wallet: string,
  token: string,
  data: StandingTokensDataEnum,
  height: number | null,
): Promise<number | null> {
  try {
    const position = await getAccountPositions(wallet, height);

    if (position.standings[token] == null) {
      throw new Error(
        `token ${token} not found in standings at height ${height}`,
      );
    }
    return parseInt(position.standings[token][data], 16) / 10 ** 18;
  } catch (err) {
    const str = [
      'does not have a position in Balanced',
      'not found in standings',
    ];
    for (let i = 0; i < str.length; i++) {
      if (err.message.includes(str[i])) {
        return 0;
      }
    }
    logger.log({
      level: 'error',
      message: `Error getting ${data} value for ${token}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getSumOfEntryFromStandings(
  wallet: string,
  entry: string,
  height: number | null,
): Promise<number | null> {
  try {
    if (wallet == null) {
      throw new Error('null wallet');
    }
    const position = await getAccountPositions(wallet, height);

    const tokens = Object.keys(position.standings);
    let sum = 0;
    for (let i = 0; i < tokens.length; i++) {
      sum += parseInt(position.standings[tokens[i]][entry], 16) / 10 ** 18;
    }

    return sum;
  } catch (err) {
    const str = [
      'does not have a position in Balanced',
      'not found in standings',
    ];
    for (let i = 0; i < str.length; i++) {
      if (err.message.includes(str[i])) {
        return 0;
      }
    }
    logger.log({
      level: 'error',
      message: `Error getting sum of ${entry} for wallet ${wallet}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getTotalDebtInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  try {
    return await getSumOfEntryFromStandings(
      wallet,
      StandingTokensDataEnum.total_debt_in_USD,
      height,
    );
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error getting total debt value in USD for wallet ${wallet}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getTotalCollateralInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  try {
    return await getSumOfEntryFromStandings(
      wallet,
      StandingTokensDataEnum.collateral_in_USD,
      height,
    );
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error getting total debt value in USD for wallet ${wallet}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getXChainDebtInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  try {
    if (!isXChainWallet(wallet)) {
      throw new Error('wallet is not an XChain wallet');
    }
    return await getTotalDebtInUSDValue(wallet, height);
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error getting XChain debt value in USD for wallet ${wallet}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getXChainCollateralInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  try {
    if (!isXChainWallet(wallet)) {
      throw new Error('wallet is not an XChain wallet');
    }
    return await getTotalCollateralInUSDValue(wallet, height);
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error getting XChain collateral value in USD for wallet ${wallet}`,
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getSicxDebtInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  return await getDataFromStandings(
    wallet,
    TokensEnum.sICX,
    StandingTokensDataEnum.total_debt_in_USD,
    height,
  );
}

export async function getAVAXCollateralInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  return await getDataFromStandings(
    wallet,
    TokensEnum.AVAX,
    StandingTokensDataEnum.collateral_in_USD,
    height,
  );
}

export async function getSICXCollateralInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  return await getDataFromStandings(
    wallet,
    TokensEnum.sICX,
    StandingTokensDataEnum.collateral_in_USD,
    height,
  );
}

export async function getSuiXChainDebtInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  return await getDataFromStandings(
    wallet,
    TokensEnum.SUI,
    StandingTokensDataEnum.total_debt_in_USD,
    height,
  );
}

export async function getSuiXChainCollateralInUSDValue(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  return await getDataFromStandings(
    wallet,
    TokensEnum.SUI,
    StandingTokensDataEnum.collateral_in_USD,
    height,
  );
}

export async function getLockedAmount(
  user: string,
  height: number | null = null,
  contract = ICON_CHAIN_INFO.mainnet.contracts.balanced.savings,
): Promise<string | null> {
  const typeOfValidErrors = ['null response from saving rates contract'];
  try {
    const requestObj = makeIcxCallRequestObject(
      'getLockedAmount',
      {
        user: user,
      },
      contract,
      height,
    );
    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );
    if (response != null) {
      return response;
    } else {
      throw new Error(typeOfValidErrors[0]);
    }
  } catch (err) {
    for (let i = 0; i < typeOfValidErrors.length; i++) {
      if (err.message.includes(typeOfValidErrors[i])) {
        return '0x0';
      }
    }
    logger.log({
      level: 'error',
      message: 'Error making getLockedAmount request',
      error: err,
    });
    throw new Error(err.message);
  }
}

export async function getLockedAmountAsDecimal(
  wallet: string,
  height: number | null,
): Promise<number | null> {
  const typeOfValidErrors = [
    'Error parsing locked amount to number',
    'null response from saving rates contract',
  ];
  try {
    const response = await getLockedAmount(wallet, height);
    const parsedAsNumber = parseInt(response, 16) / 10 ** 18;
    if (Number.isNaN(parsedAsNumber)) {
      throw new Error(typeOfValidErrors[0]);
    }

    return parsedAsNumber;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error getting locked amount in USD value',
      error: err,
    });
    for (let i = 0; i < typeOfValidErrors.length; i++) {
      if (err.message.includes(typeOfValidErrors[i])) {
        return 0;
      }
    }
    throw new Error(err.message);
  }
}

export async function getIcxBalance(
  wallet: string,
  height: number | null = null,
) {
  try {
    const requestObj = makeIcxGetBalanceRequestObject(wallet, height);

    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    return response;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error making icx_getBalance request',
      error: err,
    });
  }
}

export async function getLastBlock(): Promise<LastBlockDto | null> {
  try {
    const requestObj = JSON.stringify(
      makeJsonRpcRequestTemplate('icx_getLastBlock'),
    );
    const response = await makeJsonRpcCall(
      requestObj,
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    return response;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error making icx_getLastBlock request',
      error: err,
    });
  }
}

export async function getBlockByHeight(
  height: number | string,
): Promise<LastBlockDto | null> {
  try {
    const requestObj = makeJsonRpcRequestTemplate('icx_getBlockByHeight');
    requestObj.params = { height: height };

    const response = await makeJsonRpcCall(
      JSON.stringify(requestObj),
      ICON_CHAIN_INFO.mainnet.rpc,
    );

    return response;
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error making icx_getBlockByHeight request',
      error: err,
    });
  }
}
