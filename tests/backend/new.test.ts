import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";
import * as NextAuth from "next-auth/next";
import { mockGithubSession, mockTwitterSession } from "../fixtures/sessions";
import handler from "../../pages/api/claim/new";

jest.spyOn(NextAuth, "unstable_getServerSession");
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

describe("API status endpoint (/api/claim/new)", () => {
  describe("handler()", () => {
    test("unauth'ed user returns 401", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    test("auth'ed user submits invalid address", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockGithubSession
      );

      const { req, res } = createMocks({
        method: "GET",
        body: {
          address: "invalid_address",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    test("auth'ed user submits valid claimed address", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockGithubSession
      );

      const { req, res } = createMocks({
        method: "GET",
        body: {
          address: "5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    test("auth'ed user submits valid unclaimed address", async () => {
      (NextAuth.unstable_getServerSession as jest.Mock).mockReturnValue(
        mockTwitterSession
      );

      const { req, res } = createMocks({
        method: "GET",
        body: {
          address: "5CJhPVnG9hsmM736zPqRLnJiE6ngPemgkMVNFLmHZLaD5Lhy",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });
});
