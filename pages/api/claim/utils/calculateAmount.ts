import { BigFloat } from "bigfloat.js";

/**
 * Calculates the amount of tokens to be claimed.
 * @returns {bigint} amount to claim
 */
export const calculateAmount = (): bigint => {
  const decimals = new BigFloat(process.env.NETWORK_DECIMALS as string);
  const amount = new BigFloat(process.env.DRIP_CAP as string);
  return BigInt(
    amount.mul(new BigFloat(10).pow(new BigFloat(decimals))).toString()
  );
};

export default calculateAmount;
