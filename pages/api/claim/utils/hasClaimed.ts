import { Session } from "next-auth";
import { isValidAddress } from "../../../../utils/isValidAddress";
import getKey from "./getKey";

import Redis from "ioredis";
import RedisMock from "ioredis-mock";
const client =
  process.env.NODE_ENV !== "test" && process.env.REDIS_ENDPOINT
    ? new Redis(process.env.REDIS_ENDPOINT)
    : new RedisMock();

/**
 * Checks if a given user has claimed tokens from the faucet in the last 24h.
 * Or alternatively, whether funds have been claimed to a given address.
 * @param {Session} session to check
 * @param {string} address to check
 * @returns {Promise<boolean>} claim status
 */
export const hasClaimed = async (
  session: Session | null,
  address?: string
): Promise<boolean> => {
  // Check if address has been claimed
  if (address && isValidAddress(address)) {
    const resp = await client.get(address);
    if (resp) {
      return true;
    }
  }

  // Check if key exists
  const key = getKey(session);
  if (!key) {
    return false;
  }

  // Check if key has been claimed
  const resp: string | null = await client.get(key);

  // If exists, return true, else return false
  return resp ? true : false;
};

export default hasClaimed;