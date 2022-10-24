import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
  blur: false,
  message: "",
  cart: [],
};

export const layoutReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(actions.onBlurLayout, (state: typeof INITIAL_STATE, action) => {
      state.blur = action.payload;
    })
    .addCase(actions.onMessage, (state: typeof INITIAL_STATE, action) => {
      state.message = action.payload;
    })
    .addCase(actions.addCart, (state: typeof INITIAL_STATE, action) => {
      state.cart.push(action.payload);
    })
    .addCase(actions.removeFromCart, (state: typeof INITIAL_STATE, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    })
    .addCase(actions.removeAll, (state: typeof INITIAL_STATE) => {
      state.cart = [];
    });
});
