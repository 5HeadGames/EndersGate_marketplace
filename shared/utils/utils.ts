import { parseSaleNative, parseSaleTokens } from "@redux/actions";
import {
  getContract,
  getNativeBlockchain,
  onlyAcceptsERC20,
} from "@shared/web3";
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

export const updateSales = async ({ blockchain, shopAddress, setSales }) => {
  try {
    // Use web3 to get the user's accounts.
    const shop = getContract(
      getNativeBlockchain(blockchain)
        ? "ShopFindora"
        : onlyAcceptsERC20(blockchain)
        ? "ShopOnlyMultiToken"
        : "Shop",
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
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }
};

export const FAQS = [
  {
    title: "What are Enders Gate Passes?",
    content:
      "Enders Gate Passes are digital vouchers designed for redeeming specific digital collectibles within the 5HeadGames ecosystem.",
  },
  {
    title: "Why does 5HeadGames use Enders Gate Passes?",
    content:
      "We created the Enders Gate Pass as a practical solution to list tokens on partnered marketplaces such as OpenSea and Rarible. This is necessary because not every marketplace currently supports 1155 tokens on the Polygon blockchain yet, but plan to in the future. In this scenario, OpenSea supports the 721 NFT token standard on the Polygon blockchain, but has not implemented support for the 1155 token standard used by Enders Gate for our Cards and Packs.",
  },
  {
    title:
      "What is the technical reason behind the existence of Enders Gate Passes?",
    content:
      "Enders Gate Passes exist to bridge the gap between the token standards supported by the 5HeadGames ecosystem and those accepted by the OpenSea marketplace. They serve as a workaround, enabling us to seamlessly offer Enders Gate collectibles on OpenSea.",
  },
  {
    title:
      "How do I obtain Enders Gate Card Pass (721) tokens in the first place?",
    content:
      "You can acquire Enders Gate Passes from the OpenSea Marketplace. Follow official Enders Gate channels to ensure you are at the right listing before purchase.",
  },
  {
    title: "I’ve obtained an Enders Gate Card Pass from OpenSea, now what?",
    content:
      "Log in to the 5HeadGames marketplace to exchange your passes for official collectibles from Enders Gate.",
  },
  {
    title: "What purpose do the official collectibles from Enders Gate serve?",
    content:
      "The official collectibles act as digital receipts, proving ownership and enabling users to access additional features within the 5HeadGames platform.",
  },
  {
    title:
      "What is the significance of the numbers 721 and 1155 in relation to the tokens?",
    content:
      "The numbers refer to different token standards. 721 is associated with the Card Pass tokens, while 1155 is the standard for the Trading Card tokens, reflecting their specific functions and use within the platform and game.",
  },
  {
    title:
      "Can you explain the difference between Enders Gate Card Pass (721) tokens and Enders Gate Trading Card (1155) tokens?",
    content:
      "Enders Gate Card Pass (721) tokens may grant access or specific privileges within the 5HeadGames Marketplace, while Enders Gate Trading Card (1155) tokens represent collectible trading cards used in various in-game activities and Marketplaces including the 5HeadGames, OpenSea, and Rarible Marketplaces.",
  },
  {
    title: "What is the purpose of swapping tokens in my 5HeadGames inventory?",
    content:
      "Swapping tokens allows you to convert your Enders Gate Card Pass (721 tokens) to claim official Enders Gate Collectibles (1155 tokens).",
  },
  {
    title:
      "Why do I need to swap my Enders Gate Pass tokens to Enders Gate Trading Card (1155) tokens?",
    content:
      'Virtual collectibles released by 5HeadGames allow users to play with their collection through our original trading card game called "Enders Gate". No purchase is necessary to start playing Enders Gate, simply visit the game, login, and play. The game is available to play on most web browsers on PC. You can also grab the game for free through the Google play store, and iOS Testflight.',
  },
  {
    title:
      "I don’t care for the Passes, How do I purchase virtual collectibles instead?",
    content:
      "You can purchase virtual collectibles from one of three official places:\n\n9.1. Retail prices on the 5HeadGames card shop (https://marketplace.endersgate.gg/shop).\n9.2. Purchase them securely from other collectors through the 5HeadGames marketplace (https://marketplace.endersgate.gg)\n9.3. Purchase them securely from OpenSea, our partnered marketplace (https://opensea.io) Please note, all sales of virtual collectibles on 5HeadGames are final.",
  },
  {
    title: "How do I initiate the 721 to 1155 swap process?",
    content:
      "While logged into the 5HeadGames marketplace, navigate to the relevant section in the Swap section and select “Swap all to ERC1155” to initiate the swap transaction. Note: A small gas fee will be required to execute the transaction.",
  },
  {
    title:
      "How do I select the desired quantity of tokens for the swap process?",
    content:
      "Swapping Individual Passes on the 5HeadGames Marketplace is currently not supported. Instead, you can conveniently select “Swap all to ERC1155” in your inventory to convert any and all Enders Gate passes you currently hold in your wallet to Enders Gate Trading Card tokens.",
  },
  {
    title: "Is there a limit to the number of tokens I can swap at once?",
    content:
      "No. You can swap as many Enders Gate Passes as you have in your inventory in a single swap.",
  },
  {
    title:
      "Are there any fees or costs associated with swapping tokens, and if so, how are they calculated?",
    content:
      "Yes, there’s a small transaction fee in the form of Matic associated with swapping tokens from 721 to 1155. This fee is typically as low as 0.0001 of a penny depending on the network congestion. Review the details to understand the costs involved in the token swap.",
  },
  {
    title:
      "Can I swap tokens at any time, or are there specific periods when the swap process is available?",
    content:
      "You may swap your pass at any time and the swap process will always be available. It is a permanent section within the 5HeadGames marketplace.",
  },
  {
    title: "What benefits or advantages do I gain by swapping my tokens?",
    content:
      "Swapping your Enders Gate Pass tokens allows you to utilize authentic Enders Gate Trading Card (1155) tokens, enabling you to enhance your in-game strategy, unlock special game modes, and potentially engage in the marketplace by renting cards to other players.",
  },
  {
    title:
      "Is there any impact on my in-game experience or progress if I don't swap my tokens?",
    content:
      "Your in-game experience may be limited if you don't swap tokens, as you won't have access to the full range of features associated with Enders Gate Trading Card (1155) tokens, such as adding them to your battle deck or unlocking special game modes reserved for holders of 1155 tokens.",
  },
  {
    title:
      "Do I need to have technical knowledge about NFT token standards to complete the swap process?",
    content:
      "No, you don't need technical knowledge. The swap process is designed to be user-friendly, and the interface should guide you through the steps without requiring deep understanding of NFT token standards. If you get stuck or need help, please create a support ticket in the Enders Gate Discord.",
  },
  {
    title:
      "Are there any security measures in place to protect my tokens during the swap process?",
    content:
      "Yes, the Enders Gate Trading Card Pack and Trading Card smart contracts have been audited by SourceHat (formerly Solidity Finance), a third-party company, to ensure security and reliability in the token swap process. The swap process is straightforward and built to be secure.",
  },
  {
    title:
      "Can I swap tokens using any device, or are there specific system requirements?",
    content:
      "The swap process can be accessible on most devices with internet connectivity using the wallet containing your Enders Gate Passes.",
  },
  {
    title:
      "What is the expected duration for the swap process to be completed?",
    content:
      "The duration may vary depending on network conditions, but typically, the swap process is designed to be relatively quick (As short as a few seconds). Check the Enders Gate Discord for any estimated completion times.",
  },
  {
    title: "Can I track the status of my token swap, and if so, how?",
    content:
      "Yes, by visiting the transaction ID generated and viewing it on the relevant blockchain explorer.",
  },
  {
    title:
      "What happens if I encounter issues or have questions during the swap process? Is there customer support available?",
    content:
      "If you encounter issues, contact us via Email at Support@5headgames.com or create a support ticket in the Enders Gate Discord.",
  },
  {
    title:
      "Is there a tutorial or guide available to help me understand the entire token swap process better?",
    content:
      "Yes, visit the Enders Gate Youtube Channel to view the “Pass Swap tutorial”. Remember to leave a like and comment!",
  },
  {
    title:
      "Are there any other important considerations or details I should be aware of before initiating the token swap?",
    content:
      "Before initiating the swap, review the 5HeadGames terms and services, as well as information about associated fees. Ensure you have a clear understanding of the process to make informed decisions during the swap. Remember, we are here to help via Email at Support@5headgames.com or through a support ticket in the Enders Gate Discord.",
  },
  {
    title: "How do 5HeadGames virtual collectibles affect the environment?",
    content:
      'We mint our virtual collectibles on EVM compatible blockchains, specifically Polygon, SKALE Network, ImmutableX zkevm, and Linea which all use a “proof-of-stake" consensus mechanism. This is more energy efficient than a “proof-of-work” mechanism. As a result, EVM-compatible blockchains, like Polygon and Findora, require less energy to mint virtual collectibles than it does for you to post an image on Instagram. For more information, visit our partners: https://polygon.technology/sustainability.',
  },
  {
    title: "Is a virtual collectible the same thing as cryptocurrency?",
    content:
      'Virtual collectibles and cryptocurrency are generally built using the same type of technology, known as the blockchain, but they aren\'t the same. Each virtual collectible has a digital signature that makes it unique (non-fungible), like owning a piece of art. Cryptocurrencies are "fungible," meaning that each one is worth the same as any other. For example, one Bitcoin is worth one Bitcoin, just like a $1 bill is worth the same as any other $1 bill, whereas one Charizard trading card is not worth the same as any other pokemon card.',
  },
  {
    title: "What is a wallet?",
    content:
      "A wallet is where the virtual collectibles you own are stored. Wallets are like personal storage units located online. And like storage units, each wallet is assigned a unique address where digital goods can be stored. Wallets are secure because each one has unique keys that give the owner access to what's stored in it.",
  },
  {
    title: "Didn't find an answer to your question?",
    content:
      "Email us at Support@5headgames.com with it and we'll get back to you.",
  },
];
