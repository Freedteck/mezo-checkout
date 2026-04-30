const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config();

const MUSD_ADDRESS = ethers.getAddress(
  "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
);
const ESCROW_ADDRESS = ethers.getAddress(
  "0x38D852B2Af85646EF547c8C19103EB44B8150d8D",
);
const BORROWER_OPERATIONS_ADDRESS = ethers.getAddress(
  "0x3d2027396F8948dA01E41bfF8A65f09ab5d21E2",
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
  console.log(`Deploying with address: ${wallet.address}`);

  const artifactPath = path.resolve(
    __dirname,
    "artifacts",
    "ShoplinkRouter.json",
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet,
  );

  console.log("Starting ShoplinkRouter deployment...");
  const contract = await factory.deploy(
    BORROWER_OPERATIONS_ADDRESS,
    ESCROW_ADDRESS,
    MUSD_ADDRESS,
    { gasLimit: 5000000 },
  );

  const tx = contract.deploymentTransaction();
  console.log(`Transaction hash: ${tx.hash}`);

  await tx.wait();
  const address = await contract.getAddress();
  console.log(`ShoplinkRouter deployed to: ${address}`);

  fs.writeFileSync(path.resolve(__dirname, "router_address.txt"), address);
  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error("Deployment failed:");
  console.error(error);
  process.exit(1);
});
