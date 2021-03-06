import { parseUnits } from "@ethersproject/units";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Gen721", () => {
  const TOKEN_NAME = "Gen721";
  const TOKEN_SYMBOL = "GEN";
  const BASE_IPFS_URI = "gateway.ipfs.io/ipfs/example/";
  const MINT_PRICE = parseUnits("0.05", "ether");
  const MAX_SUPPLY = 10;
  const MAX_PER_USER = 5;
  let owner, user, user2, user3, Gen721;
  beforeEach(async () => {
    [owner, user, user2, user3] = await ethers.getSigners();
    const Gen721Factory = await ethers.getContractFactory("Gen721");
    Gen721 = await Gen721Factory.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      BASE_IPFS_URI,
      MINT_PRICE,
      MAX_SUPPLY,
      MAX_PER_USER
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
    await Gen721.connect(owner).updateBaseIpfsUri(newBaseIpfsUri);
    const baseIpfsUri = await Gen721.baseIpfsUri();
    expect(baseIpfsUri).to.equal(newBaseIpfsUri);
  });

  it("doesn't update base ipfs uri if not owner", async () => {
    await expect(Gen721.connect(user).updateBaseIpfsUri()).to.be.reverted;
  });

  it("mints token to user", async () => {
    await Gen721.connect(user).mint(1, { value: MINT_PRICE });
    const userBalance = await Gen721.balanceOf(user.address);
    expect(userBalance).to.equal(1);
  });

  it("mints many tokens to user", async () => {
    const numTokens = 5;
    await Gen721.connect(user).mint(numTokens, {
      value: MINT_PRICE.mul(numTokens),
    });
    const userBalance = await Gen721.balanceOf(user.address);
    expect(userBalance).to.equal(numTokens);
  });

  it("doesn't mint tokens for less than mint price", async () => {
    const numTokens = 5;
    await expect(
      Gen721.connect(user).mint(numTokens, {
        value: MINT_PRICE.mul(numTokens - 1),
      })
    ).to.be.reverted;
  });

  it("doesn't allow user to mint more than max per user", async () => {
    const numTokens = 3;
    await Gen721.connect(user).mint(numTokens, {
      value: MINT_PRICE.mul(numTokens),
    });

    await expect(
      Gen721.connect(user).mint(numTokens, {
        value: MINT_PRICE.mul(numTokens),
      })
    ).to.be.reverted;
  });

  it("doesn't allow mint if exceeds max supply", async () => {
    const numTokens = 5;
    await Gen721.connect(user).mint(numTokens, {
      value: MINT_PRICE.mul(numTokens),
    });

    await Gen721.connect(user2).mint(numTokens, {
      value: MINT_PRICE.mul(numTokens),
    });

    await expect(
      Gen721.connect(user3).mint(numTokens, {
        value: MINT_PRICE.mul(numTokens),
      })
    ).to.be.reverted;
  });

  it("returns correct tokenURI", async () => {
    await Gen721.connect(user).mint(1, { value: MINT_PRICE });
    const tokenURI = await Gen721.tokenURI(0);
    expect(tokenURI).to.equal(`${BASE_IPFS_URI}0`);
  });

  it("allows owner to withdraw eth", async () => {
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    const numTokens = 5;
    await Gen721.connect(user).mint(numTokens, {
      value: MINT_PRICE.mul(numTokens),
    });

    await Gen721.connect(owner).withdraw();

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    expect(ownerBalanceAfter).to.gte(
      (await ownerBalanceBefore).add(
        MINT_PRICE.mul(numTokens).sub(parseUnits("0.01", "ether"))
      )
    );
  });

  it("doesn't allow non-owner to withdraw eth", async () => {
    await expect(Gen721.connect(user).withdraw()).to.be.reverted;
  });
});
