import type { NextApiRequest, NextApiResponse } from "next";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { BigFloat } from "bigfloat.js";
import { hasClaimed } from "./status";

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

const processDrip = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Collect session (force any for extra twitter params)
  // const session: any = await getSession({ req });

  // Collect address
  const { address }: { address: string } = req.body;

  // TODO: check if user authenticated
  // if (!session) {
  //   // Return unauthenticated status
  //   return res.status(401).send({ error: "Not authenticated." });
  // }

  // TODO: check if valid wallet address
  // if (!address || !isValidAddress(address)) {
  //   // Return invalid wallet address status
  //   return res.status(400).send({ error: "Invalid wallet address." });
  // }

  // TODO: check if already claimed
  const claimed: boolean = await hasClaimed("SESSION_USER_ID");
  if (claimed) {
    // Return already claimed status
    return res.status(400).send({ error: "Already claimed in 24h window" });
  }

  // TODO: add error handling & logging
  try {
    // Process faucet drip
    await processDrip(address);
  } catch (error: unknown) {
    console.log(error);

    // // If not whitelisted, force user to wait 15 minutes
    // if (!whitelist.includes(session.twitter_id)) {
    //   // Update 24h claim status
    //   await client.set(session.twitter_id, "true", "EX", 900);
    // }

    // If error in process, revert
    return res
      .status(500)
      .send({ error: "Error fully claiming, try again in 15 minutes." });
  }

  // TODO: update user claimed status
  // If not whitelisted
  // if (!whitelist.includes(session.twitter_id)) {
  //   // Update 24h claim status
  //   await client.set(session.twitter_id, "true", "EX", 86400);
  // }

  res.status(200).json({ message: "Drip processed successfully." });
};

export default handler;
