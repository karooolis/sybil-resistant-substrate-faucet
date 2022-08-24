import React from "react";
import { isValidAddress } from "../utils/isValidAddress";

type Props = {
  value: string;
  triedClaim: boolean;
  disabled: boolean;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const WalletInput = ({ value, triedClaim, disabled, onChange }: Props) => {
  return (
    <>
      <input
        type="text"
        name="wallet-address"
        id="wallet-address"
        className="w-full shadow focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md disabled:cursor-not-allowed disabled:bg-gray-50 disabled:ring-0 disabled:border-gray-300 disabled:text-gray-500"
        placeholder="5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u"
        value={value}
        onChange={onChange}
        {...(disabled && { disabled })}
      />

      {triedClaim && !isValidAddress(value) && (
        <p className="mt-2 text-sm text-red-500 font-medium" id="email-error">
          Please enter valid wallet address.
        </p>
      )}
    </>
  );
};

export default WalletInput;
