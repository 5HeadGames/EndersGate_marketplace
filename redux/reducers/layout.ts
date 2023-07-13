import { createReducer } from "@reduxjs/toolkit";
import { ConnectionType } from "@shared/utils/connection";
import * as actions from "../actions";

interface InitialState {
  user: {
    ethAddress: string;
    email: string;
    wallet: any;
    networkId: any;
  };
  blur: boolean;
  isLogged: boolean;
  message: string;
  provider: any;
  providerEth: any;
  networkEth: any;
  providerName: string;
  tokenToPay: string;
  cart: any[];
  cartComics: any[];
  cartShop: any[];
}

const INITIAL_STATE: InitialState = {
  blur: false,
  message: "",
  user: {
    ethAddress: "",
    email: "",
    wallet: ConnectionType.INJECTED,
    networkId: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
  isLogged: false,
  providerName: "",
  providerEth: process.env.NEXT_PUBLIC_PROVIDER_ETH,
  networkEth: process.env.NEXT_PUBLIC_CHAIN_ID_ETH,
  provider: undefined,
  tokenToPay: "",
  cart: [],
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
    .addCase(actions.onUpdateUser, (state: typeof INITIAL_STATE, action) => {
      state.user.email = action.payload.email;
      state.user.ethAddress = action.payload.ethAddress;
      state.provider = action.payload.provider;
      state.providerName = action.payload.providerName;
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
    });
});
