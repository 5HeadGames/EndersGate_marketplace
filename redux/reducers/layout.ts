import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
  blur: false,
  message: "",
  user: {
    ethAddress: "",
    email: "",
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
