import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";
// import { getSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import {
  mockGithubSession,
  mockOtherSession,
  mockTwitterSession,
} from "../fixtures/sessions";
import handler, { getKey, hasClaimed } from "../../pages/api/claim/status";

import * as NextAuth from "next-auth/next";

jest.mock("ioredis", () => {
  const RedisMock = jest.requireActual("ioredis-mock");
  const mockClient = new RedisMock({
    data: {
      "githubuser@mail.com": "true",
      "5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u": "true",
    },
  });

  return jest.fn(() => mockClient);
});

jest.spyOn(NextAuth, "unstable_getServerSession");

describe("API status endpoint (/api/claim/status)", () => {
  describe("getKey()", () => {
    test("valid DB key for auth'ed user via GitHub", () => {
      expect(getKey(mockGithubSession)).toBe(mockGithubSession.user?.email);
    });

    test("valid DB key for auth'ed user via Twitter", () => {
      expect(getKey(mockTwitterSession)).toBe(mockTwitterSession.user?.email);
    });

    test("no key for unauth'ed user", () => {
      expect(getKey(null)).toBe(null);
    });
  });

  describe("hasClaimed()", () => {
    test("false for unauth'ed user", async () => {
      await expect(hasClaimed(null)).resolves.toBe(false);
    });

    test("false for auth'ed user who has not claimed", async () => {
      await expect(hasClaimed(mockTwitterSession)).resolves.toBe(false);
    });

    test("true for auth'ed user who has claimed", async () => {
      await expect(hasClaimed(mockGithubSession)).resolves.toBe(true);
    });

    // TODO: add tests for wallet
  });

  describe("handler", () => {
    test("unauth'ed user returns 401", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    test("auth'ed user and claimed", async () => {
      (unstable_getServerSession as jest.Mock).mockReturnValue(
        mockGithubSession
      );

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: true });
    });

    test("auth'ed user and not claimed", async () => {
      (unstable_getServerSession as jest.Mock).mockReturnValue(
        mockTwitterSession
      );

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: false });
    });

    // test("auth'ed user that throws an error", async () => {
    //   (unstable_getServerSession as jest.Mock).mockReturnValue(mockOtherSession);

    //   const { req, res } = createMocks({
    //     method: "GET",
    //   });

    //   await handler(req, res);
    //   expect(res._getStatusCode()).toBe(500);
    // });
  });
});
