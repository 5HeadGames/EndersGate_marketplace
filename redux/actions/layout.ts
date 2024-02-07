"use client";
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

export const onLogged = createAction(
  actionTypes.UPDATE_LOGGED_STATE,
  function prepare({ isLogged }: any) {
    return {
      payload: { isLogged },
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

export const editCart = createAction(
  actionTypes.EDIT_CART,
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

export const addCartShop = createAction(
  actionTypes.ADD_CART_SHOP,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const editCartShop = createAction(
  actionTypes.EDIT_CART_SHOP,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const removeFromCartShop = createAction(
  actionTypes.REMOVE_FROM_CART_SHOP,
  function prepare(item: any) {
    return {
      payload: item,
    };
  },
);

export const removeAllShop = createAction(actionTypes.REMOVE_ALL_SHOP);

export const addCartComics = createAction(
  actionTypes.ADD_CART_COMICS,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const editCartComics = createAction(
  actionTypes.EDIT_CART_COMICS,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const removeFromCartComics = createAction(
  actionTypes.REMOVE_FROM_CART_COMICS,
  function prepare(item: any) {
    return {
      payload: item,
    };
  },
);

export const removeAllComics = createAction(actionTypes.REMOVE_ALL_COMICS);

export const addCartRent = createAction(
  actionTypes.ADD_CART_RENT,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const editCartRent = createAction(
  actionTypes.EDIT_CART_RENT,
  function prepare(cart: any) {
    return {
      payload: cart,
    };
  },
);

export const removeFromCartRent = createAction(
  actionTypes.REMOVE_FROM_CART_RENT,
  function prepare(item: any) {
    return {
      payload: item,
    };
  },
);

export const removeAllRent = createAction(actionTypes.REMOVE_ALL_RENT);
