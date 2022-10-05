import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { hasClaimed } from "./utils/hasClaimed";

type Data = {
  error?: string;
  message?: string;
  claimed?: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Collect session
  const session = await unstable_getServerSession(req, res, authOptions);

  // Collect address
  const { address }: { address?: string } = req.body;

   // Return unauthenticated status if no session
  if (!session) {
    return res.status(401).send({ error: "Not authenticated." });
  }

  try {
    // Collect claim status
    const claimed: boolean = await hasClaimed(session, address);
    return res.status(200).send({ claimed });
  } catch {
    // If failure, return error checking status
    return res.status(500).send({ error: "Error checking claim status." });
  }
};

export default handler;
