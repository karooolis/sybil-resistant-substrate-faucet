import { string } from "bigfloat.js";
import React from "react";

type Props = {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({ type = "button", children, onClick, disabled, ...rest }: Props) => {
  return (
    <button
      type={type}
      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-400"
      {...(onClick && { onClick })}
      {...(disabled && { disabled })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
