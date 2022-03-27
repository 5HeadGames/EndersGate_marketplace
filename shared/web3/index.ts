import Web3 from "web3";
import {AbiItem} from 'web3-utils'
import axios from "axios";
import contracts from 'shared/contracts'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";


const mockNftID = [
   "1035205086292954408150852752291366796139603653328",
   "1074393585270093659822352638358841497452891491683",
   "1097565680873894286060297961476270592367211857851",
   "1292446609249280682156328569556144103309955300744",
   "1336294904236467325195956369254877231162447367399",
   "471759442218310714816814885265815693944029715385",
   "536399842574274962853450725471361852429322057371",
];
const NFTSaddress = "0x0d5ea610c7c7ab1b2e5f8a8ae3f1a43384bf8026";

export const getNftsMetadata = async () => {
   //await (window.ethereum as any).request({method: "eth_requestAccounts"});
   const web3 = new Web3(process.env.NEXT_PUBLIC_HARMONY_PROVIDER);
   //address from a test contract on harmony one
   const contract = new web3.eth.Contract(
      contracts['ERC1155'].abi as AbiItem[],
      "0x3e8e62520db86bcdc3beda30fd6362f95f3662ef"
   );

   const ipfsUrl = await Promise.all(mockNftID.map((id) => contract.methods.uri(id).call()));
   const nftsData = (await Promise.all(ipfsUrl.map((url) => axios(url)))).map(
      ({data}) => data
   );

   return nftsData.map((data, i) => ({
      ...data,
      image: `https://ipfs.io/ipfs/${data.image}`,
      id: mockNftID[i],
   }));
};

export const loginHarmonyWallet = async () => {
   const account = await (window as any)?.onewallet.getAccount()
   if (!account)
      return false
   return account
};

export const loginMetamaskWallet = async () => {
   const provider = await (window as any).ethereum
   if (!provider)
      return false
   await (window as any).ethereum.request({method: "eth_requestAccounts"});
   return new Web3(provider)
};

export const getWalletConnect = () => {
   return new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
   });
}

export const getWeb3 = (provider?: string) => {
   return new Web3(provider ? provider : (window as any).ethereum);
}

export const getContract = (factory: keyof typeof contracts, address: string) => {
   const web3 = getWeb3()
   return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address)
}

export const getAddresses = () => {
   const testAddresses = require('../../Contracts/addresses.harmony_test.json')
   const addresses = require('../../Contracts/addresses.harmony.json')

   return process.env.NEXT_PUBLIC_HARMONY_PROVIDER === 'https://api.harmony.one' ? testAddresses : addresses;
}
