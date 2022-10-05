import { initApi } from "./initApi";
import { initKeyring } from "./initKeyring";
import { calculateAmount } from "./calculateAmount";

export const processDrip = async (address: string) => {
  const api = await initApi();
  const account = initKeyring();
  const amount = calculateAmount();

  const transfer = api.tx.balances.transfer(address, amount);
  const hash = await transfer.signAndSend(account);

  console.log("Transfer sent with hash", hash.toHex());
};

export default processDrip;
