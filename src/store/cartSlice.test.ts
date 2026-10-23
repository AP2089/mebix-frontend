import { describe, expect, it } from "vitest";

import cartReducer, { addItem, removeItem, updateQuantity } from "./cartSlice";
import type { CartItem } from "@/types/cart";

const sample: CartItem = {
  id: "1-100-100-100-1-1",
  productId: 1,
  productSlug: "stol",
  productName: "Стол",
  imageUrl: "",
  width: 100,
  height: 100,
  depth: 100,
  materialId: 1,
  materialName: "ЛДСП",
  colorId: 1,
  colorName: "Дуб",
  colorHex: "#ccc",
  quantity: 1,
  unitPrice: "1000.00",
  lineTotal: "1000.00",
};

describe("cartSlice", () => {
  it("adds item", () => {
    const state = cartReducer({ items: [] }, addItem(sample));
    expect(state.items).toHaveLength(1);
  });

  it("merges same configuration", () => {
    const first = cartReducer({ items: [] }, addItem(sample));
    const second = cartReducer(first, addItem({ ...sample, quantity: 2 }));
    expect(second.items).toHaveLength(1);
    expect(second.items[0]?.quantity).toBe(3);
    expect(second.items[0]?.lineTotal).toBe("3000.00");
  });

  it("keeps different configurations separate", () => {
    const first = cartReducer({ items: [] }, addItem(sample));
    const second = cartReducer(
      first,
      addItem({ ...sample, id: "1-200-100-100-1-1", width: 200 }),
    );
    expect(second.items).toHaveLength(2);
  });

  it("updates quantity and removes", () => {
    const withItem = cartReducer({ items: [] }, addItem(sample));
    const updated = cartReducer(withItem, updateQuantity({ id: sample.id, quantity: 4 }));
    expect(updated.items[0]?.lineTotal).toBe("4000.00");
    const removed = cartReducer(updated, removeItem(sample.id));
    expect(removed.items).toHaveLength(0);
  });
});
