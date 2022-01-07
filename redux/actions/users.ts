import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
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
  async function prepare(userData: {email?: string; password?: string; address: string}) {
    const placeholderData = {
      email: "",
      name: "",
      profile_picture: "",
      userStatus: "",
      address: (userData as any).address,
    };
    if (userData.email) {
      try {
        const {user: userAuth} = await signInWithEmailAndPassword(
          auth,
          (userData as any).email,
          (userData as any).password
        );
        const user = await readUser(`users/${userAuth.uid}`);
        return user;
      } catch (err) {
        const {user: userAuth} = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        const user = await readUser(`users/${userData.address}`);
        writeUser(
          (userData as any).address,
          {email: userData.email},
        );
        writeUser(
          userAuth.uid,
          {email: userData.email}
        );

        return user || placeholderData;
      }
    } else {
      const user = await readUser(`users/${(userData as any).address}`);
      if (!user) {
        writeUser((userData as any).address, placeholderData);
      }
      return user || placeholderData;
    }
  }
);
