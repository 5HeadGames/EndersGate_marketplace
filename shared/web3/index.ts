import Web3 from "web3";
import {AbiItem} from "web3-utils";
import contracts from "shared/contracts";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Moralis from "moralis";

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

export const getContractCustom = (
  factory: keyof typeof contracts,
  address: string,
  provider: any
) => {
  const web3 = getWeb3(provider);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getBalance = async (address: string) => {
  if (!Web3.utils.isAddress(address)) return "0";
  const web3 = getWeb3(process.env.NEXT_PUBLIC_HARMONY_PROVIDER);
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance).substr(0, web3.utils.fromWei(balance).indexOf(".") + 5);
};

export const getAddresses = () => {
  const testAddresses = require("../../Contracts/addresses.harmony_test.json");
  const addresses = require("../../Contracts/addresses.harmony.json");

  return process.env.NEXT_PUBLIC_HARMONY_PROVIDER === "https://api.harmony.one"
    ? addresses
    : testAddresses;
};

export const approveERC1155 = async ({
  provider,
  from,
  to,
  address,
}: {
  provider: any;
  from: string;
  to: string;
  address: string;
}) => {
  const erc1155Contract = getContractCustom("ERC1155", address, provider);
  return await erc1155Contract.methods.setApprovalForAll(to, true).send({
    from: from,
  });
};

// export const approveERC1155Pack = async ({
//    provider,
//    from,
//    to,
//  }: {
//    provider: any;
//    from: string;
//    to: string;
//  }) => {
//    const cntracts = getAddresses();
//    const erc1155Contract = getContractCustom("ERC1155", endersGate, provider);
//    return await erc1155Contract.methods.setApprovalForAll(to, true).send({
//      from,
//    });
//  };

export const createEvent = ({
  type,
  metadata,
}: {
  type: "sell" | "buy" | "login";
  metadata:
  | Object
  | {
    from: string;
    tokenId: string;
    startingPrice: string;
    amount: string;
    duration: string;
    address: string;
  };
}) => {
  const UserEvent = Moralis.Object.extend("UserEvent");
  const sale = new UserEvent();
  sale.set("type", type);
  sale.set("metadata", JSON.stringify(metadata));
  return sale;
};

export const loadSale = async function prepare(tokenId: any) {
  const addresses = getAddresses();
  const marketplace = getContract("ClockSale", addresses.marketplace);
  const sale = await marketplace.methods.sales(tokenId).call();
  return {
    amount: sale.amount,
    duration: sale.duration,
    nft: sale.nft,
    nftId: sale.nftId,
    price: sale.price,
    seller: sale.seller,
    startedAt: sale.startedAt,
    status: sale.status,
  };
};
