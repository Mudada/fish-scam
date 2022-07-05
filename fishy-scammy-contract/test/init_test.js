const { expect } = require("chai");

describe("FishyScam contract", function () {
  it("Deployment should not mint anything", async function () {
    const [owner] = await ethers.getSigners();

    const FishyScam = await ethers.getContractFactory("FishyScam");

    const contract = await FishyScam.deploy();

    const ownerBalance = await contract.balanceOf(owner.address, 0);
    expect(ownerBalance).to.equal(0);
  });

  it("Contract URI should be shown", async function () {
    const FishyScam = await ethers.getContractFactory("FishyScam");

    const contract = await FishyScam.deploy();

    const contractURI = await contract.contractURI();
    expect(contractURI).to.equal("https://les-mega.cool/metadata.json");
  });

  it("URI should be shown", async function () {
    const FishyScam = await ethers.getContractFactory("FishyScam");

    const contract = await FishyScam.deploy();

    const contractURI = await contract.uri(0);
    expect(contractURI).to.equal("https://les-mega.cool/{id}.json");
  });
});