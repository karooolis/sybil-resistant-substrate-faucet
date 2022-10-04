import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";
import * as NextAuth from "next-auth/next";
import { mockGithubSession, mockTwitterSession } from "../fixtures/sessions";
import handler, { getKey, hasClaimed } from "../../pages/api/claim/status";

jest.spyOn(NextAuth, "unstable_getServerSession");
jest.mock("ioredis", () => {
  const RedisMock = jest.requireActual("ioredis-mock");
  const mockClient = new RedisMock({
    data: {
      "githubuser@mail.com": "true",
      wallet_address: "true",
    },
  });

  return jest.fn(() => mockClient);
});

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

    test("false for auth'ed user who has, and claims at unused wallet address", async () => {
      await expect(
        hasClaimed(mockTwitterSession, "unused_wallet_address")
      ).resolves.toBe(false);
    });

    test("true for auth'ed user who has not claimed but claims at already claimed address", async () => {
      await expect(
        hasClaimed(mockTwitterSession, "wallet_address")
      ).resolves.toBe(true);
    });

    test("true for auth'ed user who has claimed", async () => {
      await expect(hasClaimed(mockGithubSession)).resolves.toBe(true);
    });
  });

  describe("handler(req, res)", () => {
    test("unauth'ed user returns 401", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    test("auth'ed user and claimed", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockGithubSession
      );

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: true });
    });

    test("auth'ed user, checking at already claimed address", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockGithubSession
      );

      const { req, res } = createMocks({
        method: "GET",
        body: {
          address: "wallet_address",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: true });
    });

    test("auth'ed user and not claimed", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockTwitterSession
      );

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: false });
    });
  });
});
