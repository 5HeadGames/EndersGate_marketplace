import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
    balanceCards: [],
    balancePacks: [],
    saleCreated: [],
    saleSuccessfull: [],
    totalSales: 0,
    dailyVolume: 0,
    cardsSold: 0,
};

export const nftReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetAssets.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.balanceCards = action.payload.balanceCards;
            state.balancePacks = action.payload.balancePacks;
        })
        .addCase(actions.onLoadSales.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.saleCreated = action.payload.saleCreated;
            state.saleSuccessfull = action.payload.saleSuccessful;
            state.totalSales = action.payload.totalSales;
            //state.dailyVolume = action.payload.dailyVolume;
            //state.cardsSold = action.payload.cardsSold;
        });
});
