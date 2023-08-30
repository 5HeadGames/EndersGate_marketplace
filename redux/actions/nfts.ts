/* eslint-disable no-loop-func */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";

import * as actionTypes from "../constants";
import {
  getAddressesMatic,
  getContract,
  getContractCustom,
  getTokensAllowed,
  getAddresses,
  getAddressesFindora,
} from "@shared/web3";
import cards from "../../cards.json";
import {
  CHAIN_NAME_BY_ID,
  MAINNET_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
} from "@shared/components/chains";
import { findSum } from "@shared/components/common/specialFields/SpecialFields";
import { removeAllRent } from "./layout";
import { toast } from "react-hot-toast";

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

export const parseRent = (Rent: any[]) => {
  return {
    seller: Rent[0],
    buyer: Rent[1],
    nft: Rent[2],
    nftId: Rent[3],
    amount: Rent[4],
    price: Rent[5],
    tokens: Rent[6],
    duration: Rent[7],
    startedAt: Rent[8],
    status: Rent[9],
  };
};

export const parseRentNative = (Rent: any[]) => {
  return {
    seller: Rent[0],
    buyer: Rent[1],
    nft: Rent[2],
    nftId: Rent[3],
    amount: Rent[4],
    price: Rent[5],
    duration: Rent[6],
    startedAt: Rent[7],
    status: Rent[8],
  };
};

export const onLoadSales = createAsyncThunk(
  actionTypes.GET_LISTED_NFTS,
  async function prepare() {
    const blockchains =
      process.env.NEXT_PUBLIC_ENV === "production"
        ? MAINNET_CHAIN_IDS
        : TESTNET_CHAIN_IDS;

    let listsCreated = [],
      listsSuccessful = [],
      allSales = [],
      rentsListed = [],
      rentsInRent = [],
      allRents = [],
      rentsFinished = [],
      dailyVolume = 0,
      cardsSold = 0;
    try {
      for (const element of blockchains) {
        const blockchain = element;

        const addresses = getAddresses(CHAIN_NAME_BY_ID[blockchain]);
        console.log(
          addresses,
          addresses.marketplace,
          "addresses",
          CHAIN_NAME_BY_ID[blockchain],
          CHAIN_NAME_BY_ID[blockchain] === "matic"
            ? "ClockSale"
            : "ClockSaleFindora",
        );
        /* SALES */
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

          rawSales.forEach((sale: any[], i) => {
            const saleFormated =
              CHAIN_NAME_BY_ID[blockchain] === "matic"
                ? parseSaleTokens(sale)
                : parseSaleNative(sale);
            allSales.push({
              saleId: i,
              blockchain: CHAIN_NAME_BY_ID[blockchain],
              ...saleFormated,
            });
          });
        }

        /* RENTS */
        if (CHAIN_NAME_BY_ID[blockchain] === "matic") {
          const rent = getContract(
            "Rent",
            addresses.rent,
            CHAIN_NAME_BY_ID[blockchain],
          );
          const lastRent = Number(await rent.methods.tokenIdTracker().call());
          if (lastRent > 0) {
            const rawRents = await rent.methods
              .getRents(new Array(lastRent).fill(0).map((a, i) => i))
              .call();

            rawRents.forEach((sale: any[], i) => {
              const rentFormated = parseRent(sale);
              allRents.push({
                rentId: i,
                rent: true,
                blockchain: CHAIN_NAME_BY_ID[blockchain],
                ...rentFormated,
              });
            });
          }
        } else {
          console.log(addresses);
          const rent = getContract(
            "RentNative",
            addresses.rent,
            CHAIN_NAME_BY_ID[blockchain],
          );
          const lastRent = Number(await rent.methods.tokenIdTracker().call());
          if (lastRent > 0) {
            const rawRents = await rent.methods
              .getRents(new Array(lastRent).fill(0).map((a, i) => i))
              .call();
            console.log(rawRents, "RENTs");

            rawRents.forEach((sale: any[], i) => {
              const rentFormated = parseRentNative(sale);
              allRents.push({
                rentId: i,
                rent: true,
                blockchain: CHAIN_NAME_BY_ID[blockchain],
                ...rentFormated,
              });
            });
          }
        }
      }

      /* SALES */
      const allSalesSorted = allSales
        .sort((a, b) => a.startedAt - b.startedAt)
        .map((sale: Sale, id) => {
          return { id: id, ...sale };
        })
        .concat();

      /* RENTS */
      const allRentsSorted = allRents
        .sort((a, b) => a.startedAt - b.startedAt)
        .map((rent: Sale, id) => {
          return { id: id, ...rent };
        });

      const rentCreatedPartial = allRentsSorted?.filter(
        (sale: Sale) => sale.status === "0",
      );
      const rentInRentPartial = allRentsSorted?.filter(
        (sale: Sale) => sale.status === "1",
      );

      const rentFinishedPartial = allRentsSorted?.filter(
        (sale: Sale) => sale.status === "2",
      );

      rentCreatedPartial.forEach((rent: Sale) => {
        rentsListed = [...rentsListed, rent];
      });

      rentInRentPartial.forEach((rent: Sale) => {
        rentsInRent = [...rentsInRent, rent];
      });

      rentFinishedPartial.forEach((rent: Sale) => {
        rentsFinished = [...rentsFinished, rent];
      });

      const listsCreatedPartial = allSalesSorted
        .concat(allRentsSorted)
        ?.filter(
          (sale: Sale | Rent) =>
            sale.status === "0" &&
            (Math.floor(new Date().getTime() / 1000) <=
              parseInt(sale?.duration) + parseInt(sale?.startedAt) ||
              (sale as Rent).rent),
        );

      const listsSuccessfulPartial = allSalesSorted
        .concat(allRentsSorted)
        ?.filter((sale: Sale) => sale.status === "1");

      listsCreatedPartial.forEach((sale: Sale) => {
        listsCreated = [...listsCreated, sale];
      });

      listsSuccessfulPartial.forEach((sale: Sale) => {
        listsSuccessful = [...listsSuccessful, sale];
      });

      const dailyVolumePartial = getDailyVolume(listsSuccessful);
      const cardsSoldPartial = getCardSold(listsSuccessful);

      dailyVolume += findSum(
        dailyVolume.toString(),
        dailyVolumePartial.toString(),
      ) as any;
      cardsSold = findSum(
        cardsSold.toString(),
        cardsSoldPartial.toString(),
      ) as any;

      return {
        allSales: allSalesSorted,
        saleCreated: listsCreated,
        saleSuccessful: listsSuccessful,
        allRents: allRentsSorted,
        rentsListed,
        rentsInRent,
        rentsFinished,
        totalSales: listsCreated.length,
        dailyVolume: dailyVolume.toString(),
        cardsSold: cardsSold.toString(),
      };
    } catch (err) {
      console.log(err.message, err);
    }
    return {
      allSales: [],
      saleCreated: [],
      saleSuccessful: [],
      allRents: [],
      rentCreated: [],
      rentSuccessfull: [],
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

      const { endersGate, pack, rent } = getAddresses(blockchain);

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
      let balanceWrapped = [];

      const rentContract = getContract("Rent", rent, blockchain);

      balanceWrapped = await rentContract.methods
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
        balanceWrapped: cardsIds.map((id, i) => ({
          id,
          balance: balanceWrapped.length > 0 ? balanceWrapped[i] : 0,
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

export const sellERC1155 = createAsyncThunk(
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

      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  },
);

export const listRentERC1155 = createAsyncThunk(
  actionTypes.LIST_NFT,
  async function prepare(args: {
    from: string;
    tokenId: number | string;
    pricePerDay: number | string;
    tokens: string[];
    address: string;
    provider: any;
    blockchain: any;

    // user: any;
  }) {
    const {
      from,
      tokenId,
      pricePerDay,
      address,
      tokens,
      // user,
      provider,
      blockchain,
    } = args;
    try {
      const { rent } = getAddresses(blockchain);

      const rentContract = getContractCustom("Rent", rent, provider);

      const { transactionHash } = await rentContract.methods
        .createRent(address, tokenId, pricePerDay, tokens)
        .send({ from: from });

      return { from, tokenId, pricePerDay, address };
    } catch (err) {
      console.log({ err });
    }
  },
);

export const listRentERC1155Native = createAsyncThunk(
  actionTypes.LIST_NFT,
  async function prepare(args: {
    from: string;
    tokenId: number | string;
    pricePerDay: number | string;
    address: string;
    provider: any;
    blockchain: any;
  }) {
    const { from, tokenId, pricePerDay, address, provider, blockchain } = args;
    try {
      const { rent } = getAddresses(blockchain);

      const rentContract = getContractCustom("RentNative", rent, provider);

      await rentContract.methods
        .createRent(address, tokenId, pricePerDay)
        .send({ from: from });

      return { from, tokenId, pricePerDay, address };
    } catch (err) {
      console.log({ err });
    }
  },
);

export const buyFromShop = createAsyncThunk(
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

      const shop = await getContractCustom("Shop", shopAddress, provider);
      const tokensAllowed = getTokensAllowed();

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

export const buyFromShopNative = createAsyncThunk(
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

      await shop.methods
        .buyBatch(tokensId, amounts)
        .send({ from: account, value: bid });
    } catch (err) {
      console.log({ err });
    }
    return { account, provider };
  },
);

export const buyERC1155 = createAsyncThunk(
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

export const rentERC1155 = createAsyncThunk(
  actionTypes.RENT_NFT,
  async function prepare(args: {
    seller: string;
    tokenId: number | string;
    token: string;
    bid: string | number;
    daysOfRent: string | number;
    nftContract: string;
    provider: any;
    user: any;
  }) {
    const { seller, tokenId, token, daysOfRent, bid, provider, user } = args;

    try {
      const { rent } = getAddressesMatic();
      const rentContract = getContractCustom("Rent", rent, provider);
      const ERC20 = getContractCustom("ERC20", token, provider);
      const addresses = getTokensAllowed();

      if (
        token === addresses.filter((item) => item.name === "MATIC")[0].address
      ) {
        await rentContract.methods
          .rent(tokenId, daysOfRent, token)
          .send({ from: user, value: bid });
      } else {
        const allowance = await ERC20.methods.allowance(user, rent).call();
        const price = (
          await rentContract.methods.getRatePrice(tokenId, token).call()
        ).mul(daysOfRent);
        if (allowance < price) {
          await ERC20.methods
            .increaseAllowance(
              rent,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: user,
            });
        }
        await rentContract.methods
          .rent(tokenId, daysOfRent, token)
          .send({ from: user });
      }
    } catch (err) {
      console.log({ err });
    }
    return { seller, tokenId, daysOfRent, bid, provider };
  },
);

export const rentBatchERC1155 = createAsyncThunk(
  actionTypes.RENT_BATCH_NFT,
  async function prepare(args: {
    blockchain: string;
    account: any;
    tokenSelected: string;
    provider: any;
    setMessageBuy: any;
    daysOfRent: any;
    cartRent: any[];
    dispatch: any;
  }) {
    const {
      account,
      tokenSelected,
      provider,
      blockchain,
      setMessageBuy,
      daysOfRent,
      cartRent,
      dispatch,
    } = args;

    try {
      const { rent, MATICUSD: NATIVE_TO_USD } = getAddresses(blockchain);

      const rentContract = await getContractCustom("Rent", rent, provider);
      const tokensAllowed = getTokensAllowed();

      setMessageBuy(`Processing your purchase...`);

      const { token, tokensId } = {
        token: tokenSelected,
        tokensId: cartRent.map((item) => item.rentId),
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
          (cartRent
            ?.map((item, i) => {
              return (parseInt(item.price) / 10 ** 6) * daysOfRent;
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
        await rentContract.methods
          .rentBatch(tokensId, daysOfRent, token)
          .send({ from: account, value: price });
      } else {
        const allowance = await ERC20.methods.allowance(account, rent).call();

        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address === tokenSelected)[0]
                .name
            } 1/2`,
          );
          await ERC20.methods
            .increaseAllowance(
              rent,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: account,
            });
          setMessageBuy("Renting your NFT(s) 2/2");
          await rentContract.methods
            .rentBatch(tokensId, daysOfRent, tokenSelected)
            .send({ from: account });
        } else {
          setMessageBuy("Renting your NFT(s)");
          await rentContract.methods
            .rentBatch(tokensId, daysOfRent, tokenSelected)
            .send({ from: account });
        }
      }
      dispatch(onLoadSales());
      dispatch(removeAllRent());
      toast.success("You have rented your NFT(s) successfully");
    } catch (err) {
      console.log({ err });
      setMessageBuy("");
      return { err };
    }
    setMessageBuy("");
    return { account, provider };
  },
);

export const rentBatchERC1155Native = createAsyncThunk(
  actionTypes.RENT_BATCH_NFT,
  async function prepare(args: {
    blockchain: string;
    account: any;
    provider: any;
    setMessageBuy: any;
    daysOfRent: any;
    cartRent: any[];
    dispatch: any;
  }) {
    const {
      account,
      provider,
      blockchain,
      setMessageBuy,
      daysOfRent,
      cartRent,
      dispatch,
    } = args;

    try {
      const { rent } = getAddresses(blockchain);

      const rentContract = await getContractCustom(
        "RentNative",
        rent,
        provider,
      );

      setMessageBuy(`Processing your purchase...`);

      const { tokensId } = {
        tokensId: cartRent.map((item) => item.rentId),
      };

      const price = cartRent
        ?.map((item, i) => {
          return BigInt(item.price) * BigInt(daysOfRent);
        })
        .reduce((item, acc) => {
          return BigInt(item) + BigInt(acc);
        })
        .toString();

      await rentContract.methods
        .rentBatch(tokensId, daysOfRent)
        .send({ from: account, value: price });
      dispatch(onLoadSales());
    } catch (err) {
      console.log({ err });
      setMessageBuy("");
      return { err };
    }
    return { account, provider };
  },
);

export const sellERC1155Findora = createAsyncThunk(
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

      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  },
);

export const buyERC1155Findora = createAsyncThunk(
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
    provider: any;
    user: any;
    blockchain: any;
  }) {
    const { tokenId, provider, user, blockchain } = args;
    // const relation = user.relation("events");

    const { marketplace } = getAddresses(blockchain);
    const marketplaceContract = getContractCustom(
      blockchain === "matic" ? "ClockSale" : "ClockSaleFindora",
      marketplace,
      provider,
    );
    return marketplaceContract.methods.cancelSale(tokenId).send({ from: user });
  },
);

export const cancelRent = createAsyncThunk(
  actionTypes.CANCEL_RENT_NFT,
  async function prepare(args: {
    tokenId: number | string;
    provider: any;
    user: any;
    blockchain: any;
  }) {
    const { tokenId, provider, user, blockchain } = args;
    const { rent } = getAddresses(blockchain);
    const rentContract = getContractCustom("Rent", rent, provider);
    return rentContract.methods.cancelRent(tokenId).send({ from: user });
  },
);

export const redeemRent = createAsyncThunk(
  actionTypes.REDEEM_RENT_NFT,
  async function prepare(args: {
    tokenId: number | string;
    provider: any;
    user: any;
    blockchain: any;
  }) {
    const { tokenId, provider, user, blockchain } = args;
    const { rent } = getAddresses(blockchain);
    const rentContract = getContractCustom("Rent", rent, provider);
    return rentContract.methods.redeemRent(tokenId).send({ from: user });
  },
);
