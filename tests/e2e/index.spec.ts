import Redis from "ioredis";
import { test, expect } from "@playwright/test";
import { userFixture } from "../fixtures/user";
import { getKey } from "../../pages/api/claim/status";
import { encode } from "../../utils/encode";

// Setup redis client
const client = new Redis(process.env.REDIS_ENDPOINT as string);

test("Unauthenticated - show login buttons", async ({ page }) => {
  await page.goto("/");
  const twitterBtn = page.locator("data-testid=twitter-login-btn");
  const githubBtn = page.locator("data-testid=github-login-btn");
  await expect(twitterBtn).toHaveText(/Sign in/);
  await expect(githubBtn).toHaveText(/Sign in/);
});

test("Authenticated - claim successful & claim disabled after refresh", async ({ browser }) => {
  const encoded = await encode(
    userFixture,
    process.env.NEXTAUTH_SECRET as string
  );

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
  await expect(claimBtn).toBeDisabled();
  await expect(walletInput).toBeDisabled();
  await expect(claimBtn).toHaveText("Tokens Claimed Successfully");

  // Should not be able to claim until time expires
  await page.reload();
  await expect(claimBtn).toBeDisabled();
  await expect(walletInput).toBeDisabled();
  await expect(claimBtn).toHaveText("Tokens Already Claimed");

  // Sign out and no longer show the form & show sign in buttons
  const signOutBtn = page.locator('[data-testid="signout-btn"]');
  await signOutBtn.click();

  await expect(walletInput).not.toBeVisible();
  await expect(claimBtn).not.toBeVisible();

  const twitterBtn = page.locator("data-testid=twitter-login-btn");
  const githubBtn = page.locator("data-testid=github-login-btn");
  await expect(twitterBtn).toHaveText(/Sign in/);
  await expect(githubBtn).toHaveText(/Sign in/);

  // Clean up Redis state after running the test
  const key = getKey(userFixture) as string;
  await client.del(key);
});
