import { Session } from "next-auth";

export const mockGithubSession: Session = {
  expires: "1",
  provider: "github",
  providerAccountId: "GITHUB_PROVIDER_ACCOUNT_ID",
  user: {
    email: "user@mail.com",
    name: "USER_NAME",
  },
};

export const mockTwitterSession: Session = {
  expires: "1",
  provider: "twitter",
  providerAccountId: "TWITTER_PROVIDER_ACCOUNT_ID",
  user: {
    name: "USER_NAME",
  },
};
