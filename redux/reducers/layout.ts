import {createReducer} from '@reduxjs/toolkit'
import * as actions from '../actions'

const INITIAL_STATE = {
    blur: false,
    message: ''
};

export const layoutReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onBlurLayout, (state: typeof INITIAL_STATE, action) => {
            state.blur = action.payload
        })
        .addCase(actions.onMessage, (state: typeof INITIAL_STATE, action) => {
            state.message = action.payload
        })
})



