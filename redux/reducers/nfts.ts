import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
  balanceCards: [],
  balancePacks: [],
  balanceWrapped: [],
  balanceComics: [],
  comicsLimit: 500,
  currentComicsSupply: 0,
  allSales: [],
  saleCreated: [],
  saleSuccessfull: [],
  allRents: [],
  rentsListed: [],
  rentsInRent: [],
  rentsFinished: [],
  totalSales: 0,
  dailyVolume: 0,
  cardsSold: 0,
};

export const nftReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(
      actions.onGetAssets.fulfilled,
      (state: typeof INITIAL_STATE, action) => {
        state.balanceCards = action.payload.balanceCards;
        state.balancePacks = action.payload.balancePacks;
        state.balanceWrapped = action.payload.balanceWrapped;
        state.balanceComics = action.payload.balanceComics;
      },
    )
    .addCase(
      actions.onLoadSales.fulfilled,
      (state: typeof INITIAL_STATE, action) => {
        state.saleCreated = action.payload.saleCreated;
        state.saleSuccessfull = action.payload.saleSuccessful;
        state.totalSales = action.payload.totalSales;
        state.rentsListed = action.payload.rentsListed;
        state.rentsInRent = action.payload.rentsInRent;
        state.rentsFinished = action.payload.rentsFinished;
        state.dailyVolume = Number(action.payload.dailyVolume);
        state.cardsSold = Number(action.payload.cardsSold);
        state.allRents = action.payload.allRents;
        state.allSales = action.payload.allSales;
        state.currentComicsSupply = action.payload.currentComicsSupply;
      },
    );
});
