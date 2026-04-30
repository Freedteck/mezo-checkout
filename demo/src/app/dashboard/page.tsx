import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowLeft, Package, CheckCircle2, Box, XCircle, ExternalLink } from "lucide-react";
import {
  useOrders,
  useDashboardOrders,
  useConfirmDelivery,
  useCancelOrder,
} from "@mezo-checkout/core";
import { EXPLORER_URL } from "@mezo-checkout/core";

const SELLER_ADDRESS = "0xb43C9F0F2bb65A37761E7867a6f1903799f45D65";

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { orderHashes } = useOrders();
  const orders = useDashboardOrders(orderHashes);
  const { confirmDelivery, isPending: isConfirming } = useConfirmDelivery();
  const { cancelOrder, isPending: isCanceling } = useCancelOrder();

  // Only the seller (your address) can confirm delivery per the smart contract
  const isSeller =
    address?.toLowerCase() === SELLER_ADDRESS.toLowerCase();

  const handleConfirm = async (orderHash: string) => {
    try {
      await confirmDelivery(orderHash as `0x${string}`);
      alert("Funds released to seller successfully!");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err?.message || "Transaction failed"}`);
    }
  };

  const handleCancel = async (orderHash: string) => {
    try {
      await cancelOrder(orderHash as `0x${string}`);
      alert("Order cancelled. Funds refunded to buyer successfully!");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err?.message || "Transaction failed"}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#a0a0a5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              My{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
                Orders
              </span>
            </h1>
            {isConnected && (
              <p className="text-xs text-[#606065] mt-1">
                {isSeller
                  ? "🟢 Connected as Seller — you can cancel/refund orders"
                  : "🔵 Connected as Buyer — you can confirm deliveries"}
              </p>
            )}
          </div>
          <ConnectButton />
        </div>

        {/* Escrow Explainer */}
        {isConnected && (
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs text-[#a0a0a5] space-y-1">
            <p className="font-bold text-orange-400 uppercase tracking-widest text-[10px]">How Escrow Works</p>
            <p>• <span className="text-white">Buyer</span> places order → MUSD locked in Escrow</p>
            <p>• <span className="text-white">Seller</span> ships the item.</p>
            <p>• <span className="text-white">Buyer</span> confirms delivery upon receipt → MUSD released to Seller</p>
            <p>• <span className="text-white">Seller</span> can cancel before confirmation → MUSD refunded to Buyer</p>
          </div>
        )}

        {!isConnected ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 bg-white/2">
            <Package className="w-12 h-12 text-[#303035] mx-auto mb-4" />
            <p className="text-[#a0a0a5]">Connect your wallet to view your orders.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 bg-white/2">
            <Box className="w-12 h-12 text-[#303035] mx-auto mb-4" />
            <p className="text-[#a0a0a5]">No orders found in this browser session.</p>
            <Link
              to="/"
              className="inline-block mt-4 text-orange-400 hover:text-orange-300"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.hash}
                className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/2"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-white bg-white/10 px-2 py-1 rounded">
                      Order #{order.id}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-orange-400 font-black px-2 py-1 rounded bg-orange-400/10 border border-orange-400/20">
                      {order.status}
                    </span>
                  </div>
                  <a
                    href={`${EXPLORER_URL}/tx/${order.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#a0a0a5] hover:text-orange-400 transition-colors"
                  >
                    View on Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-[#a0a0a5] font-mono mb-4">
                  Tx: {order.hash.slice(0, 18)}...{order.hash.slice(-10)}
                </p>

                <div className="flex gap-3">
                  {/* Buyer confirms delivery → releases funds */}
                  {!isSeller && (
                    <button
                      onClick={() => handleConfirm(order.hash)}
                      disabled={isConfirming}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      {isConfirming ? (
                        "Confirming..."
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Delivery (Release Funds)
                        </>
                      )}
                    </button>
                  )}

                  {/* Seller can cancel to issue refund */}
                  {isSeller && (
                    <button
                      onClick={() => handleCancel(order.hash)}
                      disabled={isCanceling}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 transition-all flex items-center justify-center gap-2"
                    >
                      {isCanceling ? (
                        "Canceling..."
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Cancel Order (Refund Buyer)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
