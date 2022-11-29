import { createReducer } from "@reduxjs/toolkit";
import { onNetworkChange } from "../actions/network";

const INITIAL_STATE: {networkId: number} = {
    networkId: 1666600000
}

export const networkReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(onNetworkChange, (state: typeof INITIAL_STATE, action) => {
            state.networkId = action.payload;
        })
});
