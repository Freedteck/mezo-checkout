import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("ShoplinkEscrow", function () {
  let escrow: Contract;
  let musd: Contract;
  let buyer: Signer;
  let seller: Signer;
  let other: Signer;

  const PRODUCT_ID = "prod_abc123";
  const AMOUNT = ethers.parseUnits("2000", 18); // 2000 MUSD (above 1800 minimum)

  beforeEach(async function () {
    [buyer, seller, other] = await ethers.getSigners();

    // Deploy a mock ERC20 to act as MUSD in tests
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    musd = await MockERC20.deploy("Mock MUSD", "MUSD");
    await musd.waitForDeployment();

    // Mint MUSD to buyer
    await musd["mint(address,uint256)"](
      await buyer.getAddress(),
      ethers.parseUnits("10000", 18),
    );

    // Deploy escrow
    const ShoplinkEscrow = await ethers.getContractFactory("ShoplinkEscrow");
    escrow = await ShoplinkEscrow.deploy(await musd.getAddress());
    await escrow.waitForDeployment();

    // Buyer approves escrow to spend MUSD
    await (musd.connect(buyer) as Contract).approve(
      await escrow.getAddress(),
      ethers.MaxUint256,
    );
  });

  describe("createOrder", function () {
    it("should create a funded order and transfer MUSD to escrow", async function () {
      const tx = await (escrow.connect(buyer) as Contract).createOrder(
        await seller.getAddress(),
        AMOUNT,
        PRODUCT_ID,
      );
      const receipt = await tx.wait();

      // Get orderId from event
      const event = receipt.logs.find(
        (l: { fragment?: { name: string } }) =>
          l?.fragment?.name === "OrderCreated",
      );
      expect(event).to.not.be.undefined;

      const escrowBalance = await (musd as Contract).balanceOf(
        await escrow.getAddress(),
      );
      expect(escrowBalance).to.equal(AMOUNT);
    });

    it("should revert if seller is the zero address", async function () {
      await expect(
        (escrow.connect(buyer) as Contract).createOrder(
          ethers.ZeroAddress,
          AMOUNT,
          PRODUCT_ID,
        ),
      ).to.be.revertedWithCustomError(escrow, "InvalidAddress");
    });

    it("should revert if amount is zero", async function () {
      await expect(
        (escrow.connect(buyer) as Contract).createOrder(
          await seller.getAddress(),
          0,
          PRODUCT_ID,
        ),
      ).to.be.revertedWithCustomError(escrow, "InvalidAmount");
    });
  });

  describe("confirmDelivery", function () {
    let orderId: string;

    beforeEach(async function () {
      const tx = await (escrow.connect(buyer) as Contract).createOrder(
        await seller.getAddress(),
        AMOUNT,
        PRODUCT_ID,
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (l: { fragment?: { name: string } }) =>
          l?.fragment?.name === "OrderCreated",
      );
      orderId = event.args.orderId;
    });

    it("should release MUSD to seller", async function () {
      await (escrow.connect(seller) as Contract).confirmDelivery(orderId);
      const sellerBalance = await (musd as Contract).balanceOf(
        await seller.getAddress(),
      );
      expect(sellerBalance).to.equal(AMOUNT);
    });

    it("should revert if called by non-seller", async function () {
      await expect(
        (escrow.connect(other) as Contract).confirmDelivery(orderId),
      ).to.be.revertedWithCustomError(escrow, "OnlySeller");
    });
  });

  describe("cancelOrder", function () {
    let orderId: string;

    beforeEach(async function () {
      const tx = await (escrow.connect(buyer) as Contract).createOrder(
        await seller.getAddress(),
        AMOUNT,
        PRODUCT_ID,
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (l: { fragment?: { name: string } }) =>
          l?.fragment?.name === "OrderCreated",
      );
      orderId = event.args.orderId;
    });

    it("should return MUSD to buyer on cancel", async function () {
      const balanceBefore = await (musd as Contract).balanceOf(
        await buyer.getAddress(),
      );
      await (escrow.connect(buyer) as Contract).cancelOrder(orderId);
      const balanceAfter = await (musd as Contract).balanceOf(
        await buyer.getAddress(),
      );
      expect(balanceAfter - balanceBefore).to.equal(AMOUNT);
    });

    it("should revert if called by non-buyer", async function () {
      await expect(
        (escrow.connect(other) as Contract).cancelOrder(orderId),
      ).to.be.revertedWithCustomError(escrow, "OnlyBuyer");
    });
  });
});
