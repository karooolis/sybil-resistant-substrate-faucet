import { Session } from "next-auth";

export const userFixture: Session = {
  user: {
    name: "Name Surname",
    email: "email@example.com"
  },
  expires: "2099-01-01T09:44:16.775Z",
  provider: "github",
  providerAccountId: "3259164",
};