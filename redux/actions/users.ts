import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import {update} from "firebase/database";
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
    console.log(userData);
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
        const user = await readUser(`users/${userData.address}`);
        return user || placeholderData;
      } catch (err) {
        console.log({err});
        const {user: userAuth} = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        await writeUser(`users/${(userData as any).address}`, {email: userData.email});
        const user = await readUser(`users/${userData.address}`);
        //writeUser(
        //`users/${userAuth.uid}`,
        //{email: userData.email}
        //);

        return user || placeholderData;
      }
    } else {
      const user = await readUser(`users/${(userData as any).address}`);
      if (!user) {
        await writeUser(`users/${(userData as any).address}`, placeholderData);
      }
      const newUser = await readUser(`users/${(userData as any).address}`);
      return newUser || placeholderData;
    }
  }
);

export const onUpdateUserCredentials = createAsyncThunk(
  actionTypes.UPDATE_USER_CREDENTIALS,
  async function prepare({
    newEmail,
    oldEmail,
    newPassword,
    oldPassword,
    userPath,
  }: {
    newEmail: string;
    oldEmail: string;
    newPassword: string;
    oldPassword: string;
    userPath: string;
  }) {
    const currentAuth = getAuth();
    const credential = await signInWithEmailAndPassword(currentAuth, oldEmail, oldPassword);
    await updateEmail(credential.user, newEmail);
    await updatePassword(credential.user, newPassword);
    await writeUser(userPath, {email: newEmail});
    return {email: newEmail};
  }
);

export const onUpdateUser = createAction(
  actionTypes.UPDATE_USER,
  function prepare(updateData: Partial<User>) {
    return {payload: updateData};
  }
);

export const onLogout = createAsyncThunk(
  actionTypes.LOGOUT,
  async function prepare(user: User) {
    const auth = getAuth();
    try {
      if (user.email) await signOut(auth);
      else return true;
    } catch (err) {
      console.log({err});
      return false;
    }
    return true;
  }
);
