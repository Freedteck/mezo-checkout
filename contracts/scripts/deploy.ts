import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ShoplinkEscrow with account:", deployer.address);

  // MUSD contract address on Mezo Testnet
  // Reference: https://docs.mezo.org/developer/contracts
  const MUSD_ADDRESS = "0x7b00DE0923C31943a7cB4b217eFf80F4Fde57F0"; // Mezo Testnet MUSD

  const ShoplinkEscrow = await ethers.getContractFactory("ShoplinkEscrow");
  const escrow = await ShoplinkEscrow.deploy(MUSD_ADDRESS);
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("ShoplinkEscrow deployed to:", address);
  console.log(
    "View on explorer: https://explorer.test.mezo.org/address/" + address,
  );

  console.log("\n✅ Update your .env in the Next.js app:");
  console.log(`NEXT_PUBLIC_ESCROW_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
