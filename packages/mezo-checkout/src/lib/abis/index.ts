export const MUSD_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const ESCROW_ABI = [
  {
    name: "createOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_seller", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_productId", type: "string" },
    ],
    outputs: [{ name: "orderId", type: "bytes32" }],
  },
  {
    name: "confirmDelivery",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_orderId", type: "bytes32" }],
    outputs: [],
  },
  {
    name: "cancelOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_orderId", type: "bytes32" }],
    outputs: [],
  },
  {
    name: "getOrder",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_orderId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "buyer", type: "address" },
          { name: "seller", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "productId", type: "string" },
        ],
      },
    ],
  },
  {
    name: "OrderCreated",
    type: "event",
    inputs: [
      { indexed: true, name: "orderId", type: "bytes32" },
      { indexed: true, name: "buyer", type: "address" },
      { indexed: true, name: "seller", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "productId", type: "string" },
    ],
  },
  {
    name: "OrderCompleted",
    type: "event",
    inputs: [
      { indexed: true, name: "orderId", type: "bytes32" },
      { indexed: false, name: "seller", type: "address" },
    ],
  },
  {
    name: "OrderCancelled",
    type: "event",
    inputs: [
      { indexed: true, name: "orderId", type: "bytes32" },
      { indexed: false, name: "buyer", type: "address" },
    ],
  },
] as const;

export const ROUTER_ABI = [
  {
    name: "borrowAndPay",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_maxFeePercentage", type: "uint256" },
      { name: "_borrowAmount", type: "uint256" },
      { name: "_payAmount", type: "uint256" },
      { name: "_upperHint", type: "address" },
      { name: "_lowerHint", type: "address" },
      { name: "_seller", type: "address" },
      { name: "_productId", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "AtomicOrderCreated",
    type: "event",
    inputs: [
      { indexed: true, name: "orderId", type: "bytes32" },
      { indexed: true, name: "buyer", type: "address" },
      { indexed: true, name: "seller", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
] as const;

export const BORROWER_OPERATIONS_ABI = [
  {
    name: "openTrove",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_debtAmount", type: "uint256" },
      { name: "_upperHint", type: "address" },
      { name: "_lowerHint", type: "address" },
    ],
    outputs: [],
  },
] as const;
