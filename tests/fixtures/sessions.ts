import { Session } from "next-auth";

/**
 * During Redis mocking, GitHub user has claimed faucet tokens
 * while Twitter user has not.
 *
 * Claiming as any other user will throw 500 error.
 */
export const mockGithubSession: Session = {
  expires: "1",
  provider: "github",
  providerAccountId: "GITHUB_PROVIDER_ACCOUNT_ID",
  user: {
    email: "githubuser@mail.com",
    name: "USER_NAME",
  },
};

export const mockTwitterSession: Session = {
  expires: "1",
  provider: "twitter",
  providerAccountId: "TWITTER_PROVIDER_ACCOUNT_ID",
  user: {
    email: "twitteruser@mail.com",
    name: "USER_NAME",
  },
};
