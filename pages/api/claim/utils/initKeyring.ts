import { Keyring } from "@polkadot/api";

export const initKeyring = () => {
  const keyring = new Keyring({ type: "sr25519" });
  const account = keyring.addFromMnemonic(process.env.FAUCET_SECRET as string);
  return account;
};

export default initKeyring;
