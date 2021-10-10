import { ethers } from "hardhat";
import args from "./arguments";

async function main() {
  const Gen721Factory = await ethers.getContractFactory("Gen721");
  const Gen721 = await Gen721Factory.deploy(args);

  console.log("Gen721 deployed to:", Gen721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
