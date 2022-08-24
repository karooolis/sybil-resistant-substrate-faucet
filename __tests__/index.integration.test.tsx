import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { mockGithubSession, mockTwitterSession } from "../__mocks__/mocks";
import Index from "../pages/index";

jest.mock("next-auth/react", () => {
  return {
    useSession: jest.fn(),
  };
});

describe("Index", () => {
  test("logged out, not claimed", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Index claimed={false} />);

    // it renders login buttons
    const twitterBtn = screen.getByTestId("twitter-login-btn");
    const githubBtn = screen.getByTestId("github-login-btn");
    expect(twitterBtn).toHaveTextContent("Sign in");
    expect(githubBtn).toHaveTextContent("Sign in");

    // TODO: spy calling signIn on click
  });

  test("logged in (GitHub), not claimed", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockGithubSession,
      status: "authenticated",
    });

    render(<Index claimed={false} />);

    // it does not render login buttons
    const twitterBtn = screen.queryByTestId("twitter-login-btn");
    const githubBtn = screen.queryByTestId("github-login-btn");
    expect(twitterBtn).toBeFalsy();
    expect(githubBtn).toBeFalsy();

    // it renders sign out button
    const signOutBtn = screen.getByTestId("signout-btn");
    expect(signOutBtn).toHaveTextContent("Sign out");

    // it renders empty wallet address field
    const walletInput = screen.getByTestId("wallet-input");
    expect(walletInput).toHaveValue("");

    // it renders claim button
    const claimBtn = screen.getByTestId("claim-btn");
    expect(claimBtn).toHaveTextContent("Claim");
    expect(claimBtn).not.toBeDisabled();
  });
});
