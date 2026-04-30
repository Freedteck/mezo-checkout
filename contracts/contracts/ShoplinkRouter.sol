// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBorrowerOperations {
    function openTrove(
        uint256 _musdAmount,
        address _upperHint,
        address _lowerHint
    ) external payable;
}

interface IShoplinkEscrow {
    function createOrder(
        address _seller,
        uint256 _amount,
        string calldata _productId
    ) external returns (bytes32);
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title ShoplinkRouter
 * @dev Facilitates atomic "Borrow & Pay" on Mezo by combining Trove creation and Escrow funding.
 */
contract ShoplinkRouter {
    IBorrowerOperations public borrowerOperations;
    IShoplinkEscrow public escrow;
    IERC20 public musd;

    event AtomicOrderCreated(bytes32 indexed orderId, address indexed buyer, address indexed seller, uint256 amount);

    constructor(address _borrowerOps, address _escrow, address _musd) {
        borrowerOperations = IBorrowerOperations(_borrowerOps);
        escrow = IShoplinkEscrow(_escrow);
        musd = IERC20(_musd);
    }

    /**
     * @notice Opens a Mezo Trove and pays a merchant in one transaction.

     * @param _borrowAmount Total MUSD to borrow (must be >= MIN_NET_DEBT)
     * @param _payAmount MUSD to send to the merchant/escrow
     * @param _upperHint Hint for trove insertion (Liquity param)
     * @param _lowerHint Hint for trove insertion (Liquity param)
     * @param _seller The merchant's address
     * @param _productId The product identifier
     */
    function borrowAndPay(
        uint256 _borrowAmount,
        uint256 _payAmount,
        address _upperHint,
        address _lowerHint,
        address _seller,
        string calldata _productId
    ) external payable {
        require(msg.value > 0, "Collateral required");
        require(_borrowAmount >= _payAmount, "Borrow amount too low for payment");

        // 1. Open the Trove on Mezo
        // This contract will become the owner of the Trove.
        borrowerOperations.openTrove{value: msg.value}(
            _borrowAmount,
            _upperHint,
            _lowerHint
        );

        // 2. Approve Escrow to spend the required MUSD
        musd.approve(address(escrow), _payAmount);

        // 3. Create the order in Escrow
        bytes32 orderId = escrow.createOrder(_seller, _payAmount, _productId);

        // 4. Send remaining MUSD to the user
        uint256 remaining = musd.balanceOf(address(this));
        if (remaining > 0) {
            musd.transfer(msg.sender, remaining);
        }

        emit AtomicOrderCreated(orderId, msg.sender, _seller, _payAmount);
    }

    // Allow receiving BTC (from borrowerOperations refunds or native BTC)
    receive() external payable {}
}
