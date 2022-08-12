import React from "react";

type Props = {
  value: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const WalletInput = ({ value, onChange }: Props) => {
  return (
    <div>
      {/* <label
        htmlFor="wallet-address"
        className="block text-sm font-medium text-gray-700"
      >
        Wallet address
      </label> */}

      <input
        type="text"
        name="wallet-address"
        id="wallet-address"
        className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        placeholder="5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u"
        value={value}
        onChange={onChange}
      />

      {/* <p className="mt-2 text-sm text-red-600" id="email-error">
        Your password must be less than 4 characters.
      </p> */}
    </div>
  );
};

export default WalletInput;
