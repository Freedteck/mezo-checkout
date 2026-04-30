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
  "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5",
);

const RPC_URL = "https://rpc.test.mezo.org";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

async function main() {
  if (!PRIVATE_KEY) {
    console.error("No private key");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(
    RPC_URL,
    { chainId: 31611, name: "mezoTestnet" },
    { staticNetwork: true },
  );
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const bal = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(bal)} BTC`);
  if (bal === 0n) {
    console.error("No BTC for gas");
    process.exit(1);
  }

  const artifact = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "artifacts", "ShoplinkRouter.json"),
      "utf8",
    ),
  );
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet,
  );

  // Get nonce & gas price manually so we can broadcast and not wait
  const nonce = await provider.getTransactionCount(wallet.address, "latest");
  const feeData = await provider.getFeeData();
  console.log(`Nonce: ${nonce}, gasPrice: ${feeData.gasPrice}`);

  const tx = await factory.getDeployTransaction(
    BORROWER_OPERATIONS_ADDRESS,
    ESCROW_ADDRESS,
    MUSD_ADDRESS,
  );

  const signedTx = await wallet.sendTransaction({
    ...tx,
    nonce,
    gasLimit: 3_000_000n,
    gasPrice: feeData.gasPrice,
    chainId: 31611,
  });

  console.log(`TX sent: ${signedTx.hash}`);
  console.log("Waiting for 1 confirmation (up to 90s)...");

  const receipt = await Promise.race([
    signedTx.wait(1),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 90_000),
    ),
  ]);

  const addr = receipt.contractAddress;
  console.log(`ShoplinkRouter deployed at: ${addr}`);
  fs.writeFileSync(path.resolve(__dirname, "router_address.txt"), addr);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
