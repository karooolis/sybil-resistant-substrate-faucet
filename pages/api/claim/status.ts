import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import RedisMock from "ioredis-mock";
import { Session } from "next-auth";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Setup redis client
const client =
  process.env.NODE_ENV !== "test" && process.env.REDIS_ENDPOINT
    ? new Redis(process.env.REDIS_ENDPOINT)
    : new RedisMock();

type Data = {
  error?: string;
  message?: string;
  claimed?: boolean;
};

export const getKey = (session: Session | null) => {
  if (!session || !session.user) {
    return null;
  }

  return session.user.email;
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
  // Collect session
  const session = await unstable_getServerSession(req, res, authOptions);

  // Collect address
  // const { address }: { address: string } = req.body;

  if (!session) {
    // Return unauthenticated status
    return res.status(401).send({ error: "Not authenticated." });
  }

  try {
    // Collect claim status
    const claimed: boolean = await hasClaimed(session);
    return res.status(200).send({ claimed });
  } catch {
    // If failure, return error checking status
    return res.status(500).send({ error: "Error checking claim status." });
  }
};

export default handler;
