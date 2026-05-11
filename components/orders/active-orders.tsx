"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import OrderDetailsModal from "@/components/modals/active-order-modal";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Status flow: preparing -> out_for_delivery -> arrived
const STATUS_PROGRESSION: Record<string, string | null> = {
  preparing: "out_for_delivery",
  out_for_delivery: "arrived",
  arrived: null,
};

interface OrderItem {
  id: string;
  name: string;
  restaurant?: string;
  price: number;
  quantity: number;
}

interface ActiveOrder {
  id: string;
  items: OrderItem[];
  total: number;
  grandTotal: number;
  address: string;
  phone?: string;
  paymentMethod: string;
  status: string;
  createdAt: any;
}

const getEmoji = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("coke can")) return "🥤";
  if (lower.includes("large fries")) return "🍟";
  if (lower.includes("choc lava")) return "🍰";
  if (lower.includes("bubble tea")) return "🧋";
  if (lower.includes("soft serve")) return "🍦";
  return "🍽️";
};

export default function ActiveOrders() {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<ActiveOrder | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Real-time listener for active orders (any status before collected/cancelled)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      // Fetch orders that are not final (collected or cancelled)
      where("status", "in", ["preparing", "out_for_delivery", "arrived"]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeOrders: ActiveOrder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ActiveOrder[];
      setOrders(activeOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-progress timer: check every second and update Firestore if needed
  useEffect(() => {
    if (!user || orders.length === 0) return;

    const INTERVALS = {
      preparing: 10, // seconds until promoted to next
      out_for_delivery: 30, // total time from preparing to arrived
    };

    const checkAndProgress = () => {
      orders.forEach((order) => {
        if (order.status === "arrived") return; // already final active status

        const now = Date.now();
        const created = order.createdAt?.toDate?.() ?? new Date();
        const elapsedSec = (now - created.getTime()) / 1000;

        let targetStatus = "preparing";
        if (elapsedSec >= 30) {
          targetStatus = "arrived";
        } else if (elapsedSec >= 10) {
          targetStatus = "out_for_delivery";
        }

        if (targetStatus !== order.status) {
          // Update Firestore
          updateDoc(doc(db, "orders", order.id), { status: targetStatus }).catch(
            console.error
          );
        }
      });
    };

    // Run once immediately, then every 1 second
    checkAndProgress();
    const interval = setInterval(checkAndProgress, 1000);
    return () => clearInterval(interval);
  }, [orders, user]);

  if (loading) {
    return (
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="text-gray-400 text-center">Loading active orders...</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Active Orders</h2>
        <p className="text-gray-500 mb-6">
          Your ongoing orders ({orders.length})
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-white rounded-3xl border border-gray-100">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-gray-400 text-lg">No active orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const date = order.createdAt?.toDate?.() ?? new Date();
              const dateStr = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const timeStr = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              // Display status nicely
              const statusText =
                order.status === "out_for_delivery"
                  ? "Out for delivery"
                  : order.status.charAt(0).toUpperCase() + order.status.slice(1);

              return (
                <div
                  key={order.id}
                  className="bg-[#FFFDFD] rounded-[28px] border border-gray-400 overflow-hidden"
                >
                  {/* Top section */}
                  <div className="flex items-start justify-between bg-[#F4E6E1] p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFF1F5] flex items-center justify-center text-2xl">
                        {getEmoji(order.items[0]?.name || "")}
                      </div>
                      <div>
                        <h4 className="font-bold text-[22px] text-[#2A1E21]">
                          {order.items[0]?.restaurant || "Restaurant"}
                        </h4>
                        <p className="text-[15px] text-[#A08D92] mt-1">
                          {dateStr} · {timeStr} · Order #
                          {order.id.slice(0, 5).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-5 py-2 rounded-full bg-[#F7E4EA] text-[#2A1E21] font-semibold text-sm">
                        {statusText}
                      </span>
                      <button
                        onClick={() =>
                          router.push(`/track/${order.id}`)
                        }
                        className="px-5 py-2 rounded-full bg-[#FF4F87] text-white font-semibold text-sm hover:opacity-90 transition"
                      >
                        Track →
                      </button>
                    </div>
                  </div>

                  {/* Middle items section */}
                  <div className="border-t border-[#F5EDEF] px-6 py-5 flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2 rounded-full bg-[#FBEAF0] text-[#6D5B60] text-sm font-medium"
                      >
                        {getEmoji(item.name)} {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>

                  {/* Bottom section */}
                  <div className="border-t border-gray-400 px-6 py-5 flex items-center justify-between">
                    <p className="text-[18px] font-semibold text-[#8E7B80]">
                      Total:{" "}
                      <span className="text-[#FF4F87] font-bold">
                        ₱{(order.grandTotal || order.total).toFixed(2)}
                      </span>
                    </p>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-3 rounded-full border border-[#F1D8DE] text-[#6B5057] font-semibold hover:bg-[#FFF7F9] transition"
                    >
                      View details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </section>
  );
}