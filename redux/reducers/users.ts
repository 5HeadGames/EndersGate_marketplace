import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE: User = {
    address: "",
    email: "",
    name: "",
    profile_picture: "",
    userStatus: "",
    walletType: "",
    id: "",
    activity: [],
};

export const userReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetNfts, (state: typeof INITIAL_STATE, action) => {
            //state.nfts = action.payload as NFT[];
        })
        .addCase(actions.onLoginUser.fulfilled, (state: typeof INITIAL_STATE, action) => {})
        .addCase(actions.onUpdateUser, (state: typeof INITIAL_STATE, action) => {
            Object.entries(action.payload).forEach((section) => {
                state[section[0]] = section[1];
            });
        })
        .addCase(
            actions.onUpdateFirebaseUser.fulfilled,
            (state: typeof INITIAL_STATE, action) => {}
        )
        .addCase(
            actions.onUpdateUserCredentials.fulfilled,
            (state: typeof INITIAL_STATE, action) => {}
        )
        .addCase(actions.onLogout.fulfilled, (state: typeof INITIAL_STATE, action) => {
            Object.entries(INITIAL_STATE).forEach((section) => {
                state[section[0]] = section[1];
            });
        })
        .addCase(actions.onApproveERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {})
        .addCase(actions.onSellERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {})
        .addCase(actions.onBuyERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {});
});
