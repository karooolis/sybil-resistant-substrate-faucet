import { Session } from "next-auth";

/**
 * Gets the key for a given session.
 * @param {Session|null} session Session to check
 * @returns {string|null} user's key
 */
export const getKey = (session: Session | null) => {
  if (!session || !session.user) {
    return null;
  }
  return session.user.email;
};

export default getKey;
