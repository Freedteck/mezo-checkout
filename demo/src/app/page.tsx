import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "../lib/data";
import { Bitcoin, ShoppingCart, X, Info, Package, Truck, ShieldCheck, Zap, Code2, ArrowRight } from "lucide-react";
import { MezoCheckout, type Product } from "@mezo-checkout/core";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [useEscrow, setUseEscrow] = useState(true);
  const SELLER_ADDRESS = "0xb43C9F0F2bb65A37761E7867a6f1903799f45D65";

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Code2 className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-black text-orange-400 tracking-widest uppercase">
              Developer Plugin
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-tight">
            Accept Bitcoin-Native Payments in{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
              Minutes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-[#a0a0a5] font-light leading-relaxed">
            The first self-custodial checkout plugin for the Mezo ecosystem. Enable direct MUSD payments and instant Trove generation with zero configuration.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 font-bold text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center gap-2"
            >
              Test Live Demo <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/mezo-checkout/core"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-white transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" /> View Documentation
            </a>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto mb-32 grid md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white/2 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Optional Escrow</h3>
          <p className="text-[#a0a0a5] leading-relaxed">Protect your buyers with built-in smart contract escrow, or toggle it off for lightning-fast direct P2P MUSD transfers.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/2 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
            <Bitcoin className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Self-Custodial Borrowing</h3>
          <p className="text-[#a0a0a5] leading-relaxed">Users mint MUSD directly from the Mezo Protocol by locking BTC in their own Troves. Zero custodial router risk.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/2 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Zero Configuration</h3>
          <p className="text-[#a0a0a5] leading-relaxed">A beautifully styled, drop-in React component. Fully typed, tightly integrated with Wagmi and RainbowKit.</p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="max-w-4xl mx-auto mb-32">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
            <span className="ml-4 text-xs font-mono text-[#606065]">CheckoutPage.tsx</span>
          </div>
          <div className="p-8 overflow-x-auto">
            <pre className="text-sm font-mono leading-loose">
              <span className="text-pink-500">import</span> {`{ MezoCheckout }`} <span className="text-pink-500">from</span> <span className="text-green-400">"@mezo-checkout/core"</span>;{"\n\n"}
              <span className="text-pink-500">export default function</span> <span className="text-blue-400">Page</span>() {`{`}{"\n"}
              {`  `} <span className="text-pink-500">return</span> ({"\n"}
              {`    <`} <span className="text-blue-400">MezoCheckout</span>{"\n"}
              {`      `} <span className="text-purple-400">product</span> {`={`}{`{`} id: <span className="text-green-400">"1"</span>, price: <span className="text-orange-400">50</span>, name: <span className="text-green-400">"Jacket"</span> {`}`} {`}`}{"\n"}
              {`      `} <span className="text-purple-400">sellerAddress</span> {`=`} <span className="text-green-400">"0xYourWalletAddress"</span>{"\n"}
              {`      `} <span className="text-purple-400">useEscrow</span> {`=`} {`{`}<span className="text-orange-400">true</span>{`}`}{"\n"}
              {`    />`}{"\n"}
              {`  `});{"\n"}
              {`}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div id="demo" className="max-w-7xl mx-auto pt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <div className="hidden sm:block h-px w-24 bg-white/5" />
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full">
            <span className="text-xs font-bold text-[#a0a0a5] uppercase tracking-widest">Escrow Protection</span>
            <button
              onClick={() => setUseEscrow(!useEscrow)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${useEscrow ? 'bg-orange-500' : 'bg-[#303035]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${useEscrow ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group glass-panel border-white/5 rounded-3xl p-6 bg-white/1 hover:border-orange-500/30 transition-all flex flex-col"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 right-4">
                  <span className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-600 rounded-xl font-black text-white shadow-xl">
                    ${product.price}
                  </span>
                </div>
              </div>

              <div className="grow">
                <h3 className="text-xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-[#a0a0a5] font-light leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/50 text-sm font-bold text-white transition-all group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                <ShoppingCart className="w-4 h-4 text-orange-400" />
                Buy Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="glass-panel border-white/10 p-8 rounded-3xl bg-[#0a0a0a]/90 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 text-[#a0a0a5] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Bitcoin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-widest uppercase">
                      Mezo Checkout
                    </h4>
                    <p className="text-[10px] text-[#a0a0a5] uppercase font-bold tracking-[0.2em]">
                      {selectedProduct.name}
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-4">
                  <Info className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-xs text-[#a0a0a5] leading-relaxed">
                    This purchase uses{" "}
                    <span className="text-orange-400 font-bold">
                      Bitcoin-backed MUSD
                    </span>
                    . Pay with MUSD or borrow against your BTC — without ever
                    selling.
                  </p>
                </div>

                <div className="mb-6">
                  <MezoCheckout
                    product={selectedProduct}
                    sellerAddress={SELLER_ADDRESS}
                    useEscrow={useEscrow}
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Package className="w-5 h-5 text-[#a0a0a5]" />
                    <div>
                      <p className="text-[10px] font-black text-white tracking-widest uppercase">
                        {useEscrow ? "Secure Escrow" : "Direct Payment"}
                      </p>
                      <p className="text-xs text-[#a0a0a5]">
                        {useEscrow ? "Funds held until delivery confirmed" : "Funds sent instantly to seller"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Truck className="w-5 h-5 text-[#a0a0a5]" />
                    <div>
                      <p className="text-[10px] font-black text-white tracking-widest uppercase">
                        Bitcoin-Native
                      </p>
                      <p className="text-xs text-[#a0a0a5]">
                        Powered by Mezo & MUSD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center">
        <p className="text-xs text-[#606065]">
          Demo marketplace powered by{" "}
          <span className="text-orange-400">MezoCheckout</span> · Bitcoin-backed
          MUSD payments
        </p>
      </div>
    </main>
  );
}
