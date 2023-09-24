import { nFormatter } from "@shared/components/common/specialFields/SpecialFields";
import Web3 from "web3";

export const formatPrice = (price, blockchain) => {
  switch (blockchain) {
    case "matic":
      return `${nFormatter(parseInt(price) / 10 ** 6)} USD`;
    case "eth":
      return `${Web3.utils.fromWei(price.toString() || "0", "ether")} ETH`;
    case "findora":
      return `${Web3.utils.fromWei(price.toString() || "0", "ether")} WFRA`;
    case "imx":
      return `${Web3.utils.fromWei(price.toString() || "0", "ether")} tIMX`;
  }
};
