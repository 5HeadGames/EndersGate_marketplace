import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
    networkId: 1666600000,
    name: "Harmony"
}

export const networkReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onNetworkChange, (state: typeof INITIAL_STATE, action) => {
            state = action.payload;
        })
});
