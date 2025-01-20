import * as fs from 'fs';
import * as path from 'path';
import rqst from 'rqst';
import { parseUrl } from './lib';
import { ConfigHelperService } from '../config/config-helper.service';
import { JsonRpcRequest } from '../shared/types/GeneralTypes';
import { Seasons } from '../collections/seasons/seasons.interface';
import { Logger } from '@nestjs/common';
const logger = new Logger('utils');
const configHelperService = new ConfigHelperService();

/**
 * Search to see if a tag exists in any of the log files.
 * @param tag The tag to search for.
 */
export function isTagInLogs(tag: string, folderPath: string = ''): boolean {
  // Directory where log files are stored
  const directory = path.join(
    __dirname,
    folderPath === '' ? 'logs' : folderPath,
  );

  try {
    const logFiles = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith('.log')); // Adjust extension if necessary

    for (const file of logFiles) {
      const filePath = path.join(directory, file);
      const data = fs.readFileSync(filePath, 'utf-8');

      const matchingLines = data
        .split('\n')
        .filter((line) => line.includes(`${tag}`)); // Checks if the tag exists in the line

      if (matchingLines.length > 0) {
        return true;
      }
    }
  } catch (error) {
    void error;
    return false;
  }
  return false;
}

/**
 * This function is used to get the full path of a file or folder in the project.
 * It is used to avoid using relative paths in the project.
 * It works by finding the main folder of the project and then calculating the path from there.
 * @param relativePath The path of the file or folder relative to the main folder of the project.
 * @returns The full path of the file or folder.
 */
export function customPath(relativePath: string): string {
  try {
    const fullPath = path.dirname(require.main.filename);
    const fullPathArray = fullPath.split('/');
    fullPathArray[0] = '/';
    let MAIN_FOLDER = null;

    let maxLoops = 100;
    while (MAIN_FOLDER === null && maxLoops > 0) {
      maxLoops--;
      const folderPath = path.join(...fullPathArray);
      const packageJsonPath = path.join(folderPath, 'package.json');
      try {
        fs.accessSync(packageJsonPath, fs.constants.F_OK);
        const folderSplit = folderPath.split('/');
        MAIN_FOLDER = folderSplit[folderSplit.length - 1];
      } catch (err) {
        void err;
        fullPathArray.pop();
      }
    }
    const parsedPath = path.parse(__filename);
    const fullPathSplit = parsedPath.dir.split('/');

    while (fullPathSplit.length > 0) {
      if (fullPathSplit[fullPathSplit.length - 1] === MAIN_FOLDER) {
        break;
      } else {
        fullPathSplit.pop();
      }
    }
    fullPathSplit.push(relativePath);

    return fullPathSplit.join('/');
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error getting custom path. Error: ${err.message}`,
      error: err,
    });
    throw new Error(err);
  }
}

export function makeIcxGetBalanceRequestObject(wallet: string, height = null) {
  const obj = makeJsonRpcRequestTemplate('icx_getBalance');
  obj.params = { address: wallet };

  if (height !== null) {
    if (typeof height !== 'number') {
      throw new Error('Height must be a number');
    } else {
      obj.params.height = '0x' + height.toString(16);
    }
  }
  return JSON.stringify(obj);
}

export function makeJsonRpcRequestTemplate(method: string): JsonRpcRequest {
  return {
    jsonrpc: '2.0',
    method: method,
    id: Math.ceil(Math.random() * 1000),
  };
}

export function makeIcxCallRequestObject(
  method: string,
  params = null,
  to = 'cx0000000000000000000000000000000000000000',
  height = null,
) {
  try {
    const obj = makeJsonRpcRequestTemplate('icx_call');

    obj.params = {
      to: to,
      dataType: 'call',
      data: {
        method,
      },
    };
    if (params !== null) {
      obj.params.data.params = params;
    }

    if (height !== null) {
      if (typeof height !== 'number') {
        throw new Error('Height must be a number');
      } else {
        obj.params.height = '0x' + height.toString(16);
      }
    }

    return JSON.stringify(obj);
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error creating icx_call request object. Error: ${err.message}`,
      error: err,
    });
  }
}

export async function makeJsonRpcCall(data: string, url: string) {
  let query = null;
  try {
    const parsedUrl = parseUrl(url);
    query = await rqst(
      parsedUrl.path,
      data,
      parsedUrl.hostname,
      parsedUrl.protocol == 'http' ? false : true,
      parsedUrl.port === '' ? false : parsedUrl.port,
    );

    if (query.error == null) {
      return query.result;
    } else {
      throw new Error(JSON.stringify(query.error));
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error running node request. query: ${JSON.stringify(query)}`,
      error: err,
    });
    throw new Error(err);
  }
}

/*
 * This function tries to first fetch a block height from
 * the main seed file, if that fails it then searches
 * from the lowest blockStart in all the seasons in the
 * database and returns that blockStart
 */
export async function getInitBlock(allSeasons: Seasons[]) {
  // This function will try to first fetch the last block from the seed file and if that fails, it will try to fetch it from the database by
  // looking for the active season and returning the blockStart of that season
  // If both fail, it will return null
  try {
    // first try to fetch from seed file
    const mainSeed = configHelperService.getMain();

    if (mainSeed != null && mainSeed.lastBlock != null) {
      return mainSeed.lastBlock;
    } else {
      throw new Error('Seed file is empty');
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error fetching last block from seed file',
      error: err,
    });
  }

  try {
    const activeSeason = allSeasons
      .filter((season) => season.active === true)
      .reduce((lowest, current) => {
        return lowest.blockStart < current.blockStart ? lowest : current;
      });

    if (activeSeason != null) {
      // if active season is found, return the blockStart
      return activeSeason.blockStart;
    } else {
      throw new Error('No active season found in database');
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error fetching last block from database',
      error: err,
    });
  }
}
