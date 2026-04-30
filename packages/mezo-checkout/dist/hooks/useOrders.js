"use client";
import { useState, useEffect, useCallback } from "react";
export function useOrders() {
    const [orderHashes, setOrderHashes] = useState([]);
    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("shoplink_orders");
        if (saved) {
            try {
                setOrderHashes(JSON.parse(saved));
            }
            catch (e) {
                console.error("Failed to parse saved orders", e);
            }
        }
    }, []);
    const addOrder = useCallback((hash) => {
        setOrderHashes((prev) => {
            const next = [hash, ...prev].slice(0, 50); // Keep last 50
            localStorage.setItem("shoplink_orders", JSON.stringify(next));
            return next;
        });
    }, []);
    return { orderHashes, addOrder };
}
// Hook to fetch and format orders for the dashboard
export function useDashboardOrders(hashes) {
    // In a real app, we'd use indexer or events.
    // For the demo, we'll show the hashes as orders.
    return hashes.map((hash) => ({
        id: hash.slice(0, 10),
        customer: "You",
        status: "In Escrow",
        amount: "—", // Price info would be in the event or metadata
        hash: hash,
        date: "Just now",
    }));
}
