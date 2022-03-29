import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
    balanceCards: [],
    balancePacks: [],
    auctionCreated: [],
    auctionSuccessfull: [],
};

export const nftReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetAssets.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.balanceCards = action.payload.balanceCards
            state.balancePacks = action.payload.balancePacks
        })
        .addCase(actions.onGetListedSold.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.auctionCreated = action.payload.auctionCreated
            state.auctionSuccessfull = action.payload.auctionSuccessfull
        })
});
