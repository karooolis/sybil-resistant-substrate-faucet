import { ApiPromise, WsProvider } from "@polkadot/api";

export const initApi = async () => {
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

export default initApi;
