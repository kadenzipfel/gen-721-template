import { parseUnits } from "@ethersproject/units";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Gen721", () => {
  const TOKEN_NAME = "Gen721";
  const TOKEN_SYMBOL = "GEN";
  const BASE_IPFS_URI = "gateway.ipfs.io/ipfs/example/";
  let owner, user, Gen721;
  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Gen721Factory = await ethers.getContractFactory("Gen721");
    Gen721 = await Gen721Factory.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      BASE_IPFS_URI,
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

  it("sets base ipfs uri", async () => {
    const baseIpfsUri = await Gen721.baseIpfsUri();
    expect(baseIpfsUri).to.equal(BASE_IPFS_URI);
  });

  it("sets correct owner", async () => {
    const contractOwner = await Gen721.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("updates ipfs base uri", async () => {
    const newBaseIpfsUri = "gateway.ipfs.io/ipfs/example-new/";
    await Gen721.updateBaseIpfsUri(newBaseIpfsUri);
    const baseIpfsUri = await Gen721.baseIpfsUri();
    expect(baseIpfsUri).to.equal(newBaseIpfsUri);
  });
});
