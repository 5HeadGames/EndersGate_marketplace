import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";
import Moralis from "moralis";

import * as actionTypes from "../constants";
import {
  getAddresses,
  getContract,
  getContractCustom,
  createEvent,
} from "@shared/web3";
import cards from "../../cards.json";
import Address from "@shared/components/Address/Address";

const getCardSold = (successfulSales: Sale[]) => {
  return successfulSales.reduce(
    (acc, cur) => acc.add(Web3.utils.toBN(cur.amount)),
    Web3.utils.toBN(0),
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
        : Web3.utils.toBN(0),
    );
  }, Web3.utils.toBN(0));
};

export const onLoadSales = createAsyncThunk(
  actionTypes.GET_LISTED_NFTS,
  async function prepare() {
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
  },
);

export const onGetAssets = createAsyncThunk(
  actionTypes.GET_ASSETS,
  async function prepare(address: string) {
    try {
      const { endersGate, pack } = getAddresses();
      console.log(endersGate, pack);
      const cardsContract = getContract("ERC1155", endersGate);
      const packsContract = getContract("ERC1155", pack);
      const packsIds = [0, 1, 2, 3];
      const cardsIds = Object.values(cards)
        .reduce((acc: any[], cur) => acc.concat(cur), [])
        .map(
          (card, i) =>
            // card.properties?.id?.value !== undefined
            //   ? card.properties.id.value
            i,
        );
      const balancePacks = await packsContract.methods
        .balanceOfBatch(
          packsIds.map(() => address),
          packsIds,
        )
        .call();
      const balanceCards = await cardsContract.methods
        .balanceOfBatch(
          cardsIds.map(() => address),
          cardsIds,
        )
        .call();

      console.log(balanceCards, balancePacks, "balances");
      console.log(endersGate, pack, "addresses");

      return {
        balanceCards: cardsIds.map((id, i) => ({
          id,
          balance: balanceCards[i],
        })),
        balancePacks: packsIds.map((id, i) => ({
          id,
          balance: balancePacks[i],
        })),
      };
    } catch (err) {
      console.log({ err });
      throw err;
    }
  },
);

export const onSellERC1155 = createAsyncThunk(
  actionTypes.SELL_NFT,
  async function prepare(args: {
    from: string;
    tokenId: number | string;
    startingPrice: number | string;
    amount: number | string;
    duration: string;
    address: string;
    moralis: Moralis;
  }) {
    const { from, tokenId, startingPrice, amount, duration, address, moralis } =
      args;
    const provider = moralis.web3.provider;
    const user = Moralis.User.current();
    const relation = user.relation("events");

    const { marketplace } = getAddresses();
    const marketplaceContract = getContractCustom(
      "ClockSale",
      marketplace,
      provider,
    );
    const { transactionHash } = await marketplaceContract.methods
      .createSale(address, tokenId, startingPrice, amount, duration)
      .send({ from: from });

    const event = createEvent({
      type: "sell",
      metadata: {
        from,
        tokenId,
        startingPrice,
        amount,
        duration,
        address,
        transactionHash,
      },
    });

    await event.save();
    relation.add(event);
    await user.save();

    return { from, tokenId, startingPrice, amount, duration, address };
  },
);

export const onBuyERC1155 = createAsyncThunk(
  actionTypes.BUY_NFT,
  async function prepare(args: {
    seller: string;
    tokenId: number | string;
    bid: string | number;
    amount: string | number;
    nftContract: string;
    moralis: Moralis;
  }) {
    const { seller, tokenId, amount, bid, moralis } = args;
    const provider = moralis.web3.provider;
    const user = Moralis.User.current();
    const relation = user.relation("events");

    const { marketplace } = getAddresses();
    const marketplaceContract = getContractCustom(
      "ClockSale",
      marketplace,
      provider,
    );
    const { transactionHash } = await marketplaceContract.methods
      .buy(tokenId, amount)
      .send({ from: user.get("ethAddress"), value: bid });

    const event = createEvent({
      type: "buy",
      metadata: { seller, tokenId, amount, bid, transactionHash },
    });

    await event.save();
    relation.add(event);
    await user.save();

    return { seller, tokenId, amount, bid, moralis };
  },
);

export const onCancelSale = createAsyncThunk(
  actionTypes.CANCEL_NFT,
  async function prepare(args: {
    tokenId: number | string;
    nftContract: string;
    moralis: Moralis;
  }) {
    const { tokenId, moralis } = args;
    const provider = moralis.web3.provider;
    const user = Moralis.User.current();
    const relation = user.relation("events");

    const { marketplace } = getAddresses();
    const marketplaceContract = getContractCustom(
      "ClockSale",
      marketplace,
      provider,
    );
    const { transactionHash } = await marketplaceContract.methods
      .cancelSale(tokenId)
      .send({ from: user.get("ethAddress") });

    const event = createEvent({
      type: "cancel",
      metadata: { tokenId, from: user.get("ethAddress"), transactionHash },
    });

    await event.save();
    relation.add(event);
    await user.save();

    return { tokenId, moralis };
  },
);
