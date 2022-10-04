import { BigFloat } from "bigfloat.js";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

const initApi = async () => {
  const ws = new WsProvider(process.env.NETWORK_PROVIDER_ENDPOINT);

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
  const account = keyring.addFromMnemonic(process.env.FAUCET_SECRET as string);

  console.log('account');

  return account;
};

const calculateAmount = (): bigint => {
  const decimals = new BigFloat(process.env.NETWORK_DECIMALS as string);
  const amount = new BigFloat(process.env.DRIP_CAP as string);
  return BigInt(
    amount.mul(new BigFloat(10).pow(new BigFloat(decimals))).toString()
  );
};

export const processDrip = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};