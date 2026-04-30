const RPC_URL = "https://rpc.test.mezo.org";
const BORROWER_OPS = "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5";
const ACCOUNT = "0xb43c9f0f2bb65a37761e7867a6f1903799f45d65";

async function rpcCall(method, params) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  return res.json();
}

async function main() {
  console.log("Checking MIN_NET_DEBT from the contract...");
  // 0x6d23eaeb is the selector for MIN_NET_DEBT()
  const debtRes = await rpcCall("eth_call", [{ to: BORROWER_OPS, data: "0x6d23eaeb" }, "latest"]);
  if (debtRes.result) {
    const minDebtHex = debtRes.result;
    const minDebtWei = BigInt(minDebtHex);
    console.log("✅ Actual MIN_NET_DEBT is:", (minDebtWei / 10n**18n).toString(), "MUSD");
  } else {
    console.log("❌ Failed:", debtRes.error);
  }

  console.log("\nSimulating exactly what MetaMask is trying to do...");
  
  // openTrove(uint256,uint256,address,address)
  // selector: 0x1b5d1e43
  // Arg 1: 5000000000000000 (0.5% fee) -> 0000000000000000000000000000000000000000000000000011c37937e08000
  // Arg 2: 2000 * 10^18 -> 00000000000000000000000000000000000000000000000006f05b59d3b20000
  // Arg 3: address(0)
  // Arg 4: address(0)
  const data = "0x1b5d1e430000000000000000000000000000000000000000000000000011c37937e0800000000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  
  // 0.052380 BTC in Wei -> 0xba1ff90c0fd800
  const value = "0xba1ff90c0fd800";

  const simRes = await rpcCall("eth_estimateGas", [{
    from: ACCOUNT,
    to: BORROWER_OPS,
    data: data,
    value: value
  }]);

  if (simRes.error) {
    console.error("❌ Simulation FAILED. The smart contract returned this exact error:\n");
    console.error(simRes.error.message);
  } else {
    console.log("✅ Simulation SUCCEEDED. The transaction is valid! Gas limit estimated:", parseInt(simRes.result, 16));
  }
}

main();
