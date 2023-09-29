import { createReducer } from "@reduxjs/toolkit";
import { ConnectionType } from "@shared/utils/connection";
import * as actions from "../actions";

interface InitialState {
  blur: boolean;
  isLogged: boolean;
  message: string;
  tokenToPay: string;
  cart: any[];
  cartComics: any[];
  cartShop: any[];
  cartRent: any[];
}

const INITIAL_STATE: InitialState = {
  blur: false,
  message: "",
  isLogged: false,
  tokenToPay: "",
  cart: [],
  cartRent: [],
  cartComics: [],
  cartShop: [],
};

export const layoutReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(actions.onBlurLayout, (state: typeof INITIAL_STATE, action) => {
      state.blur = action.payload;
    })
    .addCase(actions.onMessage, (state: typeof INITIAL_STATE, action) => {
      state.message = action.payload;
    })
    .addCase(actions.onLogged, (state: typeof INITIAL_STATE, action) => {
      state.isLogged = action.payload.isLogged;
    })
    .addCase(actions.addCart, (state: typeof INITIAL_STATE, action) => {
      state.cart.push(action.payload);
    })
    .addCase(actions.editCart, (state: typeof INITIAL_STATE, action) => {
      state.cart[action.payload.id] = action.payload.item;
    })
    .addCase(actions.removeFromCart, (state: typeof INITIAL_STATE, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    })
    .addCase(actions.removeAll, (state: typeof INITIAL_STATE) => {
      state.cart = [];
    })
    .addCase(actions.addCartComics, (state: typeof INITIAL_STATE, action) => {
      state.cartComics.push(action.payload);
    })
    .addCase(actions.editCartComics, (state: typeof INITIAL_STATE, action) => {
      state.cartComics[action.payload.id] = action.payload.item;
    })
    .addCase(
      actions.removeFromCartComics,
      (state: typeof INITIAL_STATE, action) => {
        state.cartComics = state.cartComics.filter(
          (item) => item.id !== action.payload.id,
        );
      },
    )
    .addCase(actions.removeAllComics, (state: typeof INITIAL_STATE) => {
      state.cartComics = [];
    })
    .addCase(actions.addCartShop, (state: typeof INITIAL_STATE, action) => {
      state.cartShop.push(action.payload);
    })
    .addCase(actions.editCartShop, (state: typeof INITIAL_STATE, action) => {
      state.cartShop[action.payload.id] = action.payload.item;
    })
    .addCase(
      actions.removeFromCartShop,
      (state: typeof INITIAL_STATE, action) => {
        state.cartShop = state.cartShop.filter(
          (item) => item.id !== action.payload.id,
        );
      },
    )
    .addCase(actions.removeAllShop, (state: typeof INITIAL_STATE) => {
      state.cartShop = [];
    })
    .addCase(actions.addCartRent, (state: typeof INITIAL_STATE, action) => {
      state.cartRent.push(action.payload);
    })
    .addCase(actions.editCartRent, (state: typeof INITIAL_STATE, action) => {
      state.cartRent[action.payload.id] = action.payload.item;
    })
    .addCase(
      actions.removeFromCartRent,
      (state: typeof INITIAL_STATE, action) => {
        state.cartRent = state.cartRent.filter(
          (item) => item.id !== action.payload.id,
        );
      },
    )
    .addCase(actions.removeAllRent, (state: typeof INITIAL_STATE) => {
      state.cartRent = [];
    });
});
