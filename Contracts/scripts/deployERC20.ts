import { ethers, network } from "hardhat";
import fs from "fs";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";

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

  const ERC20Factory = await ethers.getContractFactory("MockERC20");
  const USDC = await ERC20Factory.deploy();
  const BUSD = await ERC20Factory.deploy();
  const configData = JSON.stringify(
    {
      ...data,
      usdc: USDC.address,
      busd: BUSD.address,
    },
    null,
    2,
  );
  fs.writeFileSync(configFileName, configData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
