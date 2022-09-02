// import hre from "hardhat";
// import {expect} from "chai";
// import {deploy} from "@utils/index";
// import {ClockSaleOwnable, EndersPack} from "@sctypes/index";
// import {mintERC1155} from "@utils/index";
// import {uniswapFixture} from "./uniswap";

// export const shopFixture = async () => {
//   const {token, usdc, router, ...rest} = await uniswapFixture();
//   const accounts = await hre.ethers.getSigners();

//   const shop = (await deploy(hre, "ClockSaleOwnable", accounts[0], [
//     accounts[1].address,
//     usdc.address,
//     router.address,
//     "400",
//     "ClockSaleOwnable",
//     "CAT",
//   ])) as ClockSaleOwnable;
//   const nft = (await deploy(hre, "EndersPack", accounts[0], ["", "", "", ""])) as EndersPack;

//   await shop.setNftAllowed(nft.address, true);

//   return {...rest, shop, nft, usdc, accounts, token, router};
// };

// export const saleFixture = async () => {
//   const {shop, nft, token, accounts, ...rest} = await shopFixture();
//   const priceUSD = 50,
//     amount = 10,
//     duration = 3600 * 24 * 7,
//     tokenId = 1;

//   await mintERC1155(nft, accounts[0], amount, tokenId);
//   await nft.setApprovalForAll(shop.address, true);

//   await expect(
//     shop.createSale(nft.address, [token.address], tokenId, priceUSD, amount, duration, {
//       gasLimit: 23000000,
//     })
//   )
//     .to.emit(nft, "TransferSingle")
//     .withArgs(shop.address, accounts[0].address, tokenId, amount)
//     .to.emit(shop, "SaleCreated")
//     .withArgs(
//       (await shop.tokenIdTracker()).sub(1),
//       amount,
//       priceUSD,
//       duration,
//       accounts[0].address
//     );

//   return {priceUSD, amount, duration, tokenId, shop, nft, token, accounts, ...rest};
// };
