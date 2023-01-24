import { ethers, network } from "hardhat";
import fs from "fs";
import { ClockSaleOwnable } from "../typechain";
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

  const [SalesOwnableFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleOwnable"),
    ethers.getSigners(),
  ]);

  console.log("deploy:marketplaceOwnable");
  const marketplaceOwnable = (await SalesOwnableFactory.deploy(
    _accounts[0].address,
    "0xf3cd27813b5ff6adea3805dcf181053ac62d6ec3",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    18,
    OWNER_CUT,
  )) as ClockSaleOwnable;

  await marketplaceOwnable.addToken(
    "0x36c9600994524E46068b0F64407ea509218EfFD8",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    6,
  );

  await marketplaceOwnable.addToken(
    "0xBD3045b233bd07a15c8c782ec8702fb5D7Eef163",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    6,
  );

  console.log("setting allowed: marketplaceOwnable");
  await marketplaceOwnable.setNftAllowed(data.endersGate, true);
  await marketplaceOwnable.setNftAllowed(data.pack, true);

  const configData = JSON.stringify(
    {
      ...data,
      marketplaceOwnable: marketplaceOwnable.address,
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
