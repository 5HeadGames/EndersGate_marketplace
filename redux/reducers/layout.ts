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
    });
});
