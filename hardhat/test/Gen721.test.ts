import { expect } from "chai";
import { ethers } from "hardhat";

describe("Gen721", () => {
  beforeEach(async () => {
    const [owner, user] = await ethers.getSigners();
  });
  it("works", () => {
    console.log("yup");
  });
});
