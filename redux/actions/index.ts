import {createAction} from '@reduxjs/toolkit'
import * as actionTypes from '../constants'

export const getNFTS = createAction(actionTypes.GET_NFTS, function prepare() {
  //fetch nfts

  return {
    payload: {},
  }
})

