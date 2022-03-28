import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import * as actionTypes from "../constants";
import {getAddresses, getContract} from "@shared/web3";
import cards from "../../cards.json";

export const onGetListed = createAsyncThunk(
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
    console.log({auctionCreated});
  }
);

export const onGetAssets = createAsyncThunk(
  actionTypes.GET_ASSETS,
  async function prepare(address: string) {
    const {endersGate, pack} = getAddresses();
    const cardsContract = getContract("ERC1155", endersGate);
    const packsContract = getContract("ERC1155", pack);
    const packsIds = [0, 1, 2, 3];
    const cardsIds = Object.values(cards)
      .reduce((acc: any[], cur) => acc.concat(cur), [])
      .map((card) => card.properties.id.value);

    const balancePacks = await packsContract.methods
      .balanceOfBatch(
        packsIds.map(() => address),
        packsIds
      )
      .call();
    const balanceCards = await cardsContract.methods
      .balanceOfBatch(
        cardsIds.map(() => address),
        cardsIds
      )
      .call();

    return {
      balanceCards: cardsIds.map((id, i) => ({id, balance: balanceCards[i]})),
      balancePacks: packsIds.map((id, i) => ({id, balance: balancePacks[i]})),
    };
  }
);

