import { render } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { mockGithubSession, mockTwitterSession } from "../__mocks__/mocks";
import Home from "../pages/index";

jest.mock("next-auth/react", () => {
  return {
    useSession: jest.fn(),
  };
});

describe("index page", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("renders homepage unchanged - not logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticaated",
    });

    const { container } = render(<Home claimed={false} />);
    expect(container).toMatchSnapshot();
  });

  it("renders homepage unchanged - logged in with GitHub", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockGithubSession,
      status: "authenticaated",
    });

    const { container } = render(<Home claimed={false} />);
    expect(container).toMatchSnapshot();
  });

  it("renders homepage unchanged - logged in with Twitter", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockTwitterSession,
      status: "authenticaated",
    });

    const { container } = render(<Home claimed={false} />);
    expect(container).toMatchSnapshot();
  });
});
