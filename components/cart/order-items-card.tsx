"use client";

import React from "react";
import { useCart } from "@/hooks/use-cart";

export default function OrderItemsCard() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
        <p className="text-gray-400">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Order items</h2>
        <button onClick={clearCart} className="text-gray-400 text-sm hover:text-primary transition-colors">
          Clear all
        </button>
      </div>

      {items.map((item) => (
        <div key={item.id} className="flex items-center py-6 border-b border-gray-50 last:border-0">
          <div className="w-20 h-20 bg-[#F2F4F5] rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl">
            {/* If you have images, use <img> here, otherwise the grey box matches Figma */}
            {item.name.includes("Pizza") ? "🍕" : "🍜"}
          </div>
          
          <div className="flex-1 ml-6">
            <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
            <p className="text-gray-400 text-sm mt-1">{item.restaurant}</p>
            <p className="text-primary font-bold text-lg mt-2">${item.price.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-gray-100 rounded-full px-2 py-1 bg-white">
              <button 
                onClick={() => updateQuantity(item.id, -1)} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary text-xl"
              >
                −
              </button>
              <span className="mx-4 font-bold text-gray-800 min-w-[20px] text-center">
                {item.quantity}
              </span>
              <button 
                onClick={() => updateQuantity(item.id, 1)} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary text-xl"
              >
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-100 hover:text-red-400 p-2 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}