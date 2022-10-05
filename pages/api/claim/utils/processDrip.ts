import { initApi } from "./initApi";
import { initKeyring } from "./initKeyring";
import { calculateAmount } from "./calculateAmount";

/**
 * Process the drip, send the funds to the user.
 * @param {string} address Wallet address to send funds to
 */
export const processDrip = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};

export default processDrip;
