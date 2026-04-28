"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";

export default function OrderSummaryCard() {
  const { items, promo, applyPromoCode } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState(false);
  
  // NEW: State for Delivery Type
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = promo ? subtotal * promo.discount : 0;
  
  // Logic: Only charge delivery fee if "delivery" is selected
  const deliveryFee = (subtotal > 0 && deliveryType === "delivery") ? 1.99 : 0;
  const serviceFee = subtotal > 0 ? 0.50 : 0;
  const total = subtotal - discountAmount + deliveryFee + serviceFee;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order summary</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
           <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Free delivery progress</span>
           <span className="text-[11px] text-primary font-bold">$3.02 away!</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-800 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>

      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Type</p>
      
      {/* DELIVERY TYPE SELECTION AREA */}
      <div className="flex gap-3 mb-8">
        <button 
          onClick={() => setDeliveryType("delivery")}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${
            deliveryType === "delivery" 
            ? "border-primary bg-[#FFF0F3]" 
            : "border-gray-100 bg-white opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-lg">🛵</span>
          <span className={`text-xs font-bold mt-1 ${deliveryType === "delivery" ? "text-primary" : "text-gray-400"}`}>Delivery</span>
          <span className={`text-[10px] ${deliveryType === "delivery" ? "text-primary/60" : "text-gray-300"}`}>~10 min</span>
        </button>

        <button 
          onClick={() => setDeliveryType("pickup")}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${
            deliveryType === "pickup" 
            ? "border-primary bg-[#FFF0F3]" 
            : "border-gray-100 bg-white opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-lg">🏃</span>
          <span className={`text-xs font-bold mt-1 ${deliveryType === "pickup" ? "text-primary" : "text-gray-400"}`}>Pick up</span>
          <span className={`text-[10px] ${deliveryType === "pickup" ? "text-primary/60" : "text-gray-300"}`}>~5 min</span>
        </button>
      </div>

      {/* Promo Section */}
      <div className="flex flex-row gap-2 mb-8">
        <input 
          className={`flex-1 bg-[#FDEFF2] rounded-xl px-4 h-12 text-sm text-gray-700 outline-none border ${error ? 'border-red-300' : 'border-transparent'}`}
          placeholder="Promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
        />
        <button 
          onClick={() => !applyPromoCode(promoInput) && setError(true)}
          className="bg-gray-900 px-6 rounded-xl text-white text-xs font-bold hover:bg-black transition-colors"
        >
          Apply
        </button>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-50 pb-6 mb-6">
        <div className="flex justify-between text-base">
          <span className="text-gray-400">Subtotal</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        {promo && (
          <div className="flex justify-between text-base text-green-500 font-bold">
            <span>Discount (30% Off)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base">
          <span className="text-gray-400">Delivery fee</span>
          <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl font-bold text-gray-900">Total</span>
        <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
      </div>

      <button 
        disabled={items.length === 0}
        className="w-full bg-primary py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <span className="text-white font-bold text-lg">Checkout</span>
      </button>
    </div>
  );
}