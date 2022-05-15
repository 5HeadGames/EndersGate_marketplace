import {ethers, network} from "hardhat";
import fs from "fs";
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
  const appRoot = require("app-root-path");
  const configFileName = `addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName);
  console.log(data);

  const [SalesFactory, SalesOwnableFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSale"),
    ethers.getContractFactory("ClockSaleOwnable"),
    ethers.getSigners(),
  ]);

  console.log("deploy:marketplace");
  const marketplace = (await SalesFactory.deploy(
    _accounts[0].address,
    OWNER_CUT,
    "EndersClockSale",
    "ECS"
  )) as ClockSale;

  console.log("deploy:marketplaceOwnable");
  const marketplaceOwnable = (await SalesOwnableFactory.deploy(
    _accounts[0].address,
    OWNER_CUT,
    "EndersClockSale",
    "ECS"
  )) as ClockSale;

  console.log("setting allowed: marketplace");
  await marketplace.setNftAllowed(data.endersGate, true);
  await marketplace.setNftAllowed(data.pack, true);

  console.log("setting allowed: marketplaceOwnable");
  await marketplaceOwnable.setNftAllowed(data.endersGate, true);
  await marketplaceOwnable.setNftAllowed(data.pack, true);

  const configData = JSON.stringify(
    {
      ...data,
      marketplace: marketplace.address,
      marketplaceOwnable: marketplaceOwnable.address,
    },
    null,
    2
  );
  fs.writeFileSync(configFileName, configData);
  console.log("SUCCESS", configData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
