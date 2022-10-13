import { test, expect } from "@playwright/test";
import { userFixture } from "../fixtures/user";
import { encode } from "../utils/encode";

test("Unauthenticated - show login buttons", async ({ page }) => {
  await page.goto("/");
  const twitterBtn = page.locator("data-testid=twitter-login-btn");
  const githubBtn = page.locator("data-testid=github-login-btn");
  await expect(twitterBtn).toHaveText(/Sign in/);
  await expect(githubBtn).toHaveText(/Sign in/);
});

test("Authenticated - claim", async ({ browser }) => {
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
          domain: "127.0.0.1",
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          expires: 5389421866.440944,
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
  await expect(claimBtn).toBeDisabled();
  await expect(walletInput).toBeDisabled();
  await expect(claimBtn).toHaveText(/Claim/);

  // Sign out and no longer show the form & show sign in buttons
  const signOutBtn = page.locator('[data-testid="signout-btn"]');
  await signOutBtn.click();

  await expect(walletInput).not.toBeVisible();
  await expect(claimBtn).not.toBeVisible();

  const twitterBtn = page.locator("data-testid=twitter-login-btn");
  const githubBtn = page.locator("data-testid=github-login-btn");
  await expect(twitterBtn).toHaveText(/Sign in/);
  await expect(githubBtn).toHaveText(/Sign in/);
});
