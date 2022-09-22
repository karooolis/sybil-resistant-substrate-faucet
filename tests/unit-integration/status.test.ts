import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";
import { getSession } from "next-auth/react";
import { mockGithubSession, mockOtherSession, mockTwitterSession } from "../fixtures/sessions";
import handler, { getKey, hasClaimed } from "../../pages/api/claim/status";

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => {
    return {
      /**
       * For the purpose of testing, user auth'ed with GitHub has claimed already.
       * Conversely, user auth'ed with Twitter has not yet claimed.
       */
      get: jest.fn((key) => {
        if (key.includes("github")) {
          return true;
        } else if (key.includes("twitter")) {
          return false;
        } else {
          throw new Error("Some connection error");
        }
      }),
    };
  });
});

jest.mock("next-auth/react", () => {
  return {
    getSession: jest.fn(),
  };
});

describe("API status endpoint (/api/claim/status)", () => {
  describe("getKey()", () => {
    test("valid DB key for auth'ed user via GitHub", () => {
      expect(getKey(mockGithubSession)).toBe(
        "github-GITHUB_PROVIDER_ACCOUNT_ID"
      );
    });

    test("valid DB key for auth'ed user via Twitter", () => {
      expect(getKey(mockTwitterSession)).toBe(
        "twitter-TWITTER_PROVIDER_ACCOUNT_ID"
      );
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
      (getSession as jest.Mock).mockReturnValue(mockGithubSession);

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: true });
    });

    test("auth'ed user and not claimed", async () => {
      (getSession as jest.Mock).mockReturnValue(mockTwitterSession);

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toStrictEqual({ claimed: false });
    });

    test("auth'ed user that throws an error", async () => {
      (getSession as jest.Mock).mockReturnValue(mockOtherSession);

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(500);
    });
  });
});
