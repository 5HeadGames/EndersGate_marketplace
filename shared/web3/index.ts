import Web3 from "web3";
import { AbiItem } from "web3-utils";
import contracts from "shared/contracts";
// import Moralis from "moralis";

export const loginMetamaskWallet = async () => {
  const provider = await (window as any).ethereum;
  if (!provider) return false;
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  return new Web3(provider);
};

export const getWeb3 = (provider?: any) => {
  return new Web3(provider ? provider : (window as any).ethereum);
};

export const getContract = (
  factory: keyof typeof contracts,
  address: string,
) => {
  const web3 = getWeb3(process.env.NEXT_PUBLIC_POLYGON_PROVIDER);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractWebSocket = (
  factory: keyof typeof contracts,
  address: string,
) => {
  const web3 = getWeb3(process.env.NEXT_PUBLIC_POLYGON_PROVIDER_WSS);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractMetamask = (
  factory: keyof typeof contracts,
  address: string,
) => {
  const web3 = getWeb3();
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractCustom = (
  factory: keyof typeof contracts,
  address: string,
  provider: any,
) => {
  const web3 = getWeb3(provider);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getBalance = async (address: string) => {
  if (!Web3.utils.isAddress(address)) return "0";
  const web3 = getWeb3(process.env.NEXT_PUBLIC_POLYGON_PROVIDER);
  const balance = await web3.eth.getBalance(address);
  return web3.utils
    .fromWei(balance)
    .substr(0, web3.utils.fromWei(balance).indexOf(".") + 5);
};

export const getAddresses = () => {
  const testAddresses = require("../../Contracts/addresses.mumbai.json");
  const addresses = require("../../Contracts/addresses.matic.json");

  return process.env.NEXT_PUBLIC_CHAIN_ID === "137" ? addresses : testAddresses;
};

export const getAddressesEth = () => {
  const testAddresses = require("../../Contracts/addresses.sepolia.json");
  const addresses = require("../../Contracts/addresses.ethereum.json");

  return process.env.NEXT_PUBLIC_CHAIN_ID === "137" ? addresses : testAddresses;
};

export const getTokensAllowed = () => {
  const testAddresses = require("../../Contracts/tokensAllowed.mumbai.json");
  const addresses = require("../../Contracts/tokensAllowed.matic.json");

  return process.env.NEXT_PUBLIC_CHAIN_ID === "137" ? addresses : testAddresses;
};

export const getTokensAllowedEth = () => {
  const testAddresses = require("../../Contracts/tokensAllowed.sepolia.json");
  const addresses = require("../../Contracts/tokensAllowed.ethereum.json");

  return process.env.NEXT_PUBLIC_CHAIN_ID === "137" ? addresses : testAddresses;
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
  const erc1155Contract = getContractCustom("EndersPack", address, provider);
  console.log(provider, from, to, address);
  console.log(erc1155Contract);
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

export const switchChain = async (network) => {
  await (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: "0x" + parseInt(network).toString(16),
      },
    ],
  });
};

export const createEvent = ({
  type,
  metadata,
}: {
  type: "sell" | "buy" | "login" | "cancel";
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
  return "";
};

export const loadSale = async function prepare(tokenId: any) {
  const addresses = getAddresses();
  const marketplace = getContract("ClockSale", addresses.marketplace);
  const sale = (await marketplace.methods.getSales([tokenId]).call()).map(
    (item) => ({
      seller: item[0],
      nft: item[1],
      nftId: item[2],
      amount: item[3],
      price: item[4],
      tokens: item[5],
      duration: item[6],
      startedAt: item[7],
      status: item[8],
    }),
  )[0];
  return {
    amount: sale.amount,
    duration: sale.duration,
    nft: sale.nft,
    nftId: sale.nftId,
    tokens: sale.tokens,
    price: sale.price,
    seller: sale.seller,
    startedAt: sale.startedAt,
    status: sale.status,
  };
};
