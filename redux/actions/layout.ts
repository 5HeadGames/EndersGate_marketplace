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
  function prepare({ ethAddress, email, provider, providerName }: any) {
    return {
      payload: { ethAddress, email, provider, providerName },
    };
  },
);
export const addCart = createAction(
  actionTypes.ADD_CART,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const removeFromCart = createAction(
  actionTypes.REMOVE_FROM_CART,
  function prepare(item: any) {
    return {
      payload: item,
    };
  },
);

export const removeAll = createAction(actionTypes.REMOVE_ALL);
