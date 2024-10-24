import { nFormatter } from "@shared/components/common/specialFields/SpecialFields";
import Web3 from "web3";

export const formatPrice = (price, blockchain, currency = "usdc") => {
  if (price) {
    console.log(price);
    switch (blockchain) {
      case "matic":
        return `${nFormatter(parseInt(price) / 10 ** 6)} USD`;
      case "eth":
        return `${parseFloat(
          Web3.utils.fromWei(price.toString() || "0", "ether"),
        ).toFixed(4)} ETH`;
      case "findora":
        return `${parseFloat(
          Web3.utils.fromWei(price.toString() || "0", "ether"),
        ).toFixed(4)} WFRA`;
      case "imx":
        if (currency == "native") {
          return `${parseFloat(
            Web3.utils.fromWei(price.toString() || "0", "ether"),
          ).toFixed(4)} tIMX`;
        } else {
          return `${nFormatter(parseInt(price) / 10 ** 6)} USDC`;
        }
      case "linea":
        return `${nFormatter((parseInt(price) / 10 ** 6)?.toFixed(4))} USD`;
      case "skl":
        return `${nFormatter((parseInt(price) / 10 ** 6)?.toFixed(4))} USDC`;
    }
  }
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
