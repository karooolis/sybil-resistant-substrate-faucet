import "@testing-library/jest-dom";
import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";
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
    const signInSpy = jest.spyOn(NextAuth, "signIn");

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

  test("logged in, not claimed, sign out", async () => {
    const signOutSpy = jest.spyOn(NextAuth, "signOut");

    (useSession as jest.Mock).mockReturnValue({
      data: mockGithubSession,
      status: "authenticated",
    });

    render(<Index claimed={false} />);

    // it does not render login buttons
    const twitterBtn = screen.queryByTestId("twitter-login-btn");
    const githubBtn = screen.queryByTestId("github-login-btn");
    expect(twitterBtn).toBe(null);
    expect(githubBtn).toBe(null);

    // it renders empty wallet address field
    const walletInput = screen.getByTestId("wallet-input");
    expect(walletInput).toHaveValue("");
    expect(walletInput).not.toBeDisabled();

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

  test("logged in, claimed", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockTwitterSession,
      status: "authenticated",
    });

    render(<Index claimed={true} />);

    // it renders disabled empty wallet address field
    const walletInput = screen.getByTestId("wallet-input");
    expect(walletInput).toHaveValue("");
    expect(walletInput).toBeDisabled();

    // it renders disabled claim button
    const claimBtn = screen.getByTestId("claim-btn");
    expect(claimBtn).toHaveTextContent("Tokens Already Claimed");
    expect(claimBtn).toBeDisabled();
  });

  test("logged in, not claimed, claim to wrong address", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockTwitterSession,
      status: "authenticated",
    });

    render(<Index claimed={false} />);

    // it attempts to claim to incorrect wallet address
    const walletInput = screen.getByTestId("wallet-input");
    let walletInputError = screen.queryByTestId("wallet-input-error");
    let claimBtn = screen.getByTestId("claim-btn");
    expect(walletInputError).toBe(null);

    await fireEvent.change(walletInput, {
      target: { value: "this-is-incorrect-address" },
    });
    await fireEvent.click(claimBtn);

    // it shows wallet input error & disables claim button
    walletInputError = screen.queryByTestId("wallet-input-error");
    expect(walletInputError).toBeInTheDocument();
    expect(walletInputError).toHaveTextContent(
      "Please enter valid wallet address."
    );

    claimBtn = screen.getByTestId("claim-btn");
    expect(claimBtn).toBeDisabled();
  });

  test("logged in, not claimed, claim to correct address", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockTwitterSession,
      status: "authenticated",
    });

    render(<Index claimed={false} />);

    // it attempts to claim to incorrect wallet address
    const walletInput = screen.getByTestId("wallet-input");
    const walletInputError = screen.queryByTestId("wallet-input-error");
    let claimBtn = screen.getByTestId("claim-btn");
    expect(walletInputError).toBe(null);

    // it attemps to claim to correct wallet address
    await fireEvent.change(walletInput, {
      target: { value: "5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u" },
    });
    await fireEvent.click(claimBtn);

    // it fires tokens claim handler
    claimBtn = screen.getByTestId("claim-btn");
    expect(claimBtn).toHaveTextContent("Claiming ...");
  });
});
