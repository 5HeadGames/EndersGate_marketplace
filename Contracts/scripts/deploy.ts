import {ethers, network} from 'hardhat'
import fs from 'fs'
import {ClockAuction} from "../typechain/ClockAuction";
import {ERC1155card} from "../typechain/ERC1155card";

const OWNER_CUT = "400";

async function main() {
  const [AuctionFactory, NftFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockAuction"),
    ethers.getContractFactory("ERC1155card"),
    ethers.getSigners(),
  ]);

  const marketplace = await AuctionFactory.deploy(OWNER_CUT) as ClockAuction
  const nft = await NftFactory.deploy("Darius") as ERC1155card

  const configFileName = `addresses.${network.name}.json`;
  const configData = JSON.stringify({
    marketplace: marketplace.address,
    nft: nft.address,
  }, null, 2);
  fs.writeFileSync(configFileName, configData);
  console.log(`Generated ${configFileName}: ${configData}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
