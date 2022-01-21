import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import {update} from "firebase/database";
import {Harmony, HarmonyExtension} from "@harmony-js/core";
import {Messenger} from "@harmony-js/network";
import {ChainType, ChainID} from "@harmony-js/utils";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import MarketplaceContract from "shared/contracts/ClockAuction.json";
import ERC1155 from "shared/contracts/ERC1155card.json";
import DeploymentAddresses from "Contracts/addresses.harmony_test.json";
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
        console.log({err});
        const {user: userAuth} = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        await writeUser(`users/${(userData as any).address}`, {
          email: userData.email,
        });
        const user = await readUser(`users/${userData.address}`);
        //writeUser(
        //`users/${userAuth.uid}`,
        //{email: userData.email}
        //);

        return user || placeholderData;
      }
    } else {
      const user = await readUser(`users/${(userData as any).address}`);
      if (!user) {
        await writeUser(`users/${(userData as any).address}`, placeholderData);
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
  actionTypes.BUY_NFT,
  async function prepare({
    walletType,
    tx,
  }: {
    walletType: User["walletType"];
    tx: {to: string; from: string};
  }) {
    const {erc1155} = DeploymentAddresses;
    try {
      if (walletType === "metamask") {
        const web3 = new Web3((window as any).ethereum);
        const erc1155Contract = new web3.eth.Contract(ERC1155.abi as AbiItem[], erc1155);
        await erc1155Contract.methods.setApprovalForAll(tx.to, true).send({
          from: tx.from,
        });
      } else if (walletType === "harmony") {
        const harmonyExt = await new HarmonyExtension((window as any).onewallet);
        const erc1155Contract = harmonyExt.contracts.createContract(ERC1155.abi, erc1155);
        await erc1155Contract.methods.setApprovalForAll(tx.to, true).send({
          gasLimit: "1000001",
          gasPrice: 1000000000,
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
    tx: {from: string; tokenId: number | string; startingPrice: number | string};
  }) {
    const {marketplace, erc1155} = DeploymentAddresses;
    if (walletType === "metamask") {
      const web3 = new Web3((window as any).ethereum);
      const marketplaceContract = new web3.eth.Contract(
        MarketplaceContract.abi as AbiItem[],
        marketplace
      );
      const erc1155Contract = new web3.eth.Contract(ERC1155.abi as AbiItem[], erc1155);

      await marketplaceContract.methods
        .createAuction(erc1155, tx.tokenId, tx.startingPrice, tx.startingPrice, 10000000)
        .send({
          from: tx.from,
        });
    } else if (walletType === "harmony") {
      const harmonyExt = await new HarmonyExtension((window as any).onewallet);
      await harmonyExt.login()
      const marketplaceContract = harmonyExt.contracts.createContract(
        MarketplaceContract.abi,
        marketplace
      );
      await marketplaceContract.methods
        .createAuction(erc1155, tx.tokenId, tx.startingPrice, tx.startingPrice, 10000000)
        .send({
          gasLimit: "1000001",
          gasPrice: 1000000000,
        });
    } else if (walletType === 'wallet_connect') {

    }
  }
);

export const onBuyNFT = createAsyncThunk(
  actionTypes.BUY_NFT,
  async function prepare(tx: {walletType: User["walletType"]; transaction: any}) {}
);
