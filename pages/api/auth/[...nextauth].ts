import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY as string,
      clientSecret: process.env.TWITTER_API_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
