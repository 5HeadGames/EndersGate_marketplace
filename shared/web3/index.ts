import Web3 from "web3";
import {AbiItem} from "web3-utils";
import axios from "axios";
import contracts from "shared/contracts";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export const loginMetamaskWallet = async () => {
   const provider = await (window as any).ethereum;
   if (!provider) return false;
   await (window as any).ethereum.request({method: "eth_requestAccounts"});
   return new Web3(provider);
};

export const getWalletConnect = () => {
   return new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
   });
};

export const getWeb3 = (provider?: string) => {
   return new Web3(provider ? provider : (window as any).ethereum);
};

export const getContract = (factory: keyof typeof contracts, address: string) => {
   const web3 = getWeb3(process.env.NEXT_PUBLIC_HARMONY_PROVIDER);
   return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractWebSocket = (factory: keyof typeof contracts, address: string) => {
   const web3 = getWeb3(process.env.NEXT_PUBLIC_HARMONY_PROVIDER_WSS);
   return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractMetamask = (factory: keyof typeof contracts, address: string) => {
   const web3 = getWeb3();
   return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getBalance = async (address: string) => {
   const web3 = getWeb3(process.env.NEXT_PUBLIC_HARMONY_PROVIDER);
   const balance = await web3.eth.getBalance(address);
   console.log(web3.utils.fromWei(balance));
   return web3.utils.fromWei(balance).substr(0, web3.utils.fromWei(balance).indexOf(".") + 5);
};

export const getAddresses = () => {
   const testAddresses = require("../../Contracts/addresses.harmony_test.json");
   const addresses = require("../../Contracts/addresses.harmony.json");

   return process.env.NEXT_PUBLIC_HARMONY_PROVIDER === "https://api.harmony.one"
      ? addresses
      : testAddresses;
};
