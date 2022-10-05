import { BigFloat } from "bigfloat.js";

export const calculateAmount = (): bigint => {
  const decimals = new BigFloat(process.env.NETWORK_DECIMALS as string);
  const amount = new BigFloat(process.env.DRIP_CAP as string);
  return BigInt(
    amount.mul(new BigFloat(10).pow(new BigFloat(decimals))).toString()
  );
};

export default calculateAmount;
