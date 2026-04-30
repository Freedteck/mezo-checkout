const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config();

// The Mezo Testnet MUSD address you used earlier
const MUSD_ADDRESS = ethers.getAddress(
  "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
);

const RPC_URL = "https://rpc.test.mezo.org";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

async function main() {
  if (!PRIVATE_KEY) {
    console.error("No private key found in .env");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(
    RPC_URL,
    {
      chainId: 31611,
      name: "mezoTestnet",
    },
    { staticNetwork: true },
  );

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(`Deploying with account: ${wallet.address}`);

  const artifactPath = path.resolve(
    __dirname,
    "artifacts",
    "ShoplinkEscrow.json",
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet,
  );

  console.log("Starting ShoplinkEscrow deployment...");
  const contract = await factory.deploy(MUSD_ADDRESS, { gasLimit: 5000000 });

  const tx = contract.deploymentTransaction();
  console.log(`Transaction hash: ${tx.hash}`);

  await tx.wait();
  const address = await contract.getAddress();
  console.log(`\n🎉 ShoplinkEscrow successfully deployed to: ${address}`);
  console.log(`\nPlease update packages/mezo-checkout/src/lib/contracts/addresses.ts with this new address!\n`);
}

main().catch((error) => {
  console.error("Deployment failed:");
  console.error(error);
  process.exit(1);
});
