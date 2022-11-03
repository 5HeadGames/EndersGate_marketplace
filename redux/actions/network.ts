import { createAction } from "@reduxjs/toolkit";
import * as actionTypes from "../constants";

export const onNetworkChange = createAction(
    actionTypes.SET_NETWORK,
    function prepare(newNetworkData: any) {
        return {
            payload: newNetworkData
        };
    }
);
