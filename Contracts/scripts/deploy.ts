import {ethers, network} from 'hardhat'
import fs from 'fs'
import {ClockAuction} from "../typechain/ClockAuction";

const OWNER_CUT = "400";

async function main() {
  const [AuctionFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockAuction"),
    ethers.getSigners(),
  ]);

  const marketplace = await AuctionFactory.deploy(OWNER_CUT) as ClockAuction

  const configFileName = `addresses.${network.name}.json`;
  const configData = JSON.stringify({
    marketplace: marketplace.address,
  }, null, 2);
  fs.writeFileSync(configFileName, configData);
  console.log('SUCCESS', configData)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
