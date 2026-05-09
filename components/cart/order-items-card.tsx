// components/cart/order-items-card.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { db, auth } from "@/app/lib/firebase"; // Import your firebase config
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function OrderItemsCard() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore Data
  useEffect(() => {
    const fetchPastOrders = async (uid: string) => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        const orders: any[] = [];
        querySnapshot.forEach((doc) => {
          // Assuming each doc has an 'items' array
          orders.push(...doc.data().items);
        });
        setPastOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPastOrders(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getEmoji = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("burger")) return "🍔";
    if (lowerName.includes("pizza")) return "🍕";
    if (lowerName.includes("sushi")) return "🍣";
    if (lowerName.includes("coffee") || lowerName.includes("latte")) return "☕";
    return "🍽️";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION 1: ACTIVE CART ITEMS */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Current Cart</h2>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-gray-400 text-sm hover:text-primary transition-colors font-medium">
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col">
            {items.map((item) => (
              <div key={item.id} className="flex items-center py-6 border-b border-gray-50 last:border-0">
                <div className="w-20 h-20 bg-[#F2F4F5] rounded-2xl flex items-center justify-center text-3xl">{getEmoji(item.name)}</div>
                <div className="flex-1 ml-6">
                  <h4 className="font-bold text-[#1f1a17] text-lg">{item.name}</h4>
                  <p className="text-[#9ea3ae] text-sm">{item.restaurant}</p>
                  <p className="text-primary font-bold mt-2">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center border rounded-full px-2 py-1 bg-white">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 text-gray-400 hover:text-primary">−</button>
                      <span className="mx-2 font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 text-gray-400 hover:text-primary">+</button>
                   </div>
                   <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: PAST ORDERS (FROM FIRESTORE)
      {pastOrders.length > 0 && (
        <div className="bg-gray-50/50 rounded-3xl p-8 border border-dashed border-gray-200">
          <h2 className="text-lg font-bold text-gray-500 mb-6 flex items-center gap-2">
            Recently Purchased <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{pastOrders.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOrders.map((orderItem, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 opacity-70">
                <span className="text-2xl">{getEmoji(orderItem.name)}</span>
                <div>
                  <p className="font-bold text-sm text-gray-800">{orderItem.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Completed Order</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
}