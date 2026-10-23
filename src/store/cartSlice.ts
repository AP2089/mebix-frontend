import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
        const unit = Number(existing.unitPrice);
        existing.lineTotal = (unit * existing.quantity).toFixed(2);
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (!item) return;
      item.quantity = Math.max(1, Math.min(100, action.payload.quantity));
      item.lineTotal = (Number(item.unitPrice) * item.quantity).toFixed(2);
    },
    updateItem(state, action: PayloadAction<{ oldId: string; item: CartItem }>) {
      const index = state.items.findIndex((entry) => entry.id === action.payload.oldId);
      if (index === -1) return;
      const duplicate = state.items.find(
        (entry, i) => entry.id === action.payload.item.id && i !== index,
      );
      if (duplicate) {
        duplicate.quantity += action.payload.item.quantity;
        duplicate.lineTotal = (Number(duplicate.unitPrice) * duplicate.quantity).toFixed(2);
        state.items.splice(index, 1);
      } else {
        state.items[index] = action.payload.item;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    replacePrices(
      state,
      action: PayloadAction<Array<{ id: string; unitPrice: string; lineTotal: string }>>,
    ) {
      for (const update of action.payload) {
        const item = state.items.find((entry) => entry.id === update.id);
        if (item) {
          item.unitPrice = update.unitPrice;
          item.lineTotal = update.lineTotal;
        }
      }
    },
  },
});

export const { addItem, updateQuantity, updateItem, removeItem, clearCart, replacePrices } =
  cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
