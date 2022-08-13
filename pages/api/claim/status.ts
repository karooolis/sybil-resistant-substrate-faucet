import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

// Setup redis client
const client = new Redis(process.env.REDIS_ENDPOINT as string);

type Data = {
  error?: string;
  message?: string;
  claimed?: boolean;
};

export const getKey = (session: Session | null) => {
  if (!session) {
    return null;
  }

  return `${session.provider}-${session.providerAccountId}`;
};

/**
 * Checks if a twitter id has claimed from faucet in last 24h
 * @param {string} twitterId to check
 * @returns {Promise<boolean>} claim status
 */
export const hasClaimed = async (session: Session | null): Promise<boolean> => {
  // Check if key exists
  const key = getKey(session);
  if (!key) {
    return false;
  }

  const resp: string | null = await client.get(key);
  // If exists, return true, else return false
  return resp ? true : false;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const session: Session | null = await getSession({ req });

  if (!session) {
    // Return unauthenticated status
    res.status(401).send({ error: "Not authenticated." });
  }

  try {
    // Collect claim status
    const claimed: boolean = await hasClaimed(session);
    res.status(200).send({ claimed });
  } catch {
    // If failure, return error checking status
    res.status(500).send({ error: "Error checking claim status." });
  }
};

export default handler;
