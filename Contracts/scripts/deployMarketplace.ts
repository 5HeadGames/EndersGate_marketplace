import { ethers, network } from "hardhat";
import fs from "fs";
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

  const [SalesFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleMultiTokens"),
    ethers.getSigners(),
  ]);

  console.log("deploy:marketplace");
  const marketplace = await SalesFactory.deploy(
    _accounts[0].address,
    "0xf3cD27813B5ff6ADEA3805DCf181053AC62D6Ec3",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    18,
    OWNER_CUT,
  );

  console.log("setting allowed: marketplace");
  await marketplace.setNftAllowed(data.endersGate, true);
  await marketplace.setNftAllowed(data.pack, true);

  const configData = JSON.stringify(
    {
      ...data,
      marketplace: marketplace.address,
    },
    null,
    2,
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
