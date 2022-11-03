import { createReducer } from "@reduxjs/toolkit";
import { onNetworkChange, NetworkData } from "../actions/network";

const INITIAL_STATE: NetworkData = {
    networkId: 1666600000,
    chainName: "Harmony"
}

export const networkReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(onNetworkChange, (state: typeof INITIAL_STATE, action) => {
            state = action.payload;
        })
});
