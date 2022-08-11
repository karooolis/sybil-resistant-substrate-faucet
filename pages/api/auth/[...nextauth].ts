import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
  ],
  // callbacks: {
  //   // On signin + signout
  //   async jwt(token, user, account, profile) {
  //     // Check if user is signing in (versus logging out)
  //     const isSignIn = user ? true : false;

  //     // If signing in
  //     if (isSignIn) {
  //       // Attach additional parameters (twitter id + handle + anti-bot measures)
  //       token.twitter_id = account?.id;
  //       token.twitter_handle = profile?.screen_name;
  //       token.twitter_num_tweets = profile?.statuses_count;
  //       token.twitter_num_followers = profile?.followers_count;
  //       token.twitter_created_at = profile?.created_at;
  //     }

  //     // Resolve JWT
  //     return token;
  //   },
  //   // On session retrieval
  //   async session(session, user) {
  //     // Attach additional params from JWT to session
  //     session.twitter_id = user.twitter_id;
  //     session.twitter_handle = user.twitter_handle;
  //     session.twitter_num_tweets = user.twitter_num_tweets;
  //     session.twitter_num_followers = user.twitter_num_followers;
  //     session.twitter_created_at = user.twitter_created_at;

  //     // Resolve session
  //     return session;
  //   },
  // },

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token
      // }

      // {
      //   provider: 'github',
      //   type: 'oauth',
      //   providerAccountId: '3159964',
      //   access_token: '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',
      //   token_type: 'bearer',
      //   scope: 'read:user,user:email'
      // }

      console.log("JWT", token, account);

      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log("SESSION", user);

      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken

      session.provider = token.provider;
      session.providerAccountId = token.providerAccountId;

      return session;
    },
  },
});
