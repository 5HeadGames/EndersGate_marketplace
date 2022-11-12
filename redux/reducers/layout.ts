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
  message: string;
  cart: any[];
}

const INITIAL_STATE: InitialState = {
  blur: false,
  message: "",
  user: {
    ethAddress: "",
    email: "",
    wallet: ConnectionType.INJECTED,
    networkId: null,
  },
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
    .addCase(actions.onUpdateUser, (state: typeof INITIAL_STATE, action) => {
      console.log(action.payload, "payload");
      state.user.email = action.payload.email;
      state.user.ethAddress = action.payload.ethAddress;
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
