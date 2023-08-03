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

  return (
    typeOfConnection &&
    savedLoginTime &&
    currentTime - parseInt(savedLoginTime) <= TWELVE_HOURS
  );
};

export const multiply = (a, b) => {
  const product = Array(a.length + b.length).fill(0);
  for (let i = a.length; i--; null) {
    let carry = 0;
    for (let j = b.length; j--; null) {
      product[1 + i + j] += carry + a[i] * b[j];
      carry = Math.floor(product[1 + i + j] / 10);
      product[1 + i + j] = product[1 + i + j] % 10;
    }
    product[i] += carry;
  }
  return product.join("").replace(/^0*(\d)/, "$1");
};
