import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import {Harmony} from "@harmony-js/core";
import {Messenger} from "@harmony-js/network";
import {ChainType} from "@harmony-js/utils";
import HarmonyWallet from "shared/web3/harmonyWallet";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import MarketplaceContract from "shared/contracts/ClockAuction.json";
import ERC1155 from "shared/contracts/ERC1155.json";
import {getAddresses, getContract} from "@shared/web3";
import {readUser, writeUser} from "shared/firebase";
import * as actionTypes from "../constants";

export const onGetNfts = createAction(actionTypes.GET_NFTS, function prepare() {
  //fetch nfts

  return {
    payload: {},
  };
});

const auth = getAuth();

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
    if (userData.email) {
      try {
        const {user: userAuth} = await signInWithEmailAndPassword(
          auth,
          (userData as any).email,
          (userData as any).password
        );
        const user = await readUser(`users/${userData.address}`);
        return user || placeholderData;
      } catch (err) {
        const {user: userAuth} = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        await writeUser(`users/${(userData as any).address}`, {
          email: userData.email,
          activity: [
            {
              createdAt: new Date().toISOString(),
              type: "login",
            },
          ],
        });
        const user = await readUser(`users/${userData.address}`);

        return user || placeholderData;
      }
    } else {
      const user = await readUser(`users/${(userData as any).address}`);
      if (!user) {
        await writeUser(`users/${(userData as any).address}`, placeholderData as any);
      }
      const newUser = await readUser(`users/${(userData as any).address}`);
      return newUser || placeholderData;
    }
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
  }) {
    const currentAuth = getAuth();
    const credential = await signInWithEmailAndPassword(currentAuth, oldEmail, oldPassword);
    await updateEmail(credential.user, newEmail);
    await updatePassword(credential.user, newPassword);
    await writeUser(userPath, {email: newEmail});
    return {email: newEmail};
  }
);

export const onUpdateFirebaseUser = createAsyncThunk(
  actionTypes.UPDATE_USER,
  async function prepare({
    userPath,
    updateData,
  }: {
    userPath: string;
    updateData: Partial<User>;
  }) {
    try {
      await writeUser(userPath, updateData);
      return updateData;
    } catch (err) {
      return false;
    }
  }
);

export const onUpdateUser = createAction(
  actionTypes.UPDATE_USER,
  function prepare(updateData: Partial<User>) {
    return {payload: updateData};
  }
);

export const onLogout = createAsyncThunk(
  actionTypes.LOGOUT,
  async function prepare(user: User) {
    const auth = getAuth();
    try {
      if (user.email) await signOut(auth);
      else return true;
    } catch (err) {
      console.log({err});
      return false;
    }
    return true;
  }
);

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
      if (walletType === "metamask") {
        const web3 = new Web3((window as any).ethereum);
        const erc1155Contract = getContract('ERC1155', endersGate)
        await erc1155Contract.methods.setApprovalForAll(tx.to, true).send({
          from: tx.from,
        });
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
        let erc1155Contract = hmy.contracts.createContract(ERC1155.abi, endersGate);
        erc1155Contract = wallet.attachToContract(erc1155Contract);
        await erc1155Contract.methods.setApprovalForAll(tx.to, true).send({
          gasPrice: 100000000000,
          gasLimit: 410000,
        });
      } else if (walletType === "wallet_connect") {
      }
    } catch (err) {
      console.log({err});
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
    tx: {from: string; tokenId: number | string; startingPrice: number | string; duration: string};
  }) {
    const {marketplace, endersGate} = getAddresses();
    if (walletType === "metamask") {
      const web3 = new Web3((window as any).ethereum);
      const marketplaceContract = new web3.eth.Contract(
        MarketplaceContract.abi as AbiItem[],
        marketplace
      );

      await marketplaceContract.methods
        .createAuction(endersGate, tx.tokenId, tx.startingPrice, tx.startingPrice, 24 * 3600 * 30)
        .send({
          from: tx.from,
        });
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
        .createAuction(endersGate, tx.tokenId, tx.startingPrice, tx.startingPrice, 24 * 3600 * 30)
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
    tx: {from: string; tokenId: number | string; bid: string | number};
  }) {
    const {marketplace, erc1155} = getAddresses();
    if (walletType === "metamask") {
      const web3 = new Web3((window as any).ethereum);
      const marketplaceContract = new web3.eth.Contract(
        MarketplaceContract.abi as AbiItem[],
        marketplace
      );
      await marketplaceContract.methods.bid(erc1155, tx.tokenId).send({
        from: tx.from,
        value: tx.bid,
      });
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
      let marketplaceContract = hmy.contracts.createContract(MarketplaceContract.abi, erc1155);
      marketplaceContract = wallet.attachToContract(marketplaceContract);
      await marketplaceContract.methods.bid(erc1155, tx.tokenId).send({
        gasPrice: 100000000000,
        gasLimit: 410000,
      });
    } else if (walletType === "wallet_connect") {
    }
  }
);
