import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {readUser, writeUser} from "shared/firebase";
import * as actionTypes from "../constants";

export const onGetNfts = createAction(actionTypes.GET_NFTS, function prepare() {
  //fetch nfts

  return {
    payload: {},
  };
});

const auth = getAuth();

export const onLoginUser = createAsyncThunk(
  actionTypes.LOGIN_USER,
  async function prepare(userData: {address: string} | {email: string; password: string}) {
    console.log(userData)
    return;
    if ((userData as any).address) {
      const user = await readUser(`users/${(userData as any).address}`);
      const placeholderData = {
        email: "",
        name: "",
        profile_picture: "",
        userStatus: "",
        address: (userData as any).address,
      };
      if (!user) {
        writeUser((userData as any).address, placeholderData);
      }
      return user || placeholderData;
    } else {
      const {user: userAuth} = await signInWithEmailAndPassword(
        auth,
        (userData as any).email,
        (userData as any).password
      );
      const user = await readUser(`users/${userAuth.uid}`)
      return user
    }
  }
);


