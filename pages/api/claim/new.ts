import type { NextApiRequest, NextApiResponse } from "next";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { BigFloat } from "bigfloat.js";
// TODO: might not need bn.js after all
import { BN } from "bn.js";

type Data = {
  message: string;
};

const initApi = async () => {
  const ws = new WsProvider(process.env.PROVIDER_ENDPOINT);

  // Instantiate the API
  const api = await ApiPromise.create({ provider: ws });

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  // Log these stats
  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  return api;
};

const initKeyring = () => {
  // TODO: add error handling & logging
  // try {
  const keyring = new Keyring({ type: "sr25519" });
  const account = keyring.addFromMnemonic(
    process.env.FAUCET_MNEMONIC as string
  );
  // } catch (error) {
  // logger.error(error);
  // errorCounter.plusOne('other');
  // }

  return account;
};

const calculateAmount = (): bigint => {
  const decimals = new BigFloat(process.env.NETWORK_DECIMALS as string);
  const amount = new BigFloat(process.env.DRIP_CAP as string);

  return BigInt(
    amount.mul(new BigFloat(10).pow(new BigFloat(decimals))).toString()
  );
};

const sendToken = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // TODO: obtain address from UI. Validate if correct.
  // send token to address
  await sendToken("5CJhPVnG9hsmM736zPqRLnJiE6ngPemgkMVNFLmHZLaD5Lhy");

  res.status(200).json({ message: "Funds sent successfully." });
};

export default handler;
