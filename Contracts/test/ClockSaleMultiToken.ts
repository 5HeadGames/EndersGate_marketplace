import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Block } from "@ethersproject/abstract-provider";
import type { ClockSaleMultiTokens, EndersPack, MockERC20 } from "../typechain";
import { getLogs } from "../utils";

const SALE_STATUS = {
  created: 0,
  successful: 1,
  cancel: 2,
};

const parseSale = (
  sale: [string, string, BigNumber, BigNumber, BigNumber, BigNumber, number],
) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    duration: sale[4],
    startedAt: sale[5],
    status: sale[6],
  };
};

describe("[ClockSaleMultiToken]", function () {
  let accounts: SignerWithAddress[],
    marketplace: ClockSaleMultiTokens,
    nft: EndersPack,
    genesisBlock: number,
    nativeToken: MockERC20,
    ERC20Token1: MockERC20,
    ERC20Token2: MockERC20,
    ERC20Token3: MockERC20;

  const feeReceiver = ethers.Wallet.createRandom();

  let sales: number[] = [];

  const OWNER_CUT = "400";

  let salesData: any[];
  let salesData2: any[];

  beforeEach(async () => {
    const [Sale, NftFactory, MockERC20, _accounts] = await Promise.all([
      ethers.getContractFactory("ClockSaleMultiTokens"),
      ethers.getContractFactory("EndersPack"),
      ethers.getContractFactory("MockERC20"),
      ethers.getSigners(),
    ]);
    const ids = new Array(10).fill(0).map((a, i) => i);
    accounts = _accounts;

    nativeToken = await MockERC20.deploy();
    ERC20Token1 = await MockERC20.deploy();
    ERC20Token2 = await MockERC20.deploy();
    ERC20Token3 = await MockERC20.deploy();
    marketplace = await Sale.deploy(
      feeReceiver.address,
      nativeToken.address,
      OWNER_CUT,
      "ClockSaleMultiTokens",
      "CAT",
    );

    genesisBlock = await ethers.provider.getBlockNumber();

    nft = await NftFactory.deploy("", "", "", "");

    marketplace.addToken(ERC20Token1.address);

    sales = [];
    salesData = [
      {
        id: 0,
        prices: [
          ethers.utils.parseEther("3.5"),
          ethers.utils.parseEther("2.5"),
        ],
        tokens: [nativeToken.address, ERC20Token1.address],
        amount: 10,
        duration: 3600 * 24,
      },
      {
        id: 2,
        prices: [ethers.utils.parseEther("1"), ethers.utils.parseEther("0.5")],
        tokens: [nativeToken.address, ERC20Token1.address],
        amount: 14,
        duration: 3600 * 24 * 7,
      },
      {
        id: 3,
        prices: [
          ethers.utils.parseEther("4.4"),
          ethers.utils.parseEther("3.5"),
        ],
        tokens: [nativeToken.address, ERC20Token1.address],
        amount: 13,
        duration: 3600 * 24 * 364,
      },
    ];

    salesData2 = [
      {
        id: 0,
        prices: [
          ethers.utils.parseEther("3.5"),
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("2.5"),
        ],
        tokens: [nativeToken.address, ERC20Token1.address, ERC20Token3.address],
        amount: 10,
        duration: 3600 * 24,
      },
      {
        id: 2,
        prices: [
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("0.5"),
        ],
        tokens: [nativeToken.address, ERC20Token1.address, ERC20Token3.address],
        amount: 14,
        duration: 3600 * 24 * 7,
      },
      {
        id: 3,
        prices: [
          ethers.utils.parseEther("4.4"),
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("3.5"),
        ],
        tokens: [nativeToken.address, ERC20Token1.address, ERC20Token3.address],
        amount: 13,
        duration: 3600 * 24 * 364,
      },
    ];

    await nft.mintBatch(
      accounts[0].address,
      ids,
      ids.map(() => 100),
      [],
    );
    await ERC20Token1.mint(accounts[0].address, ethers.utils.parseEther("100"));
    await ERC20Token1.mint(accounts[1].address, ethers.utils.parseEther("100"));
    await ERC20Token3.mint(accounts[1].address, ethers.utils.parseEther("100"));
    await ERC20Token1.mint(accounts[3].address, ethers.utils.parseEther("100"));
    await marketplace.setNftAllowed(nft.address, true);
  });

  describe("Configuration initialization", () => {
    it("should initialize genesis block", async () => {
      const block = await marketplace.genesisBlock();
      expect(block, "not genesis block").to.be.equal(genesisBlock.toString());
    });
    it("should initialize owner", async () => {
      const owner = await marketplace.owner();
      expect(owner).to.equal(accounts[0].address);
      await marketplace.transferOwnership(accounts[5].address);
      expect(await marketplace.owner()).to.equal(accounts[5].address);
    });

    it("should initialize fee receiver share properly", async () => {
      const ownerCut = await marketplace.ownerCut();
      expect(ownerCut).to.equal(OWNER_CUT);
    });

    it("should initialize fee receiver properly", async () => {
      const receiver = await marketplace.feeReceiver();
      expect(receiver).to.equal(feeReceiver.address);
    });

    it("Owner should whitelist nfts", async () => {
      await marketplace.connect(accounts[0]).setNftAllowed(nft.address, true);

      expect(
        await marketplace.isAllowed(nft.address),
        "Not allowed properly",
      ).to.be.equal(true);
      await expect(
        marketplace.connect(accounts[1]).setNftAllowed(nft.address, true),
        "Not owner",
      ).to.be.revertedWith("");
    });

    it("Owner should stop marketplace", async () => {
      expect(
        await marketplace.connect(accounts[0]).paused(),
        "Stopped at beggining",
      ).to.be.equal(false);
      await expect(
        marketplace.connect(accounts[0]).restartTrading(),
        "restart when not stopped",
      ).to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).stopTrading(),
        "not owner should stop trading",
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[0]).stopTrading();

      expect(
        await marketplace.connect(accounts[0]).paused(),
        "should be paused",
      ).to.be.equal(true);
      await expect(
        marketplace.connect(accounts[0]).stopTrading(),
        "trading already stopped",
      ).to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).restartTrading(),
        "only owner should restart",
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[0]).restartTrading();
      expect(await marketplace.paused(), "should be paused").to.be.equal(false);
    });

    it("Should allow owner to change the fee receiver", async () => {
      const newFeeReceiver = ethers.Wallet.createRandom();
      await marketplace
        .connect(accounts[0])
        .setFeeReceiver(newFeeReceiver.address);

      expect(await marketplace.feeReceiver()).to.be.equal(
        newFeeReceiver.address,
      );
      await expect(
        marketplace.connect(accounts[1]).setFeeReceiver(feeReceiver.address),
      ).to.be.revertedWith("");

      await marketplace
        .connect(accounts[0])
        .setFeeReceiver(feeReceiver.address);
    });

    it("Should allow owner to change the fee", async () => {
      const newOwnerCut = Number(OWNER_CUT) + 100;
      await marketplace.connect(accounts[0]).setOwnerCut(newOwnerCut);

      expect((await marketplace.ownerCut()).toNumber()).to.be.equal(
        newOwnerCut,
      );
      await expect(
        marketplace.connect(accounts[1]).setOwnerCut(OWNER_CUT),
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[0]).setOwnerCut(OWNER_CUT);
    });
  });

  describe("Sale", () => {
    it("Should create an auction", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        const tx = await (
          await marketplace.createSale(
            nft.address,
            id,
            prices,
            tokens,
            amount,
            duration,
          )
        ).wait();
        const logs = getLogs(marketplace.interface, tx);
        const saleId = logs.find(
          ({ name }: { name: string }) => name === "SaleCreated",
        )?.args[0];
        sales.push(saleId);
        const sale = await marketplace.sales(saleId);
        const block = await ethers.provider.getBlock(tx.blockNumber);
        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        expect(sale.duration).to.be.equal(duration);
        expect(sale.startedAt).to.be.equal(block.timestamp.toString());
      }
    });
    it("Should get batch sales", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const allSales = await marketplace.getSales(salesToCheck);
      allSales.forEach((sale: any, i: any) => {
        const { id, amount, prices, tokens, duration } = salesData[i];
        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        for (let i = 0; i < sale.prices.length; i++) {
          expect(sale.prices[i]).to.be.equal(prices[i]);
        }
        for (let i = 0; i < sale.tokens.length; i++) {
          expect(sale.tokens[i]).to.be.equal(tokens[i]);
        }
        expect(sale.duration).to.be.equal(duration);
        expect(sale.status).to.be.equal(SALE_STATUS.created);
      });
    });
    it("Should cancel sales", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      await expect(
        marketplace.connect(accounts[2]).cancelSale(salesToCheck[0]),
        "only owner of sale",
      ).to.be.revertedWith("");
      const prevBalance = await nft.balanceOf(
        accounts[0].address,
        salesData[0].id,
      );
      const logs = getLogs(
        marketplace.interface,
        await (await marketplace.cancelSale(salesToCheck[0])).wait(),
      );
      const saleId = logs.find(
        ({ name }: { name: string }) => name === "SaleCancelled",
      )?.args[0];
      const postBalance = await nft.balanceOf(
        accounts[0].address,
        salesData[0].id,
      );
      const [singleSale] = await marketplace.getSales([salesToCheck[0]]);
      await expect(
        marketplace.ownerOf(saleId),
        "not burned sale",
      ).to.be.revertedWith("");
      expect(singleSale.status).to.be.equal(SALE_STATUS.cancel);
      expect(prevBalance.add(salesData[0].amount).toString()).to.be.equal(
        postBalance.toString(),
      );
      expect(saleId, "removed wrong sale id").to.be.equal("0");
    });
    it("Should not buy cancelled sales", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      await expect(
        marketplace.buy(
          salesToCheck[0],
          salesData[0].amount,
          nativeToken.address,
        ),
      ).to.be.revertedWith("");
    });
    it("Should not transfer sales", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      await expect(
        marketplace.transferFrom(
          accounts[0].address,
          accounts[5].address,
          salesToCheck[1],
        ),
      ).to.be.revertedWith("");
    });
    it("Should buy sales by given amounts", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const amount = 2;
      const cost = salesData[1].prices[0].mul(amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);
      const receipt = await (
        await marketplace
          .connect(buyer)
          .buy(salesToCheck[1], amount, nativeToken.address, { value: cost })
      ).wait();
      const log = getLogs(marketplace.interface, receipt).find(
        ({ name }) => name === "BuySuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);
      const feeAmount = cost.div(10000).mul(OWNER_CUT);
      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());
      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );
      console.log(log?.args, "log");
      expect(buyerBalance.sub(postBuyerBalance)).to.be.gt(cost.toString());
      expect(log?.args[0].toString(), "Wrong sales id").to.be.equal(
        salesToCheck[1].toString(),
      );
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(
        cost.toString(),
      );
      expect(log?.args[4].toString(), "Wrong nft amount").to.be.equal(
        String(amount),
      );
    });
    it("Should buy sales by given amounts with ERC20Token", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);

      const amount = 2;
      const cost = salesData[1].prices[1].mul(amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ERC20Token1.balanceOf(buyer.address),
          await ERC20Token1.balanceOf(accounts[0].address),
          await ERC20Token1.balanceOf(feeReceiver.address),
        ]);
      console.log(cost, buyerBalance, "BALANCE");
      await ERC20Token1.connect(buyer).increaseAllowance(
        marketplace.address,
        cost,
      );
      const receipt = await (
        await marketplace
          .connect(buyer)
          .buy(salesToCheck[1], amount, ERC20Token1.address)
      ).wait();
      const log = getLogs(marketplace.interface, receipt).find(
        ({ name }) => name === "BuySuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await ERC20Token1.balanceOf(buyer.address),
          await ERC20Token1.balanceOf(accounts[0].address),
          await ERC20Token1.balanceOf(feeReceiver.address),
        ]);
      const feeAmount = cost.div(10000).mul(OWNER_CUT);
      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());
      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );
      console.log(log?.args, "log");
      expect(buyerBalance.sub(postBuyerBalance)).to.be.equal(cost.toString());
      expect(log?.args[0].toString(), "Wrong sales id").to.be.equal(
        salesToCheck[1].toString(),
      );
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(
        cost.toString(),
      );
      expect(log?.args[4].toString(), "Wrong nft amount").to.be.equal(
        String(amount),
      );
    });

    it("Should not allow buy sales with ERC20Token3", async () => {
      for await (let currentSale of salesData2) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await expect(
          marketplace.createSale(
            nft.address,
            id,
            prices,
            tokens,
            amount,
            duration,
          ),
        ).to.be.reverted;
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const amount = 2;
      const cost = salesData2[1].prices[2].mul(amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ERC20Token3.balanceOf(buyer.address),
          await ERC20Token3.balanceOf(accounts[0].address),
          await ERC20Token3.balanceOf(feeReceiver.address),
        ]);
      await ERC20Token3.connect(buyer).increaseAllowance(
        marketplace.address,
        cost,
      );
      await expect(
        marketplace
          .connect(buyer)
          .buy(salesToCheck[1], amount, ERC20Token3.address),
      ).to.be.reverted;
    });
    it("Should buy sales with the amount in ERC20Token3", async () => {
      await marketplace.addToken(ERC20Token3.address);
      for await (let currentSale of salesData2) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const amount = 2;
      const cost = salesData2[1].prices[2].mul(amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ERC20Token3.balanceOf(buyer.address),
          await ERC20Token3.balanceOf(accounts[0].address),
          await ERC20Token3.balanceOf(feeReceiver.address),
        ]);
      console.log(cost, buyerBalance, "BALANCE");
      await ERC20Token3.connect(buyer).increaseAllowance(
        marketplace.address,
        cost,
      );
      const receipt = await (
        await marketplace
          .connect(buyer)
          .buy(salesToCheck[1], amount, ERC20Token3.address)
      ).wait();
      const log = getLogs(marketplace.interface, receipt).find(
        ({ name }) => name === "BuySuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await ERC20Token3.balanceOf(buyer.address),
          await ERC20Token3.balanceOf(accounts[0].address),
          await ERC20Token3.balanceOf(feeReceiver.address),
        ]);
      const feeAmount = cost.div(10000).mul(OWNER_CUT);
      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());
      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );
      console.log(log?.args, "log");
      expect(buyerBalance.sub(postBuyerBalance)).to.be.equal(cost.toString());
      expect(log?.args[0].toString(), "Wrong sales id").to.be.equal(
        salesToCheck[1].toString(),
      );
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(
        cost.toString(),
      );
      expect(log?.args[4].toString(), "Wrong nft amount").to.be.equal(
        String(amount),
      );
    });
    it("Should not buy duration passed sales", async () => {
      const timeSale = {
        id: 2,
        prices: [ethers.utils.parseEther("1"), ethers.utils.parseEther("0.5")],
        tokens: [nativeToken.address, ERC20Token1.address],
        amount: 14,
        duration: 3600 * 24 * 7,
      };
      await nft.setApprovalForAll(marketplace.address, true);
      let tx = await (
        await marketplace.createSale(
          nft.address,
          timeSale.id,
          timeSale.prices,
          timeSale.tokens,
          timeSale.amount,
          timeSale.duration,
        )
      ).wait();
      for await (let currentSale of salesData) {
        tx = await (
          await marketplace.createSale(
            nft.address,
            timeSale.id,
            timeSale.prices,
            timeSale.tokens,
            timeSale.amount,
            timeSale.duration,
          )
        ).wait();
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const logs = getLogs(marketplace.interface, tx);
      const saleId = logs.find(
        ({ name }: { name: string }) => name === "SaleCreated",
      )?.args[0];
      sales.push(saleId);
      await network.provider.send("evm_increaseTime", [3600 * 24 * 7 + 100]);
      await network.provider.send("evm_mine");
      console.log(
        timeSale.prices[0].mul(timeSale.amount).toString(),
        "total amount",
      );
      await expect(
        marketplace.buy(salesToCheck[1], timeSale.amount, nativeToken.address, {
          value: timeSale.prices[0].mul(timeSale.amount).toString(),
        }),
      ).to.be.revertedWith("");
    });
  });
  describe("Audit results", () => {
    it("Should emit Sales results", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await expect(
          marketplace.createSale(
            nft.address,
            id,
            prices,
            tokens,
            amount,
            duration,
          ),
        ).to.emit(marketplace, "SaleCreated");
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const buyer = accounts[3];
      const amount = 5;
      const cost = salesData[2].prices[0].mul(amount);
      const extra = cost.add(ethers.utils.parseEther("1"));
      console.log(extra, "extra");
      const originalBalance = await ethers.provider.getBalance(buyer.address);
      await expect(
        marketplace
          .connect(buyer)
          .buy(salesToCheck[2], amount, nativeToken.address, {
            value: extra.toString(),
          }),
      ).to.be.revertedWith("ClockSale:NOT_EXACT_VALUE");
      await expect(
        marketplace
          .connect(buyer)
          .buy(salesToCheck[2], amount, nativeToken.address, {
            value: cost.toString(),
          }),
      )
        .to.emit(marketplace, "BuySuccessful")
        .withArgs(
          salesToCheck[2],
          buyer.address,
          cost,
          nativeToken.address,
          amount,
        );
      const contractBalance = await ethers.provider.getBalance(
        marketplace.address,
      );
      expect(contractBalance, "Contract balance bigger than 0").to.be.equal(0);
    });
    it("Should not leave eth leftovers", async () => {
      for await (let currentSale of salesData) {
        const { id, prices, tokens, amount, duration } = currentSale;
        await nft.setApprovalForAll(marketplace.address, true);
        await marketplace.createSale(
          nft.address,
          id,
          prices,
          tokens,
          amount,
          duration,
        );
      }
      const lastId = await marketplace.tokenIdTracker();
      const salesToCheck = new Array(lastId.toNumber())
        .fill(false)
        .map((a, i) => i);
      const buyer = accounts[3];
      const amount = 5;
      const cost = salesData[2].prices[0].mul(amount);
      const extra = cost.add(ethers.utils.parseEther("1"));
      console.log(extra, "extra");
      const originalBalance = await ethers.provider.getBalance(buyer.address);
      await expect(
        marketplace
          .connect(buyer)
          .buy(salesToCheck[2], amount, nativeToken.address, {
            value: extra.toString(),
          }),
      ).to.be.revertedWith("ClockSale:NOT_EXACT_VALUE");
      await expect(
        marketplace
          .connect(buyer)
          .buy(salesToCheck[2], amount, nativeToken.address, {
            value: cost.toString(),
          }),
      )
        .to.emit(marketplace, "BuySuccessful")
        .withArgs(
          salesToCheck[2],
          buyer.address,
          cost,
          nativeToken.address,
          amount,
        );
      const contractBalance = await ethers.provider.getBalance(
        marketplace.address,
      );
      expect(contractBalance, "Contract balance bigger than 0").to.be.equal(0);
    });

    it("Should be able to emergency withdraw tokens/eth in any case", async () => {
      const lostAmount = ethers.utils.parseEther("2");
      await ERC20Token2.mint(accounts[0].address, lostAmount);
      await ERC20Token2.transfer(marketplace.address, lostAmount);
      await expect(
        marketplace
          .connect(accounts[0])
          .emergencyWithdraw(
            lostAmount,
            ERC20Token2.address,
            accounts[1].address,
          ),
      )
        .to.emit(ERC20Token2, "Transfer")
        .withArgs(marketplace.address, accounts[1].address, lostAmount);
      expect(await ERC20Token2.balanceOf(accounts[1].address)).to.be.equal(
        lostAmount,
      );
    });
  });
});
