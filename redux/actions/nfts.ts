import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import Web3 from "web3";

import * as actionTypes from "../constants";
import {getAddresses, getContract} from "@shared/web3";
import cards from "../../cards.json";

const getCardSold = (successfulSales: Sale[]) => {
  return successfulSales.reduce(
    (acc, cur) => acc.add(Web3.utils.toBN(cur.amount)),
    Web3.utils.toBN(0)
  );
};

const getDailyVolume = (successfulSales: Sale[]) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  return successfulSales.reduce((acc, cur) => {
    const started = new Date(Number(cur.startedAt) * 1000).getTime();
    return acc.add(
      started > startOfDay.getTime() && started < endOfDay.getTime()
        ? Web3.utils.toBN(cur.price)
        : Web3.utils.toBN(0)
    );
  }, Web3.utils.toBN(0));
};

export const onLoadSales = createAsyncThunk(actionTypes.GET_LISTED_NFTS, async function prepare() {
  const addresses = getAddresses();
  const marketplace = getContract("ClockSale", addresses.marketplace);
  const lastSale = Number(await marketplace.methods.tokenIdTracker().call());
  const rawSales = await marketplace.methods
    .getSales(new Array(lastSale).fill(0).map((a, i) => i))
    .call();

  const allSales = rawSales.map((sale: string[], i) => ({
    id: i,
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    duration: sale[5],
    startedAt: sale[6],
    status: sale[7],
  }));
  const created = allSales.filter((sale: Sale) => sale.status === "0");
  const successful = allSales.filter((sale: Sale) => sale.status === "1");
  const dailyVolume = getDailyVolume(successful);
  const cardsSold = getCardSold(successful);

  return {
    saleCreated: created,
    saleSuccessful: successful,
    totalSales: created.length,
    dailyVolume: dailyVolume.toString(),
    cardsSold: cardsSold.toString(),
  };
});

export const onLoadSale = createAsyncThunk(
  actionTypes.GET_LISTED_NFT,
  async function prepare(tokenId: any) {
    const addresses = getAddresses();
    const marketplace = getContract("ClockSale", addresses.marketplace);
    const saleCreated = await marketplace.methods.sales(tokenId).call();
    return saleCreated;
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
