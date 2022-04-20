import {expect} from "chai";
import {ethers, network} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type {BigNumber} from "@ethersproject/bignumber";
import type {Block} from "@ethersproject/abstract-provider";
import type {ClockSale, EndersPack} from "../typechain";

import {getLogs} from "../utils";

const SALE_STATUS = {
  created: 0,
  successful: 1,
  cancel: 2,
};

const parseSale = (
  sale: [string, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, number]
) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    duration: sale[5],
    startedAt: sale[6],
    status: sale[7],
  };
};

describe("[ClockSale]", function () {
  let accounts: SignerWithAddress[], marketplace: ClockSale, nft: EndersPack, genesisBlock: number;
  const feeReceiver = ethers.Wallet.createRandom();

  const OWNER_CUT = "400";

  before(async () => {
    const [Sale, NftFactory, _accounts] = await Promise.all([
      ethers.getContractFactory("ClockSale"),
      ethers.getContractFactory("EndersPack"),
      ethers.getSigners(),
    ]);
    const ids = new Array(10).fill(0).map((a, i) => i);
    accounts = _accounts;

    [marketplace, nft] = (await Promise.all([
      Sale.deploy(feeReceiver.address, OWNER_CUT, "ClockSale", "CAT"),
      NftFactory.deploy("", "", "", ""),
    ])) as [ClockSale, EndersPack];

    genesisBlock = await ethers.provider.getBlockNumber();

    await nft.mintBatch(
      accounts[0].address,
      ids,
      ids.map(() => 100),
      []
    );
  });

  describe("Configuration initialization", () => {
    it("should initialize owner", async () => {
      const owner = await marketplace.owner();
      expect(owner).to.equal(accounts[0].address);
    });

    it("should initialize fee receiver share properly", async () => {
      const ownerCut = await marketplace.ownerCut();
      expect(ownerCut).to.equal(OWNER_CUT);
    });

    it("should initialize fee receiver properly", async () => {
      const receiver = await marketplace.feeReceiver();
      expect(receiver).to.equal(feeReceiver.address);
    });

    it("should initialize genesis block", async () => {
      const block = await marketplace.genesisBlock();
      expect(block, "not genesis block").to.be.equal(genesisBlock.toString());
    });

    it("Owner should whitelist nfts", async () => {
      await marketplace.setNftAllowed(nft.address, true);

      expect(await marketplace.isAllowed(nft.address), "Not allowed properly").to.be.equal(true);
      await expect(
        marketplace.connect(accounts[1]).setNftAllowed(nft.address, true),
        "Not owner"
      ).to.be.revertedWith("");
    });

    it("Owner should stop marketplace", async () => {
      expect(await marketplace.paused(), "Stopped at beggining").to.be.equal(false);
      await expect(marketplace.restartTrading(), "restart when not stopped").to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).stopTrading(),
        "not owner should stop trading"
      ).to.be.revertedWith("");

      await marketplace.stopTrading();

      expect(await marketplace.paused(), "should be paused").to.be.equal(true);
      await expect(marketplace.stopTrading(), "trading already stopped").to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).restartTrading(),
        "only owner should restart"
      ).to.be.revertedWith("");

      await marketplace.restartTrading();
      expect(await marketplace.paused(), "should be paused").to.be.equal(false);
    });

    it("Should allow owner to change the fee receiver", async () => {
      const newFeeReceiver = ethers.Wallet.createRandom();
      await marketplace.setFeeReceiver(newFeeReceiver.address);

      expect(await marketplace.feeReceiver()).to.be.equal(newFeeReceiver.address);
      await expect(
        marketplace.connect(accounts[1]).setFeeReceiver(feeReceiver.address)
      ).to.be.revertedWith("");

      await marketplace.setFeeReceiver(feeReceiver.address);
    });

    it("Should allow owner to change the fee", async () => {
      const newOwnerCut = Number(OWNER_CUT) + 100;
      await marketplace.setOwnerCut(newOwnerCut);

      expect((await marketplace.ownerCut()).toNumber()).to.be.equal(newOwnerCut);
      await expect(marketplace.connect(accounts[1]).setOwnerCut(OWNER_CUT)).to.be.revertedWith("");

      await marketplace.setOwnerCut(OWNER_CUT);
    });
  });

  describe("Sale", () => {
    const salesData = [
      {id: 0, price: ethers.utils.parseEther("3.5"), amount: 10, duration: 3600 * 24},
      {id: 2, price: ethers.utils.parseEther("1"), amount: 14, duration: 3600 * 24 * 7},
    ];
    let sales: number[] = [],
      block: Block;

    it("Should create an auction", async () => {
      for await (let currentSale of salesData) {
        const {id, price, amount, duration} = currentSale;

        await nft.setApprovalForAll(marketplace.address, true);
        const tx = await (
          await marketplace.createSale(nft.address, id, price, amount, duration)
        ).wait();

        const logs = getLogs(marketplace.interface, tx);
        const saleId = logs.find(({name}: {name: string}) => name === "SaleCreated")?.args[0];
        sales.push(saleId);

        const sale = parseSale(await marketplace.sales(saleId));
        block = await ethers.provider.getBlock(tx.blockNumber);

        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        expect(sale.price).to.be.equal(price);
        expect(sale.duration).to.be.equal(duration);
        //expect(sale.startedAt).to.be.equal(block.timestamp.toString());
      }
    });

    it("Should get batch sales", async () => {
      const allSales = (await marketplace.getSales(sales)).map((sale: any) => parseSale(sale));
      allSales.forEach((sale: any, i: any) => {
        const {id, amount, price, duration} = salesData[i];
        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        expect(sale.price).to.be.equal(price);
        expect(sale.duration).to.be.equal(duration);
        expect(sale.status).to.be.equal(SALE_STATUS.created);
        //expect(sale.startedAt).to.be.equal(block.timestamp.toString());
      });
    });

    it("Should cancel sales", async () => {
      await expect(
        marketplace.connect(accounts[2]).cancelSale(sales[0]),
        "only owner of sale"
      ).to.be.revertedWith("");

      const prevBalance = await nft.balanceOf(accounts[0].address, salesData[0].id);
      const logs = getLogs(
        marketplace.interface,
        await (await marketplace.cancelSale(sales[0])).wait()
      );
      const saleId = logs.find(({name}: {name: string}) => name === "SaleCancelled")?.args[0];
      const postBalance = await nft.balanceOf(accounts[0].address, salesData[0].id);
      const [singleSale] = await marketplace.getSales([sales[0]]);

      await expect(marketplace.ownerOf(saleId), "not burned sale").to.be.revertedWith("");
      expect(singleSale.status).to.be.equal(SALE_STATUS.cancel);
      expect(prevBalance.add(salesData[0].amount).toString()).to.be.equal(postBalance.toString());
      expect(saleId, "removed wrong sale id").to.be.equal("0");
    });

    it("Should not buy cancelled sales", async () => {
      await expect(marketplace.buy(sales[0], salesData[0].amount)).to.be.revertedWith("");
    });

    it("Should not transfer sales", async () => {
      await expect(
        marketplace.transferFrom(accounts[0].address, accounts[5].address, sales[1])
      ).to.be.revertedWith("");
    });

    it("Should buy sales by given amounts", async () => {
      const amount = 2;
      const cost = salesData[1].price.mul(amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] = await Promise.all([
        await ethers.provider.getBalance(buyer.address),
        await ethers.provider.getBalance(accounts[0].address),
        await ethers.provider.getBalance(feeReceiver.address),
      ]);
      const receipt = await (
        await marketplace.connect(buyer).buy(sales[1], amount, {value: cost})
      ).wait();
      const log = getLogs(marketplace.interface, receipt).find(
        ({name}) => name === "BuySuccessful"
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] = await Promise.all([
        await ethers.provider.getBalance(buyer.address),
        await ethers.provider.getBalance(accounts[0].address),
        await ethers.provider.getBalance(feeReceiver.address),
      ]);
      const feeAmount = cost.div(10000).mul(OWNER_CUT);

      expect(postFeeReceiverBalance.sub(feeReceiverBalance).toString()).to.be.equal(
        feeAmount.toString()
      );
      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString()
      );
      expect(buyerBalance.sub(postBuyerBalance)).to.be.gt(cost.toString());
      expect(log?.args[0].toString(), "Wrong sales id").to.be.equal(sales[1]);
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(cost.toString());
      expect(log?.args[3].toString(), "Wrong nft amount").to.be.equal(String(amount));
    });

    it("Should not buy duration passed sales", async () => {
      const timeSale = {
        id: 2,
        price: ethers.utils.parseEther("1"),
        amount: 14,
        duration: 3600 * 24 * 7,
      };
      await nft.setApprovalForAll(marketplace.address, true);
      const tx = await (
        await marketplace.createSale(
          nft.address,
          timeSale.id,
          timeSale.price,
          timeSale.amount,
          timeSale.duration
        )
      ).wait();
      const logs = getLogs(marketplace.interface, tx);
      const saleId = logs.find(({name}: {name: string}) => name === "SaleCreated")?.args[0];
      sales.push(saleId);

      const sale = parseSale(await marketplace.sales(saleId));

      await network.provider.send("evm_increaseTime", [3600 * 24 * 7 + 100]);
      await network.provider.send("evm_mine");
      await expect(
        marketplace.buy(sales[2], timeSale.amount, {
          value: timeSale.price.mul(timeSale.amount).toString(),
        })
      ).to.be.revertedWith("");
    });
  });
});
