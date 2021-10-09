import { parseUnits } from "@ethersproject/units";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Gen721", () => {
  const TOKEN_NAME = "Gen721";
  const TOKEN_SYMBOL = "GEN";
  let owner, user, Gen721;
  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Gen721Factory = await ethers.getContractFactory("Gen721");
    Gen721 = await Gen721Factory.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      "gateway.ipfs.io/ipfs/example/",
      parseUnits("0.05", "ether"),
      5000
    );
  });

  it("sets token name and symbol", async () => {
    const tokenName = await Gen721.name();
    const tokenSymbol = await Gen721.symbol();
    expect(tokenName).to.equal(TOKEN_NAME);
    expect(tokenSymbol).to.equal(TOKEN_SYMBOL);
  });
});
