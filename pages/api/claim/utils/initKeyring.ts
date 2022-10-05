import { Keyring } from "@polkadot/api";

/**
 * Initialize the keyring
 * @returns {Keyring} keyring
 */
export const initKeyring = () => {
  const keyring = new Keyring({ type: "sr25519" });
  const account = keyring.addFromMnemonic(process.env.FAUCET_SECRET as string);
  return account;
};

export default initKeyring;
