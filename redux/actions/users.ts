import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Harmony} from "@harmony-js/core";
import {ChainType} from "@harmony-js/utils";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import MarketplaceContract from "shared/contracts/ClockSale.json";
import {getAddresses, getContract, getContractMetamask, getWeb3} from "@shared/web3";
import * as actionTypes from "../constants";

export const onSellERC1155 = createAsyncThunk(
  actionTypes.SELL_NFT,
  async function prepare({
    walletType,
    tx,
  }: {
    walletType: User["walletType"];
    tx: {
      from: string;
      tokenId: number | string;
      startingPrice: number | string;
      amount: number | string;
      duration: string;
    };
  }) {
    console.log("será?");
    const {marketplace, endersGate} = getAddresses();
    if (walletType === "metamask") {
      const web3 = getWeb3();
      const marketplaceContract = await getContractMetamask("ClockSale", marketplace);
      console.log(tx, "Tx");
      await marketplaceContract.methods
        .createSale(endersGate, tx.tokenId, tx.startingPrice, tx.amount, 24 * 3600 * 30)
        .send({from: tx.from});
    } else if (walletType === "harmony") {
      const wallet = new HarmonyWallet();
      await wallet.signin();
      const hmy = new Harmony(
        // let's assume we deploy smart contract to this end-point URL
        "https://api.s0.b.hmny.io",
        {
          chainType: ChainType.Harmony,
          chainId: 2,
        }
      );
      let marketplace = hmy.contracts.createContract(MarketplaceContract.abi, endersGate);
      marketplace = wallet.attachToContract(marketplace);
      await marketplace.methods
        .createSale(endersGate, tx.tokenId, tx.startingPrice, tx.amount, 24 * 3600 * 30)
        .send({
          gasPrice: 100000000000,
          gasLimit: 410000,
        });
    }
  }
);

export const onBuyERC1155 = createAsyncThunk(
  actionTypes.BUY_NFT,
  async function prepare({
    walletType,
    tx,
  }: {
    walletType: User["walletType"];
    tx: {
      from: string;
      tokenId: number | string;
      bid: string | number;
      amount: string | number;
    };
  }) {
    const {marketplace, erc1155} = getAddresses();
    if (walletType === "metamask") {
      const web3 = new Web3((window as any).ethereum);
      const marketplaceContract = new web3.eth.Contract(
        MarketplaceContract.abi as AbiItem[],
        marketplace
      );
      await marketplaceContract.methods.buy(tx.tokenId, tx.amount).send({
        from: tx.from,
        value: tx.bid,
      });
    }
  }
);
