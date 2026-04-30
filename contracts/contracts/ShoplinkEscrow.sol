// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ShoplinkEscrow
 * @notice Holds MUSD from a buyer until the seller confirms delivery, then releases it.
 *         If the buyer cancels before confirmation, funds are returned.
 *
 *  Flow:
 *  1. Buyer calls deposit() with the MUSD amount → status = Funded
 *  2. Seller calls confirmDelivery() → status = Completed, MUSD released to seller
 *  3. Buyer calls cancelOrder() (before confirmation) → status = Cancelled, MUSD returned
 */
contract ShoplinkEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State ---

    IERC20 public immutable musd;

    enum Status {
        Pending,
        Funded,
        Completed,
        Cancelled
    }

    struct Order {
        address buyer;
        address seller;
        uint256 amount;
        Status status;
        uint256 createdAt;
        string productId;
    }

    mapping(bytes32 => Order) public orders;

    // --- Events ---

    event OrderCreated(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        string productId
    );
    event OrderFunded(bytes32 indexed orderId);
    event OrderCompleted(bytes32 indexed orderId, address seller);
    event OrderCancelled(bytes32 indexed orderId, address buyer);

    // --- Errors ---

    error InvalidAddress();
    error InvalidAmount();
    error OrderNotFound();
    error OrderNotFunded();
    error OrderAlreadyFunded();
    error OrderAlreadySettled();
    error OnlyBuyer();
    error OnlySeller();

    // --- Constructor ---

    constructor(address _musd) {
        if (_musd == address(0)) revert InvalidAddress();
        musd = IERC20(_musd);
    }

    // --- External Functions ---

    /**
     * @notice Creates and funds an order atomically.
     * @param _seller The merchant's address.
     * @param _amount The price of the item in MUSD (18-decimal precision).
     * @param _productId An off-chain identifier for the product.
     * @return orderId The unique ID for this order.
     */
    function createOrder(
        address _seller,
        uint256 _amount,
        string calldata _productId
    ) external nonReentrant returns (bytes32 orderId) {
        if (_seller == address(0) || _seller == msg.sender) revert InvalidAddress();
        if (_amount == 0) revert InvalidAmount();

        orderId = keccak256(
            abi.encodePacked(msg.sender, _seller, _amount, _productId, block.timestamp, block.prevrandao)
        );

        orders[orderId] = Order({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: Status.Funded,
            createdAt: block.timestamp,
            productId: _productId
        });

        // Transfer MUSD from buyer to this contract
        musd.safeTransferFrom(msg.sender, address(this), _amount);

        emit OrderCreated(orderId, msg.sender, _seller, _amount, _productId);
        emit OrderFunded(orderId);
    }

    /**
     * @notice Buyer confirms that the order has been delivered.
     *         Releases MUSD to the seller.
     */
    function confirmDelivery(bytes32 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        if (order.buyer == address(0)) revert OrderNotFound();
        if (order.status != Status.Funded) revert OrderNotFunded();
        if (msg.sender != order.buyer) revert OnlyBuyer();

        order.status = Status.Completed;
        musd.safeTransfer(order.seller, order.amount);

        emit OrderCompleted(_orderId, order.seller);
    }

    /**
     * @notice Seller cancels the order before delivery is confirmed.
     *         Returns MUSD to the buyer.
     */
    function cancelOrder(bytes32 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        if (order.buyer == address(0)) revert OrderNotFound();
        if (order.status != Status.Funded) revert OrderNotFunded();
        if (msg.sender != order.seller) revert OnlySeller();

        order.status = Status.Cancelled;
        musd.safeTransfer(order.buyer, order.amount);

        emit OrderCancelled(_orderId, order.buyer);
    }

    /**
     * @notice Returns the full order details.
     */
    function getOrder(bytes32 _orderId) external view returns (Order memory) {
        if (orders[_orderId].buyer == address(0)) revert OrderNotFound();
        return orders[_orderId];
    }
}
