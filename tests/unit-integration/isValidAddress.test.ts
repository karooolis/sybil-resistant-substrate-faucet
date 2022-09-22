import "@testing-library/jest-dom";
import { isValidAddress } from "../../utils/isValidAddress";

describe("isValidAddress", () => {
  test("valid address", () => {
    expect(
      isValidAddress("5GgiURgKaVw2nENZuUmLWQVV7oaGH7ryRkK4A7q4dZWNu69u")
    ).toBe(true);
  });

  test("invalid address", () => {
    expect(isValidAddress("this-is-invalid-address")).toBe(false);
  });
});
