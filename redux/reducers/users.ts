import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
    address: "",
    email: "",
    name: "",
    profile_picture: "",
    userStatus: "",
    id: "",
    nfts: [],
};

export const userReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetNfts, (state: typeof INITIAL_STATE, action) => {
            state.nfts = action.payload as NFT[];
        })
        .addCase(actions.onLoginUser.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.address = action.payload.address;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.profile_picture = action.payload.profile_picture;
            state.userStatus = action.payload.userStatus;
            state.id = action.payload.id;
        });
});
