import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis"; // Redis
import { getSession } from "next-auth/react"; // Session management

// Setup redis client
const client = new Redis(process.env.REDIS_ENDPOINT as string);

type Data = {
  message: string;
};

/**
 * Checks if a twitter id has claimed from faucet in last 24h
 * @param {string} twitterId to check
 * @returns {Promise<boolean>} claim status
 */
const hasClaimed = async (twitterId: string): Promise<boolean> => {
  // Check if key exists
  const resp: string | null = await client.get(twitterId);
  // If exists, return true, else return false
  return resp ? true : false;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const claimed = await hasClaimed('TWITTER_ID');


  const session: any = await getSession({ req });

  console.log('session', session)

  // console.log('req', req)

  // await client.set('TWITTER_ID', true)

  console.log(claimed)
  
  res.status(200).json({ message: "Success" });
};

export default handler;
