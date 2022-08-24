import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NextAuth, { useSession } from "next-auth/react";
import { mockGithubSession, mockTwitterSession } from "../__mocks__/mocks";
import Index from "../pages/index";

jest.mock("next-auth/react", () => {
  return {
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn(),
  };
});

describe("Index", () => {
  test("logged out, not claimed", async () => {
    const signInSpy = jest.spyOn(NextAuth, 'signIn');

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

    // it calls sign in with twitter
    await fireEvent.click(twitterBtn);
    expect(signInSpy).toBeCalledTimes(1);
    expect(signInSpy).toBeCalledWith("twitter");

    // it calls sign in with github
    await fireEvent.click(githubBtn);
    expect(signInSpy).toBeCalledTimes(2);
    expect(signInSpy).toBeCalledWith("github");
  });

  test("logged in, not claimed", async () => {
    const signOutSpy = jest.spyOn(NextAuth, 'signOut');

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

    // it renders empty wallet address field
    const walletInput = screen.getByTestId("wallet-input");
    expect(walletInput).toHaveValue("");

    // it renders claim button
    const claimBtn = screen.getByTestId("claim-btn");
    expect(claimBtn).toHaveTextContent("Claim");
    expect(claimBtn).not.toBeDisabled();

    // it renders sign out button
    const signOutBtn = screen.getByTestId("signout-btn");
    expect(signOutBtn).toHaveTextContent("Sign out");

    // it calls sign out
    await fireEvent.click(signOutBtn);
    expect(signOutSpy).toBeCalledTimes(1);
  });

  test("logged in, claimed", () => {});

  test("logged in, not claimed, claim", () => {});
});
