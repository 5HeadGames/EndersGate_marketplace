import {createReducer} from '@reduxjs/toolkit'
import * as actions from '../actions'

const INITIAL_STATE = {
    address: '',
    email: '',
    id: '',
    nfts: []
};

export const userReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetNfts, (state: typeof INITIAL_STATE, action) => {
            state.nfts = action.payload as NFT[]
        })
        .addCase(actions.onLoginUser.fulfilled, (state: typeof INITIAL_STATE, action) => {
        })
})


