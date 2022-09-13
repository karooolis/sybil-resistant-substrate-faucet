import Redis from "ioredis";
import hkdf from "@panva/hkdf";
import { EncryptJWT, JWTPayload } from "jose";
import { test, expect } from "@playwright/test";

// Setup redis client
const client = new Redis("redis://default:yOud6fLrfiwEvg6fSVylu8gZYcpSjjNx@redis-16243.c241.us-east-1-4.ec2.cloud.redislabs.com:16243");

// console.log(process.env.REDIS_ENDPOINT);

// test("Homepage contains login buttons", async ({ page }) => {
//   await page.goto("/");
//   const twitterBtn = page.locator("data-testid=twitter-login-btn");
//   const githubBtn = page.locator("data-testid=github-login-btn");
//   await expect(twitterBtn).toHaveText(/Sign in/);
//   await expect(githubBtn).toHaveText(/Sign in/);
// });

async function getDerivedEncryptionKey(secret: string) {
  return await hkdf(
    "sha256",
    secret,
    "",
    "NextAuth.js Generated Encryption Key",
    32
  );
}

// Function logic derived from https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L16-L25
export async function encode(
  token: JWTPayload,
  secret: string
): Promise<string> {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000 + maxAge))
    .setJti("test")
    .encrypt(encryptionSecret);
}

test("Auth'ed - attempt to claim", async ({ browser }) => {
  const userObj = {
    user: {
      name: "Karolis Ramanauskas",
      email: "hello@karolisram123.com",
      image: "https://avatars.githubusercontent.com/u/3159964?v=4",
    },
    expires: "2099-01-01T09:44:16.775Z",
    provider: "github",
    providerAccountId: "3159964",
  };
  const encoded = await encode(userObj, "kvepuokgyvenksiekdziaukis");
  console.log(encoded);

  const context = await browser.newContext({
    storageState: {
      cookies: [
        {
          name: "next-auth.session-token",
          value: encoded,
          path: "/",
          domain: "localhost",
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          expires: 1665586311.440944,
        },
      ],
      origins: [],
    },
  });

  const page = await context.newPage();
  await page.goto("/");

  // Claim to incorrect wallet address
  const claimBtn = page.locator('[data-testid="claim-btn"]');
  const walletInput = page.locator('[data-testid="wallet-input"]');

  await walletInput.fill("incorrect-address");
  await expect(claimBtn).toHaveText("Claim");
  await claimBtn.click();

  const inputError = page.locator('[data-testid="wallet-input-error"]');
  await expect(inputError).toHaveText("Please enter valid wallet address.");
  await expect(claimBtn).toBeDisabled();

  // Claim to correct wallet address
  await walletInput.fill("5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u");
  await expect(claimBtn).not.toBeDisabled();

  await claimBtn.click();
  await expect(claimBtn).toHaveText("Claiming ...");
  await expect(claimBtn).toHaveText("Tokens Claimed Successfully");

  await client.del("github-3159964");

  // await claimBtn.click();
  // Claim to correct wallet address
  // await page.locator('[data-testid="signout-btn"]').click();
});
