import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Contract, EventData} from "web3-eth-contract";

import * as actionTypes from "../constants";
import {getAddresses, getContract, getWeb3} from "@shared/web3";
import cards from "../../cards.json";

const getEventsWithTimestamp = async (events: EventData[]) => {
  const web3 = getWeb3();
  return await Promise.all(
    events.map(async (ev) => ({
      ...ev,
      timestamp: (await web3.eth.getBlock(ev.blockNumber)).timestamp,
    }))
  );
};

export const onGetListedSold = createAsyncThunk(
  actionTypes.GET_LISTED_NFTS,
  async function prepare() {
    const addresses = getAddresses();
    const marketplace = getContract("ClockAuction", addresses.marketplace);
    const fromBlock = await marketplace.methods.genesisBlock().call();

    const auctionCreated = (await getEventsWithTimestamp(
      await marketplace.getPastEvents("AuctionCreated", {
        fromBlock,
        toBlock: "latest",
      })
    )).reduce(
      (acc, event) => ({
        ...acc,
        [`${event.returnValues._nftAddress}@${event.returnValues._tokenId}`]: {
          nft: event.returnValues._nftAddress,
          elementId: event.returnValues._tokenId,
          startingPrice: event.returnValues._startingPrice,
          endingPrice: event.returnValues._endingPrice,
          duration: event.returnValues._duration,
          seller: event.returnValues._seller,
          timestamp: event.timestamp
        },
      }),
      {}
    );

    const auctionSuccessfull = (await getEventsWithTimestamp(
      await marketplace.getPastEvents("AuctionSuccessful", {
        fromBlock,
        toBlock: "latest",
      })
    )).map((event) => ({
      nftAddress: event.returnValues._nftAddress,
      tokenId: event.returnValues._tokenId,
      totalPrice: event.returnValues._totalPrice,
      winner: event.returnValues._winner,
      timestamp: event.timestamp,
    }));

    auctionSuccessfull.forEach((auction) => {
      const map = `${auction.nftAddress}@${auction.tokenId}`;
      if (auctionCreated[map]) delete auctionCreated[map];
    });

    (
      await marketplace.getPastEvents("AuctionCancelled", {
        fromBlock,
        toBlock: "latest",
      })
    ).map((event) => {
      const map = `${event.returnValues._nftAddress}@${event.returnValues._tokenId}`;
      if (auctionCreated[map]) delete auctionCreated[map];
    });

    return {
      auctionCreated: Object.values(auctionCreated),
      auctionSuccessfull
    };
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
