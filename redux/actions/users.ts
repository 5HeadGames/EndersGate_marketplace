import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Harmony} from "@harmony-js/core";
import {ChainType} from "@harmony-js/utils";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import MarketplaceContract from "shared/contracts/ClockSale.json";
import {getAddresses, getContract, getContractMetamask, getWeb3} from "@shared/web3";
import * as actionTypes from "../constants";

export const onGetNfts = createAction(actionTypes.GET_NFTS, function prepare() {
  //fetch nfts

  return {
    payload: {},
  };
});

export const onLoginUser = createAsyncThunk(
  actionTypes.LOGIN_USER,
  async function prepare(userData: {email?: string; password?: string; address: string}) {
    console.log(userData);
    const placeholderData = {
      email: "",
      name: "",
      profile_picture: "",
      userStatus: "",
      walletType: "",
      address: (userData as any).address,
      activity: [
        {
          createdAt: new Date().toISOString(),
          type: "login",
        },
      ],
    };
  }
);

export const onUpdateUserCredentials = createAsyncThunk(
  actionTypes.UPDATE_USER_CREDENTIALS,
  async function prepare({
    newEmail,
    oldEmail,
    newPassword,
    oldPassword,
    userPath,
  }: {
    newEmail: string;
    oldEmail: string;
    newPassword: string;
    oldPassword: string;
    userPath: string;
  }) {}
);

export const onUpdateFirebaseUser = createAsyncThunk(
  actionTypes.UPDATE_USER,
  async function prepare({
    userPath,
    updateData,
  }: {
    userPath: string;
    updateData: Partial<User>;
  }) {}
);

export const onUpdateUser = createAction(
  actionTypes.UPDATE_USER,
  function prepare(updateData: Partial<User>) {
    return {payload: updateData};
  }
);

export const onLogout = createAsyncThunk(actionTypes.LOGOUT, async function prepare(user: User) {
  return true;
});

export const onApproveERC1155 = createAsyncThunk(
  actionTypes.APPROVE_NFT,
  async function prepare({
    walletType,
    tx,
  }: {
    walletType: User["walletType"];
    tx: {to: string; from: string};
  }) {
    const {marketplace, endersGate} = getAddresses();
    try {
      console.log("entró");
      if (walletType === "metamask") {
        const web3 = new Web3((window as any).ethereum);
        const erc1155Contract = getContractMetamask("ERC1155", endersGate);
        const txResult = await erc1155Contract.methods.setApprovalForAll(tx.to, true).send({
          from: tx.from,
        });
        console.log(txResult);
      }
    } catch (err) {
      console.log("errorcito", {err});
    }
  }
);

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
