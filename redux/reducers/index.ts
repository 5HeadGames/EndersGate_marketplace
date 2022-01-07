import {createReducer} from '@reduxjs/toolkit'
import * as actions from '../actions'

const INITIAL_STATE = {
    user: {
        address: '',
        email: '',
        id: '',
        nfts: []
    }
};

const mainReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetNfts, (state: typeof INITIAL_STATE, action) => {
            state.user.nfts = action.payload as NFT[]
        })
        .addCase(actions.onLoginUser.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.user = {...state.user, ...action.payload}
        })
})

export default mainReducer;
