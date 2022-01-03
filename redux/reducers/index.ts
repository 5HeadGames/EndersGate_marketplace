import {createReducer} from '@reduxjs/toolkit'
import * as actions from '../actions'

const INITIAL_STATE = {
    user: {
        nfts: []
    }
};

const userReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.getNFTS, (state: typeof INITIAL_STATE, action) => {
            state.user.nfts = action.payload as NFT[]
        })
})

export default userReducer;
