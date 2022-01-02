import {expect} from "chai";
import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {ClockAuction} from "../typechain/ClockAuction";
import {MockNFT} from "../typechain/MockNFT";

describe("[ClockAuction]", function () {
  let accounts: SignerWithAddress[], marketplace: ClockAuction, nft: MockNFT;

  const OWNER_CUT = "400";

  before(async () => {
    const [AuctionFactory, NftFactory, _accounts] = await Promise.all([
      ethers.getContractFactory("ClockAuction"),
      ethers.getContractFactory("MockNFT"),
      ethers.getSigners(),
    ]);
    accounts = _accounts;

    [marketplace, nft] = await Promise.all([
      AuctionFactory.deploy(OWNER_CUT),
      NftFactory.deploy(),
    ]);
  });

  it("should initialize owner share properly", async () => {
    const ownerCut = await marketplace.ownerCut();
    expect(ownerCut).to.equal(OWNER_CUT);
  });

  it("should throw when sending ether", async () => {
    await expect(
      accounts[0].sendTransaction({
        from: accounts[0].address,
        to: marketplace.address,
        value: ethers.utils.parseEther("1"),
      })
    ).to.be.revertedWith("");
  });

  it("should create an auction properly", async () => {
    await nft.approve(marketplace.address, 1);
    await marketplace.createAuction(
      nft.address,
      1,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      3600
    );
    const auction = await marketplace.getAuction(nft.address, 1);
    expect(auction[0]).to.equal(accounts[0].address);
    expect(auction[1]).to.equal(ethers.utils.parseEther("1"));
    expect(auction[2]).to.equal(ethers.utils.parseEther("1"));
    expect(auction[3]).to.equal(3600);
  });

  it("should bid for an auction", async () => {
    //const oldOwnerBalance = await ethers.provider.getBalance(accounts[0].address);
    //const newOwnerBalance = await ethers.provider.getBalance(accounts[1].address);

    await marketplace
      .connect(accounts[1])
      .bid(nft.address, 1, {value: ethers.utils.parseEther("1.5")});

    const newOwner = await nft.ownerOf(1);
    //const oldOwnerBalance2 = await ethers.provider.getBalance(accounts[0].address);
    //const newOwnerBalance2 = await ethers.provider.getBalance(accounts[1].address);

    await expect(marketplace.getAuction(nft.address, 1)).to.be.revertedWith('');
    expect(newOwner).to.equal(accounts[1].address);
  });

  it('should cancel auction', async () => {
    await nft.approve(marketplace.address, 2);
    await marketplace.createAuction(
      nft.address,
      2,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      3600
    );
    await marketplace.cancelAuction(nft.address, 2);
    await expect(marketplace.getAuction(nft.address, 2)).to.be.revertedWith('');
    expect(await nft.ownerOf(2)).to.equal(accounts[0].address);
  })
});
