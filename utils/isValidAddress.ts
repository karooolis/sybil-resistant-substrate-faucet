import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";

/**
 * Check if the address is valid
 * @param {string} address Wallet address to check 
 * @returns {boolean} true if valid, false if not
 */
export const isValidAddress = (address: string): boolean => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error: unknown) {
    return false;
  }
};
