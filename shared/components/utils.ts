import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";

export function getName(connector: any) {
  if (connector instanceof MetaMask) return "MetaMask";
  if (connector instanceof WalletConnect) return "WalletConnect";
  if (connector instanceof CoinbaseWallet) return "Coinbase Wallet";
  if (connector instanceof Network) return "Network";
  if (connector instanceof GnosisSafe) return "Gnosis Safe";
  return "Unknown";
}

export const authStillValid = () => {
  const typeOfConnection = localStorage.getItem("typeOfConnection");
  const savedLoginTime = localStorage.getItem("loginTime");
  const currentTime = new Date().getTime();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;

  console.log(typeOfConnection, savedLoginTime);

  return (
    typeOfConnection &&
    savedLoginTime &&
    currentTime - parseInt(savedLoginTime) <= TWELVE_HOURS
  );
};

export const getExchangeType = (balanceEG: any) => {
  if (parseInt(balanceEG.Ultraman) > 0) {
    if (parseInt(balanceEG.Bemular) > 0) {
      return 1;
    }
    return 2;
  } else {
    if (parseInt(balanceEG.Bemular) > 0) {
      return 3;
    }
  }
  return 0;
};

export const menuElements = (showEG, setShowEG) => [
  {
    name: "Card Pass Swap",
    image: "/images/swap/cardIcon.png",
    active: showEG === true,
    onClick: () => {
      setShowEG(true);
    },
  },
  {
    name: "Pack Pass Swap",
    image: "/images/swap/PackIcon.png",
    active: showEG === false,
    onClick: () => {
      setShowEG(false);
    },
  },
  {
    name: "Visit OPENSEA",
    image: "/images/swap/opensea_white.png",
    link: `https://testnets.opensea.io/0xc2B8Abc5249397DB5d159b4E3c311c2fAf4091f2`,
  },
];
