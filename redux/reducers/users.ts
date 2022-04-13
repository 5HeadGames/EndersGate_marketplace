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
        .addCase(actions.onApproveERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {})
        .addCase(actions.onSellERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {})
        .addCase(actions.onBuyERC1155.fulfilled, (state: typeof INITIAL_STATE, action) => {});
});
