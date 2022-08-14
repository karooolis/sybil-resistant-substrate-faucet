import { render } from "@testing-library/react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Home from "../pages/index";

// TODO: add correct session data
const mockSession: Session = {
  expires: "1",
  user: { email: "a", name: "Delta", image: "c" },
};

jest.mock("next-auth/react", () => ({
  useSession: () => {
    return {
      data: mockSession,
      status: "authenticated",
    };
  },
}));

describe("index page", () => {
  it("renders homepage unchanged - not logged in", () => {
    jest.mock("next-auth/react", () => ({
      useSession: () => {
        return {
          data: null,
          status: "unauthenticated",
        };
      },
    }));

    const { container } = render(<Home claimed={false} />);
    expect(container).toMatchSnapshot();
  });

  it("renders homepage unchanged - logged in", () => {
    jest.mock("next-auth/react", () => ({
      useSession: () => {
        return {
          data: mockSession,
          status: "authenticated",
        };
      },
    }));

    const { container } = render(<Home claimed={false} />);
    expect(container).toMatchSnapshot();
  });
});
