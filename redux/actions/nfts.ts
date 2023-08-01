/* eslint-disable no-loop-func */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";

import * as actionTypes from "../constants";
import {
  getAddressesMatic,
  getContract,
  getContractCustom,
  createEvent,
  getTokensAllowed,
  getAddresses,
  getAddressesFindora,
} from "@shared/web3";
import cards from "../../cards.json";
import {
  CHAINS,
  CHAIN_IDS_BY_NAME,
  CHAIN_NAME_BY_ID,
  MAINNET_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
} from "@shared/components/chains";
import { useToast } from "@chakra-ui/react";
import { findSum } from "@shared/components/common/specialFields/SpecialFields";

const getCardSold = (successfulSales: Sale[]) => {
  return successfulSales?.reduce(
    (acc, cur) => acc.add(Web3.utils.toBN(cur.amount)),
    Web3.utils.toBN(0),
  );
};

const getDailyVolume = (successfulSales: Sale[]) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  return successfulSales?.reduce((acc, cur) => {
    const started = new Date(Number(cur.startedAt) * 1000).getTime();
    return acc.add(
      started > startOfDay.getTime() && started < endOfDay.getTime()
        ? Web3.utils.toBN(cur.price)
        : Web3.utils.toBN(0),
    );
  }, Web3.utils.toBN(0));
};

export const parseSaleNative = (sale: any[]) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    duration: sale[5],
    startedAt: sale[6],
    status: sale[7],
  };
};

export const parseSaleTokens = (sale: any[]) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    tokens: sale[5],
    duration: sale[6],
    startedAt: sale[7],
    status: sale[8],
  };
};

export const onLoadSales = createAsyncThunk(
  actionTypes.GET_LISTED_NFTS,
  async function prepare() {
    const blockchains =
      process.env.NEXT_PUBLIC_ENV === "production"
        ? MAINNET_CHAIN_IDS
        : TESTNET_CHAIN_IDS;

    let saleCreated = [],
      saleSuccessful = [],
      dailyVolume = 0,
      cardsSold = 0;
    try {
      for (let i = 0; i < blockchains.length; i++) {
        const [blockchain, index] = [blockchains[i], i];
        const addresses = getAddresses(CHAIN_NAME_BY_ID[blockchain]);
        const marketplace = getContract(
          CHAIN_NAME_BY_ID[blockchain] === "matic"
            ? "ClockSale"
            : "ClockSaleFindora",
          addresses.marketplace,
          CHAIN_NAME_BY_ID[blockchain],
        );
        const lastSale = Number(
          await marketplace.methods.tokenIdTracker().call(),
        );

        if (lastSale > 0) {
          const rawSales = await marketplace.methods
            .getSales(new Array(lastSale).fill(0).map((a, i) => i))
            .call();

          const allSales = rawSales.map((sale: any[], i) => {
            const saleFormated =
              CHAIN_NAME_BY_ID[blockchain] === "matic"
                ? parseSaleTokens(sale)
                : parseSaleNative(sale);
            return {
              id: i,
              blockchain: CHAIN_NAME_BY_ID[blockchain],
              ...saleFormated,
            };
          });

          const saleCreatedPartial = allSales?.filter(
            (sale: Sale) => sale.status === "0",
          );
          const saleSuccessfulPartial = allSales?.filter(
            (sale: Sale) => sale.status === "1",
          );
          const dailyVolumePartial = getDailyVolume(saleSuccessful);
          const cardsSoldPartial = getCardSold(saleSuccessful);

          saleCreatedPartial.forEach((sale: Sale) => {
            saleCreated = [...saleCreated, sale];
          });

          saleSuccessfulPartial.forEach((sale: Sale) => {
            saleSuccessful = [...saleSuccessful, sale];
          });

          dailyVolume += dailyVolumePartial.toNumber();
          cardsSold += cardsSoldPartial.toNumber();
        }
      }
      return {
        saleCreated,
        saleSuccessful,
        totalSales: saleCreated.length,
        dailyVolume: dailyVolume.toString(),
        cardsSold: cardsSold.toString(),
      };
    } catch (err) {
      console.log(err.message, "ERROR");
    }
    return {
      saleCreated: [],
      saleSuccessful: [],
      totalSales: 0,
      dailyVolume: 0,
      cardsSold: 0,
    };
  },
);

export const onGetAssets = createAsyncThunk(
  actionTypes.GET_ASSETS,
  async function prepare({ address, blockchain }: any) {
    try {
      if (!address) throw new Error("No address provided");

      const { endersGate, pack } = getAddresses(blockchain);

      const cardsContract = getContract("EndersGate", endersGate, blockchain);
      const packsContract = getContract("EndersPack", pack, blockchain);

      const packsIds = [0, 1, 2, 3];
      const cardsIds = Object.values(cards)
        .reduce((acc: any[], cur) => acc.concat(cur), [])
        .map((card, i) => i);

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

export const onExchangeERC721to1155 = createAsyncThunk(
  actionTypes.EXCHANGE_NFT,
  async function prepare(args: {
    from: string;
    nfts: string[];
    provider: any;
    blockchain: string;
    // user: any;
  }) {
    const {
      from,
      nfts,
      // user,
      provider,
      blockchain,
    } = args;

    try {
      const { exchange } = getAddresses(blockchain);

      const marketplaceContract = getContractCustom(
        "ExchangeERC1155",
        exchange,
        provider,
      );

      const { transactionHash } = await marketplaceContract.methods
        .exchangeAllERC1155(nfts)
        .send({ from: from });

      return { from, nfts };
    } catch (err) {
      console.log({ err });
      return { err };
    }
  },
);

export const onApproveERC1155 = createAsyncThunk(
  actionTypes.EXCHANGE_NFT,
  async function prepare(args: {
    from: string;
    pack: string;
    blockchain: string;
    provider: any;
    // user: any;
  }) {
    const {
      from,
      pack,
      // user,
      provider,
      blockchain,
    } = args;

    const { exchange } = getAddresses(blockchain);
    try {
      const marketplaceContract = getContractCustom(
        "ERC721Seadrop",
        pack,
        provider,
      );

      const { transactionHash } = await marketplaceContract.methods
        .setApprovalForAll(exchange, true)
        .send({ from: from });

      return { from, exchange, pack };
    } catch (err) {
      return { err };
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
    tokens: string[];
    address: string;
    provider: any;
    // user: any;
  }) {
    const {
      from,
      tokenId,
      startingPrice,
      amount,
      duration,
      address,
      tokens,
      // user,
      provider,
    } = args;
    try {
      const { marketplace } = getAddressesMatic();

      const marketplaceContract = getContractCustom(
        "ClockSale",
        marketplace,
        provider,
      );

      const { transactionHash } = await marketplaceContract.methods
        .createSale(address, tokenId, startingPrice, tokens, amount, duration)
        .send({ from: from });

      return { from, tokenId, startingPrice, amount, duration, address };
    } catch (err) {
      console.log({ err });
    }
  },
);

export const onBuyFromShop = createAsyncThunk(
  actionTypes.BUY_NFT_SHOP,
  async function prepare(args: {
    blockchain: string;
    account: string;
    tokenSelected: string;
    provider: any;
    setMessageBuy: any;
    cartShop: any[];
  }) {
    const {
      account,
      tokenSelected,
      provider,
      blockchain,
      setMessageBuy,
      cartShop,
    } = args;

    try {
      const { shop: shopAddress, MATICUSD: NATIVE_TO_USD } =
        getAddresses(blockchain);

      console.log("a1");

      const shop = await getContractCustom("Shop", shopAddress, provider);
      const tokensAllowed = getTokensAllowed();

      console.log("a2");

      setMessageBuy(`Processing your purchase...`);

      const { amounts, token, tokensId } = {
        amounts: cartShop.map((item) => item.quantity),
        token: tokenSelected,
        tokensId: cartShop.map((item) => item.id),
      };

      let price = "0";
      const ERC20 = getContractCustom("ERC20", token, provider);
      const addressesAllowed = getTokensAllowed();
      if (
        tokenSelected ===
        addressesAllowed.filter((item) => item.name === "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom(
          "Aggregator",
          NATIVE_TO_USD,
          provider,
        );
        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        const preprice =
          (cartShop
            ?.map((item, i) => {
              return (parseInt(item.price) / 10 ** 6) * item.quantity;
            })
            .reduce((item, acc) => {
              return item + acc;
            }) *
            10 ** 8) /
          priceMATIC;
        price = Web3.utils.toWei(
          (preprice + preprice * 0.05).toString(),
          "ether",
        );
        await shop.methods
          .buyBatch(tokensId, amounts, token)
          .send({ from: account, value: price });
      } else {
        const allowance = await ERC20.methods
          .allowance(account, shopAddress)
          .call();

        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address === tokenSelected)[0]
                .name
            } 1/2`,
          );
          await ERC20.methods
            .increaseAllowance(
              shopAddress,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: account,
            });
          setMessageBuy("Buying your NFT(s) 2/2");
          await shop.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: account });
        } else {
          setMessageBuy("Buying your NFT(s)");
          await shop.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: account });
        }
      }
    } catch (err) {
      console.log({ err });
      return { err };
    }
    return { account, provider };
  },
);

export const onBuyFromShopNative = createAsyncThunk(
  actionTypes.BUY_NFT_SHOP_FINDORA,
  async function prepare(args: {
    blockchain: string;
    account: string;
    tokenSelected: string;
    provider: any;
    setMessageBuy: any;
    cartShop: any[];
  }) {
    const {
      account,
      tokenSelected,
      provider,
      blockchain,
      setMessageBuy,
      cartShop,
    } = args;

    try {
      const { shop: shopAddress } = getAddresses(blockchain);

      const shop = await getContractCustom(
        "ShopFindora",
        shopAddress,
        provider,
      );
      setMessageBuy(`Processing your purchase...`);

      const { amounts, token, tokensId, bid } = {
        amounts: cartShop.map((item) => item.quantity),
        token: tokenSelected,
        tokensId: cartShop.map((item) => item.id),
        bid: cartShop
          .map((item) => (item.price * item.quantity).toString())
          .reduce((acc, item) => findSum(acc, item)),
      };

      console.log(amounts, token, tokensId, bid);

      await shop.methods
        .buyBatch(tokensId, amounts)
        .send({ from: account, value: bid });
    } catch (err) {
      console.log({ err });
    }
    return { account, provider };
  },
);

export const onBuyERC1155 = createAsyncThunk(
  actionTypes.BUY_NFT,
  async function prepare(args: {
    seller: string;
    tokenId: number | string;
    token: string;
    bid: string | number;
    amount: string | number;
    nftContract: string;
    provider: any;
    user: any;
  }) {
    const { seller, tokenId, token, amount, bid, provider, user } = args;

    try {
      const { marketplace } = getAddressesMatic();
      const marketplaceContract = getContractCustom(
        "ClockSale",
        marketplace,
        provider,
      );
      const ERC20 = getContractCustom("ERC20", token, provider);
      const addresses = getTokensAllowed();
      if (
        token === addresses.filter((item) => item.name === "MATIC")[0].address
      ) {
        await marketplaceContract.methods
          .buy(tokenId, amount, token)
          .send({ from: user, value: bid });
      } else {
        const allowance = await ERC20.methods
          .allowance(user, marketplace)
          .call();
        const price = await marketplaceContract.methods
          .getPrice(tokenId, token, amount)
          .call();
        if (allowance < price) {
          await ERC20.methods
            .increaseAllowance(
              marketplace,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: user,
            });
        }
        await marketplaceContract.methods
          .buy(tokenId, amount, token)
          .send({ from: user });
      }
    } catch (err) {
      console.log({ err });
    }
    return { seller, tokenId, amount, bid, provider };
  },
);

export const onSellERC1155Findora = createAsyncThunk(
  actionTypes.SELL_NFT_FINDORA,
  async function prepare(args: {
    from: string;
    tokenId: number | string;
    startingPrice: number | string;
    amount: number | string;
    duration: string;
    address: string;
    provider: any;
    // user: any;
  }) {
    const {
      from,
      tokenId,
      startingPrice,
      amount,
      duration,
      address,
      // user,
      provider,
    } = args;

    try {
      const { marketplace } = getAddressesFindora();

      const marketplaceContract = getContractCustom(
        "ClockSaleFindora",
        marketplace,
        provider,
      );

      const { transactionHash } = await marketplaceContract.methods
        .createSale(address, tokenId, startingPrice, amount, duration)
        .send({ from: from });

      return { from, tokenId, startingPrice, amount, duration, address };
    } catch (err) {
      console.log({ err });
    }
  },
);

export const onBuyERC1155Findora = createAsyncThunk(
  actionTypes.BUY_NFT_FINDORA,
  async function prepare(args: {
    seller: string;
    tokenId: number | string;
    bid: string | number;
    amount: string | number;
    nftContract: string;
    provider: any;
    user: any;
  }) {
    const { seller, tokenId, amount, bid, provider, user } = args;
    try {
      const { marketplace } = getAddressesFindora();
      const marketplaceContract = getContractCustom(
        "ClockSaleFindora",
        marketplace,
        provider,
      );
      await marketplaceContract.methods
        .buy(tokenId, amount)
        .send({ from: user, value: bid });
    } catch (err) {
      console.log({ err });
    }
    return { seller, tokenId, amount, bid, provider };
  },
);

export const onCancelSale = createAsyncThunk(
  actionTypes.CANCEL_NFT,
  async function prepare(args: {
    tokenId: number | string;
    nftContract: string;
    provider: any;
    user: any;
  }) {
    const { tokenId, provider, user } = args;
    // const relation = user.relation("events");

    const { marketplace } = getAddressesMatic();
    const marketplaceContract = getContractCustom(
      "ClockSale",
      marketplace,
      provider,
    );
    const { transactionHash } = await marketplaceContract.methods
      .cancelSale(tokenId)
      .send({ from: user });

    const event = createEvent({
      type: "cancel",
      metadata: { tokenId, from: user, transactionHash },
    });

    // await event.save();
    // relation.add(event);
    await user.save();

    return { tokenId, provider };
  },
);
