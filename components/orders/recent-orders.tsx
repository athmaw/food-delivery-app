"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { useCart } from "@/hooks/use-cart";
import OrderDetailsModal from "@/components/modals/active-order-modal";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface OrderItem {
  id: string;
  name: string;
  restaurant?: string;
  price: number;
  quantity: number;
}

interface CompletedOrder {
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

const getRelativeDateLabel = (timestamp: any): string => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (orderDate.getTime() === today.getTime()) return "Today";
  if (orderDate.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "delivered" | "cancelled">("all");
  const { addItem } = useCart();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      where("status", "in", ["collected", "cancelled"]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recent: CompletedOrder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CompletedOrder[];
      setOrders(recent);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

   const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "delivered") return order.status === "collected";
    if (activeTab === "cancelled") return order.status === "cancelled";
    return true;
  });
  
  const groupedOrders: Record<string, CompletedOrder[]> = {};
  filteredOrders.forEach((order) => {
    const label = getRelativeDateLabel(order.createdAt);
    if (!groupedOrders[label]) groupedOrders[label] = [];
    groupedOrders[label].push(order);
  });

  const handleReorder = (order: CompletedOrder) => {
    if (!user) return;
    order.items.forEach((item) => {
      addItem({
        name: item.name,
        price: item.price,
        restaurant: item.restaurant || "Restaurant",
        quantity: item.quantity,
      });
    });
    alert("Items added to cart!");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Order History</h2>
        <p className="text-gray-500 mb-6">View your past orders and reorder favourites</p>

        {/* Tab filters */}
        <div className="inline-flex items-center gap-2 bg-[#F8F4F5] p-1.5 rounded-2xl mb-8 border border-[#F1E6E8]">
          {[
            { key: "all", label: "All" },
            { key: "delivered", label: "Delivered" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  activeTab === tab.key
                    ? "bg-[#FF4F87] text-white shadow-sm"
                    : "text-[#8F7D83] hover:bg-white/70"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading orders...</p>
        ) : Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([dateLabel, ordersGroup]) => (
            <div key={dateLabel} className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                {dateLabel}
              </h3>
              <div className="space-y-4">
                {ordersGroup.map((order) => {
                  const date = order.createdAt?.toDate?.() ?? new Date();
                  const timeStr = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const orderNumber = `FB-${order.id.slice(0, 5).toUpperCase()}`;

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
                              {order.items[0]?.restaurant || "Order"}
                            </h4>
                            <p className="text-[15px] text-[#A08D92] mt-1">
                              {dateLabel} · {timeStr} · Order #{orderNumber}
                            </p>
                          </div>
                        </div>

                        <span className="px-5 py-2 rounded-full bg-[#92E0AB] text-[#2A1E21] font-semibold text-sm">
                          {order.status === "collected" ? "Delivered" : order.status}
                        </span>
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

                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-6 py-3 rounded-full border border-[#F1D8DE] text-[#6B5057] font-semibold hover:bg-[#FFF7F9] transition"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="px-6 py-3 rounded-full border border-[#F1D8DE] text-white font-semibold bg-black hover:bg-[#6B5057] transition"
                          >
                            Reorder
                          </button>
                          {order.status === "collected" && (
                            <button
                              onClick={() => alert("Rate order feature coming soon!")}
                              className="px-6 py-3 rounded-full bg-[#FF4F87] text-white font-semibold hover:opacity-90 transition inline-flex items-center gap-1"
                            >
                              Rate <span className="text-yellow-500">★</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
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