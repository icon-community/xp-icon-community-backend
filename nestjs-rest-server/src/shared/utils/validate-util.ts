import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { ClassConstructor } from "class-transformer/types/interfaces";
import { StrKey } from "@stellar/stellar-base";
import { isEthereumAddress } from "class-validator";

export function validateUtil<Type extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<Type>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

/**
 * Check if input value is a EOA address.
 * @param {any} address - the input value.
 * @return {boolean} returns true if the input value is a EOA address.
 */
export function isEoaAddress(address: string): boolean {
  return /^(hx)[0-9a-f]{40}$/g.test(address) && /\S/g.test(address);
}

/**
 * Check if input value is a SCORE address.
 * @param {any} address - the input value.
 * @return {boolean} returns true if the input value is a SCORE address.
 */
export function isScoreAddress(address: string): boolean {
  return /^(cx)[0-9a-f]{40}$/g.test(address) && /\S/g.test(address);
}

/**
 * Check if input value is a Stellar address.
 * @param {any} address - the input value.
 * @return {boolean} returns true if the input value is a Stellar address.
 */
export function isStellarAddress(address: string): boolean {
  return StrKey.isValidEd25519PublicKey(address);
}

/**
 * Check if input value is a EVM address.
 * @param {any} address - the input value.
 * @return {boolean} returns true if the input value is a EVM address.
 */
export function isEvmAddress(address: string): boolean {
  return isEthereumAddress(address);
}

/**
 * Check if input value is a EOA or SCORE address.
 * @param {any} address - the input value.
 * @return {boolean} returns true if the input value is a EOA or SCORE address.
 */
export function isAddress(address: string): boolean {
  return isEoaAddress(address) || isScoreAddress(address);
}
