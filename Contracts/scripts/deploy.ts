import {ethers, network} from 'hardhat'
import fs from 'fs'
import {ClockSale} from "../typechain/ClockSale";

const OWNER_CUT = "400";

const loadJsonFile = (file: string) => {
    try {
        const data = fs.readFileSync(file);
        return JSON.parse(data as any);
    } catch (err) {
        return {};
    }
};

async function main() {
  const [SalesFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSale"),
    ethers.getSigners(),
  ]);

  const marketplace = await SalesFactory.deploy(_accounts[0].address, OWNER_CUT, "EndersClockSale", "ECS") as ClockSale

  const appRoot = require("app-root-path");
  const configFileName = `addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName)
  const configData = JSON.stringify({
    ...data,
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
