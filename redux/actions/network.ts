import { createAction } from "@reduxjs/toolkit";
import * as actionTypes from "../constants";

export interface NetworkData {
    networkId: number
    chainName: string
}

export const onNetworkChange = createAction(
    actionTypes.SET_NETWORK,
    function prepare(newNetworkData: NetworkData) {
        return {
            payload: newNetworkData
        };
    }
);
