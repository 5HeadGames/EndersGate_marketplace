// import hre, {ethers} from "hardhat";
// import {deploy, attach} from "@utils/index";
// import {MockERC20, UniswapV2Pair, UniswapV2Router02, UniswapV2Factory} from "@sctypes/index";
// import {addLiquidity} from "@utils/index";
// import {deployContract} from "ethereum-waffle";

// import UniswapV2Router02Json from "../../artifacts/@uniswap/v2-periphery/contracts/UniswapV2Router02.sol/UniswapV2Router02.json";

// export const uniswapCoreFixture = async () => {
//   const accounts = await hre.ethers.getSigners();
//   const {address: feeReceiver} = hre.ethers.Wallet.createRandom();

//   const usdc = (await deploy(hre, "MockERC20", accounts[0], [])) as MockERC20;
//   const token = (await deploy(hre, "MockERC20", accounts[0], [])) as MockERC20;
//   const factory = (await deploy(hre, "UniswapV2Factory", accounts[0], [
//     feeReceiver,
//   ])) as UniswapV2Factory;

//   return {usdc, token, factory, accounts};
// };

// export const uniswapFixture = async () => {
//   const {usdc, token, factory, accounts} = await uniswapCoreFixture();
//   const amountA = ethers.utils.parseEther("100000"),
//     amountB = ethers.utils.parseEther("10000"); // 1 to ten, each token will be worth 10 usdc

//   const {address: weth} = hre.ethers.Wallet.createRandom();
//   const UniswapV2Library = await (await ethers.getContractFactory("UniswapV2Library")).deploy();
//   const router = (await deployContract(accounts[0], UniswapV2Router02Json, [
//     factory.address,
//     weth,
//   ])) as UniswapV2Router02;
//   //const router = (await (
//   //await ethers.getContractFactory("UniswapV2Router02")
//   //).deploy(factory.address, weth)) as UniswapV2Router02;

//   await factory.createPair(usdc.address, token.address);
//   await addLiquidity({
//     router,
//     tokenA: usdc,
//     tokenB: token,
//     amountA,
//     amountB,
//     signer: accounts[0],
//   });

//   const pair = (await attach(
//     hre,
//     "UniswapV2Pair",
//     await factory.getPair(usdc.address, token.address)
//   )) as UniswapV2Pair;

//   return {factory, pair, token, usdc, router};
// };
