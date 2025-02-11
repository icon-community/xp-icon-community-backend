import { DEFAULT_MAX_RETRY, DEFAULT_RETRY_DELAY_MS, SLOPE_POINT_VARIABLES } from "../../constants";

/*
 * This function calculates the time given the block number
 * using the slope point formula.
 * The formula is  y - y1 = m(x - x1)
 * where:
 * x1 = known block height
 * y1 = known time
 * x = block height input
 * y = unknown time to be calculated
 * m = slope (previously calculated and tested)
 * @param block - block number
 * @returns {number} time in seconds
 */
export function findTimeGivenBlock(block: number): number | null {
  try {
    return Math.floor(SLOPE_POINT_VARIABLES.slope * (block - SLOPE_POINT_VARIABLES.x1) + SLOPE_POINT_VARIABLES.y1);
  } catch (err) {
    console.error(err);
    return null;
  }
}

/*
 * This function calculates the block number given the time
 * using the slope point formula.
 * The formula is  y - y1 = m(x - x1)
 * where:
 * x1 = known block height
 * y1 = known time
 * x = block height input
 * y = unknown time to be calculated
 * m = slope (previously calculated and tested)
 * @param time - time in unix timestamp (seconds)
 * @returns {number} block number
 */
export function findblockGivenTime(time: number): number | null {
  try {
    return Math.floor((time - SLOPE_POINT_VARIABLES.y1) / SLOPE_POINT_VARIABLES.slope + SLOPE_POINT_VARIABLES.x1);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function isValidHex(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return hexRegex.test(str);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export async function retry<T>(
  action: (retryCount: number) => Promise<T>,
  retryCount: number = DEFAULT_MAX_RETRY,
  delayMs = DEFAULT_RETRY_DELAY_MS,
): Promise<T> {
  do {
    try {
      return await action(retryCount);
    } catch (e) {
      retryCount--;

      if (retryCount <= 0) {
        console.error(`Failed to perform operation even after ${DEFAULT_MAX_RETRY} attempts.. Throwing origin error..`);
        throw e;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  } while (retryCount > 0);

  throw new Error(`Retry exceeded MAX_RETRY_DEFAULT=${DEFAULT_MAX_RETRY}`);
}
