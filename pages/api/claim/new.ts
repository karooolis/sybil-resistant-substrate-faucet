import type { NextApiRequest, NextApiResponse } from "next";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { unstable_getServerSession } from "next-auth/next";
import Redis from "ioredis";
import { BigFloat } from "bigfloat.js";
import { getKey, hasClaimed } from "./status";
import { isValidAddress } from "../../../utils/isValidAddress";
import { authOptions } from "../auth/[...nextauth]";

// Setup redis client
const client = new Redis(process.env.REDIS_ENDPOINT as string);

type Data = {
  message?: string;
  error?: string;
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

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  return api;
};

const initKeyring = () => {
  const keyring = new Keyring({ type: "sr25519" });
  const account = keyring.addFromMnemonic(
    process.env.FAUCET_MNEMONIC as string
  );

  return account;
};

const calculateAmount = (): bigint => {
  const decimals = new BigFloat(process.env.NETWORK_DECIMALS as string);
  const amount = new BigFloat(process.env.DRIP_CAP as string);

  return BigInt(
    amount.mul(new BigFloat(10).pow(new BigFloat(decimals))).toString()
  );
};

const processDrip = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Collect session
  const session = await unstable_getServerSession(req, res, authOptions);

  // Collect address
  const { address }: { address: string } = req.body;

  if (!session) {
    // Return unauthenticated status
    return res.status(401).send({ error: "Not authenticated." });
  }

  if (!address || !isValidAddress(address)) {
    // Return invalid wallet address status
    return res.status(400).send({ error: "Invalid wallet address." });
  }

  const claimed: boolean = await hasClaimed(session);
  if (claimed) {
    // Return already claimed status
    return res.status(400).send({ error: "Already claimed in 24h window." });
  }

  try {
    // Process faucet drip
    await processDrip(address);
  } catch (error: unknown) {
    console.log(error);

    // If error in process, revert
    return res
      .status(500)
      .send({ error: "Error fully claiming, try again in 15 minutes." });
  }

  const key = getKey(session) as string;
  await client.set(key, "true", "EX", 60);

  res.status(200).json({ message: "Drip processed successfully." });
};

export default handler;
