import { describe, expect, it } from "bun:test";
import { formatScoreOrPoints } from "../format";

describe("formatScoreOrPoints", () => {
  it("should return integer strings without trailing decimals", () => {
    expect(formatScoreOrPoints(96)).toBe("96");
    expect(formatScoreOrPoints("100")).toBe("100");
  });

  it("should round long decimal numbers to 1 decimal place", () => {
    expect(formatScoreOrPoints(96.66666666666666)).toBe("96.7");
    expect(formatScoreOrPoints("85.333333")).toBe("85.3");
  });

  it("should strip .0 from rounded decimals", () => {
    expect(formatScoreOrPoints(95.00000001)).toBe("95");
  });

  it("should handle null and undefined gracefully", () => {
    expect(formatScoreOrPoints(null)).toBe("0");
    expect(formatScoreOrPoints(undefined)).toBe("0");
  });
});
