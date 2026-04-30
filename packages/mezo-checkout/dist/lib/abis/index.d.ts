export declare const MUSD_ABI: readonly [{
    readonly name: "balanceOf";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
}, {
    readonly name: "allowance";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "spender";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
}, {
    readonly name: "approve";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}, {
    readonly name: "transfer";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}, {
    readonly name: "transferFrom";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}];
export declare const ESCROW_ABI: readonly [{
    readonly name: "createOrder";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "_seller";
        readonly type: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
    }, {
        readonly name: "_productId";
        readonly type: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
    }];
}, {
    readonly name: "confirmDelivery";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "_orderId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "cancelOrder";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "_orderId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "getOrder";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "_orderId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "buyer";
            readonly type: "address";
        }, {
            readonly name: "seller";
            readonly type: "address";
        }, {
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly name: "createdAt";
            readonly type: "uint256";
        }, {
            readonly name: "productId";
            readonly type: "string";
        }];
    }];
}, {
    readonly name: "OrderCreated";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly name: "buyer";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "seller";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly name: "productId";
        readonly type: "string";
    }];
}, {
    readonly name: "OrderCompleted";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly name: "seller";
        readonly type: "address";
    }];
}, {
    readonly name: "OrderCancelled";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly name: "buyer";
        readonly type: "address";
    }];
}];
export declare const ROUTER_ABI: readonly [{
    readonly name: "borrowAndPay";
    readonly type: "function";
    readonly stateMutability: "payable";
    readonly inputs: readonly [{
        readonly name: "_maxFeePercentage";
        readonly type: "uint256";
    }, {
        readonly name: "_borrowAmount";
        readonly type: "uint256";
    }, {
        readonly name: "_payAmount";
        readonly type: "uint256";
    }, {
        readonly name: "_upperHint";
        readonly type: "address";
    }, {
        readonly name: "_lowerHint";
        readonly type: "address";
    }, {
        readonly name: "_seller";
        readonly type: "address";
    }, {
        readonly name: "_productId";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "AtomicOrderCreated";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly name: "buyer";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "seller";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly name: "amount";
        readonly type: "uint256";
    }];
}];
export declare const BORROWER_OPERATIONS_ABI: readonly [{
    readonly name: "openTrove";
    readonly type: "function";
    readonly stateMutability: "payable";
    readonly inputs: readonly [{
        readonly name: "_debtAmount";
        readonly type: "uint256";
    }, {
        readonly name: "_upperHint";
        readonly type: "address";
    }, {
        readonly name: "_lowerHint";
        readonly type: "address";
    }];
    readonly outputs: readonly [];
}];
//# sourceMappingURL=index.d.ts.map