import React, { useState } from "react";
import axios from "axios";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Session } from "next-auth";
import { getSession, GetSessionParams, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Login from "../components/login";
import { isValidAddress } from "../utils/isValidAddress";
import { hasClaimed } from "./api/claim/utils/hasClaimed";
import Button from "../components/button";
import WalletInput from "../components/wallet-input";

type Props = {
  claimed: boolean;
};

/**
 * Home page
 * @param {boolean} claimed Whether the user has already claimed funds
 * @returns {JSX.Element}
 */
const Home = ({ claimed: initialClaimed }: Props) => {
  const { status } = useSession();
  const [triedClaim, setTriedClaim] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(initialClaimed);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle tokens claim
  const handleClaim = async () => {
    // Set tried claim
    setTriedClaim(true);

    if (!isValidAddress(address)) {
      return;
    }

    // Toggle loading
    setLoading(true);

    try {
      // Post new claim with recipient address
      const claimPromise = axios.post("/api/claim/new", { address });

      // Toast based on claim state
      await toast.promise(claimPromise, {
        loading: "Claim is pending ...",
        success: "Claimed successfully 👌",
        error: "Claim rejected 🤯",
      });

      setClaimed(true);
    } catch (error: unknown) {
      console.log("Error:", error);
    }

    // Toggle loading
    setLoading(false);
  };

  return (
    <div className="max-w-7xl h-screen mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Faucet</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-3xl mx-auto">
        <h2 className="text-center pt-12 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
          Polkadot Faucet
        </h2>
        <p className="mt-2 max-w-3xl mx-auto text-center text-xl text-gray-500">
          Fast and reliable. 0.025 WND / day.
        </p>

        <div className="mt-12 bg-white shadow border border-gray-300 sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Request Tokens
            </h3>

            {status === "authenticated" && (
              <>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your wallet address to receive testnet tokens.
                </p>

                <form className="mt-5">
                  <WalletInput
                    value={address}
                    triedClaim={triedClaim}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress(evt.target.value)
                    }
                    disabled={claimed || loading}
                  />

                  <Button
                    data-testid="claim-btn"
                    onClick={handleClaim}
                    disabled={
                      loading ||
                      claimed ||
                      (triedClaim && !isValidAddress(address))
                    }
                  >
                    {claimed
                      ? triedClaim
                        ? "Tokens Claimed Successfully"
                        : "Tokens Already Claimed"
                      : !loading
                      ? "Claim"
                      : "Claiming ..."}
                  </Button>

                  <Login />
                </form>
              </>
            )}

            {status !== "authenticated" && (
              <>
                <p className="mt-2 text-gray-900">
                  To prevent faucet abuse, you must sign in with Twitter or
                  GitHub.
                </p>

                <Login />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSideProps) {
  const session: Session | null = await getSession(context as GetSessionParams);
  return {
    props: {
      session,
      claimed: session ? await hasClaimed(session) : false,
    },
  };
}

export default Home;
