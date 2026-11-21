import { describe, expect, it } from "vitest";
import { contrastRatio, INK, readableOn, shade, WHITE } from "./color";

describe("contrastRatio", () => {
  it("matches the WCAG extremes", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#777777", "#777777")).toBe(1);
  });

  it("is symmetric and accepts shorthand hex", () => {
    expect(contrastRatio("#fff", "#1d3b8b")).toBeCloseTo(contrastRatio("#1d3b8b", "#ffffff"));
  });
});

describe("readableOn", () => {
  it("picks white on dark kits and ink on light ones", () => {
    expect(readableOn("#1d3b8b")).toBe(WHITE);
    expect(readableOn("#f2b705")).toBe(INK);
  });

  it("always reaches WCAG AA for large text", () => {
    for (const bg of ["#1d3b8b", "#f2b705", "#146c3a", "#0b7fc0", "#f26b1d", "#8fc3e8", "#7a1f2b"]) {
      expect(contrastRatio(bg, readableOn(bg)), bg).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("shade", () => {
  it("darkens and lightens towards black and white", () => {
    expect(shade("#808080", -1)).toBe("#000000");
    expect(shade("#808080", 1)).toBe("#ffffff");
    expect(shade("#808080", 0)).toBe("#808080");
  });
});
