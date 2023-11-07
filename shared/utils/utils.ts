import { parseSaleNative, parseSaleTokens } from "@redux/actions";
import { getContract, getNativeBlockchain } from "@shared/web3";
import { formatPrice } from "./formatPrice";

/*// NFT SHOP UTILS //*/
export const packsShop = [
  {
    name: "COMMON NFT PACK",
    nameList: "COMMON BOOSTER PACK",
    imageList: "./images/shop/common.png",
    imagePack: "./images/0.png",
    color: "#FFA6FF",
    previousPrice: "$25",
    currentPrice: "$4.99",
    percentageOff: "80% OFF",
    description:
      "This pack contains 5 Cards, Guaranteed 1 Wood, 1 Action Card, 1 Reaction Card, and a 33.33% chance to receive a Stone Rarity Card.",
    index: 0,
  },
  {
    name: "RARE NFT PACK",
    nameList: "RARE BOOSTER PACK",
    imageList: "./images/shop/rare.png",
    imagePack: "./images/1.png",
    color: "#E9D880",
    previousPrice: "$50",
    currentPrice: "$9.99",
    percentageOff: "80% OFF",
    description:
      "This pack contains 5 cards, with guaranteed Stone Rarity Guardians, Action Cards, and Reaction Cards. Plus, there's a 33.33% chance of receiving an Iron or Gold Rarity Guardian Card.",
    index: 1,
  },
  {
    name: "EPIC NFT PACK",
    nameList: "EPIC BOOSTER PACK",
    imageList: "./images/shop/epic.png",
    imagePack: "./images/2.png",
    color: "#7FBADD",
    currentPrice: "$99.99",
    description:
      "This pack contains 5 cards with guaranteed Gold Rarity Guardians, Action Cards, and Reaction Cards. There's a 33.33% chance of receiving a Stone or Iron Rarity Guardian Card and a 20% chance of getting a Legendary Rarity Guardian Card.",
    index: 2,
  },
  {
    name: "LEGENDARY NFT PACK",
    nameList: "LEGENDARY BOOSTER PACK",
    imageList: "./images/shop/legendary.png",
    imagePack: "./images/3.png",
    color: "#8AE98C",
    currentPrice: "$199.99",
    description:
      "This pack contains 5 cards with guaranteed Legendary Rarity Guardians, Gold Cards, and Action Cards. Additionally, you have a 30% chance of receiving a Reaction Card, a 20% chance of obtaining a Stone Rarity Guardian Card, and another 30% chance of getting an Iron Rarity Guardian Card.",
    index: 3,
  },
];

export const updateSales = async ({
  setIsLoading,
  blockchain,
  shopAddress,
  setSales,
  setCounters,
}) => {
  setIsLoading(true);
  try {
    // Use web3 to get the user's accounts.
    const shop = getContract(
      !getNativeBlockchain(blockchain) ? "Shop" : "ShopFindora",
      shopAddress,
      blockchain,
    );

    const lastSale = Number(await shop.methods.tokenIdTracker().call());
    const rawSales = await shop.methods
      .getSales(new Array(lastSale).fill(0).map((a, i) => i))
      .call();

    const allSales = rawSales.map((sale, i) => {
      const saleFormatted = !getNativeBlockchain(blockchain)
        ? parseSaleTokens(sale)
        : parseSaleNative(sale);
      return {
        id: i,
        ...saleFormatted,
      };
    });
    const created = allSales
      .filter((sale) => sale.status === "0")
      .map((sale) => {
        return {
          ...sale,
          ...packsShop[sale.nftId],
          priceText: formatPrice(sale.price, blockchain),
        };
      });

    setSales(created);
    setCounters(created.map(() => 1));
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }
  setIsLoading(false);
};
