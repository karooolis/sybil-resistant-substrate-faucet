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
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account }) {
  //     console.log(token, account)

  //     if (account) {
  //       token.provider = account.provider;
  //       token.providerAccountId = account.providerAccountId;
  //     }

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.provider = token.provider;
  //     session.providerAccountId = token.providerAccountId;

  //     return session;
  //   },
  // },
};

export default NextAuth(authOptions);
