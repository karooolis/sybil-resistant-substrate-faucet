import { Session } from "next-auth";

export const userFixture: Session = {
  user: {
    name: "Karolis Ramanauskas",
    email: "hello@karolisram.com",
    image: "https://avatars.githubusercontent.com/u/3159964?v=4",
  },
  expires: "2099-01-01T09:44:16.775Z",
  provider: "github",
  providerAccountId: "3159964",
};