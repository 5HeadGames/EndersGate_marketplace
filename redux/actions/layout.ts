import { createAction } from "@reduxjs/toolkit";
import * as actionTypes from "../constants";

export const onBlurLayout = createAction(
  actionTypes.BLUR_LAYOUT,
  function prepare(shouldBLur: boolean) {
    return {
      payload: shouldBLur,
    };
  },
);

export const onMessage = createAction(
  actionTypes.MESSAGE_LAYOUT,
  function prepare(message: string) {
    return {
      payload: message,
    };
  },
);

export const onUpdateUser = createAction(
  actionTypes.UPDATE_USER_INTERN,
  function prepare({ ethAddress, email }: any) {
    return {
      payload: { ethAddress, email },
    };
  },
);
