import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  transport: http('https://rpc.test.mezo.org')
});

const BORROWER_OPS = "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5";

async function main() {
  try {
    const data = await client.readContract({
      address: BORROWER_OPS,
      abi: [{
        name: "MIN_NET_DEBT",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }]
      }],
      functionName: "MIN_NET_DEBT",
    });
    console.log("MIN_NET_DEBT IS:", data.toString());
  } catch (err) {
    console.error("ERROR:", err);
  }
}

main();
