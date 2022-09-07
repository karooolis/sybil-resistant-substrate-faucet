import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");
  // Click [data-testid="twitter-login-btn"]
  await page.locator('data-testid=twitter-login-btn').click();

  await expect(page).toHaveURL(
    "https://twitter.com/i/oauth2/authorize?client_id=MlFHWHZlNzRmWDhoTmppbHA2ajA6MTpjaQ&scope=users.read%20tweet.read%20offline.access&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Ftwitter&state=zFRERia2eiwPUnn9pKtdNJjMsLYWSeCcL-lpLH1g7ZI&code_challenge=rcMjw-uYcc_ZRyRFSkSsrYiQLBtQBkHxMrnfpKztAKI&code_challenge_method=S256"
  );
  
  // Click div[role="button"]:has-text("Accept all cookies")
  await page
    .locator('div[role="button"]:has-text("Accept all cookies")')
    .click();
});
