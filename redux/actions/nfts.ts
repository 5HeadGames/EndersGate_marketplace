import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import * as actionTypes from "../constants";
import {getAddresses, getContract} from "@shared/web3";
import cards from "../../cards.json";

export const getListed = createAsyncThunk(
  actionTypes.GET_LISTED_NFTS,
  async function prepare() {
    const addresses = getAddresses();
    const marketplace = getContract("ClockAuction", addresses.marketplace);
    const auctionCreated = (
      await marketplace.getPastEvents("AuctionCreated", {
        fromBlock: await marketplace.methods.genesisBlock().call(),
        toBlock: "latest",
      })
    ).map((event) => ({
      nftAddress: event.returnValues.nftAddress,
      tokenId: event.returnValues.tokenId,
      startingPrice: event.returnValues.startingPrice,
      endingPrice: event.returnValues.endingPrice,
      duration: event.returnValues.duration,
      seller: event.returnValues.seller,
      proxyAddress: event.returnValues.proxy,
      appId: event.returnValues.appId,
    }));
    console.log({auctionCreated})
  }
);

export const onMessage = createAction(
  actionTypes.MESSAGE_LAYOUT,
  function prepare(message: string) {
    return {
      payload: message,
    };
  }
);
