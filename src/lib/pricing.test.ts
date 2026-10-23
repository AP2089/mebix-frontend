import { describe, expect, it } from "vitest";

import {
  calculateSizeFactor,
  calculateUnitPrice,
  createCartItemId,
  isValidDimension,
} from "./pricing";

describe("pricing", () => {
  it("returns 1 for base dimensions", () => {
    expect(calculateSizeFactor(1000, 1000, 1000, 1000, 1000, 1000)).toBe(1);
  });

  it("scales with volume", () => {
    expect(calculateSizeFactor(2000, 1000, 1000, 1000, 1000, 1000)).toBe(2);
  });

  it("applies material multiplier", () => {
    const price = calculateUnitPrice({
      basePrice: 10000,
      width: 1000,
      height: 1000,
      depth: 1000,
      baseWidth: 1000,
      baseHeight: 1000,
      baseDepth: 1000,
      materialMultiplier: 1.15,
      colorMultiplier: 1,
    });
    expect(price).toBe(11500);
  });

  it("validates dimension step", () => {
    expect(isValidDimension(1100, 1000, 2000, 50)).toBe(true);
    expect(isValidDimension(1105, 1000, 2000, 50)).toBe(false);
    expect(isValidDimension(900, 1000, 2000, 50)).toBe(false);
  });

  it("builds stable cart item ids", () => {
    expect(
      createCartItemId({
        productId: 1,
        width: 1200,
        height: 750,
        depth: 800,
        materialId: 2,
        colorId: 3,
      }),
    ).toBe("1-1200-750-800-2-3");
  });
});
