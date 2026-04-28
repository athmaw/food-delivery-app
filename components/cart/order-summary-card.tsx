"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import CheckoutModal from "../modals/checkout-modal";

export default function OrderSummaryCard() {
  const { items, promo, applyPromoCode } = useCart();
  
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

  const FREE_DELIVERY_THRESHOLD = 50.00;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const amountAway = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const hasEarnedFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const discountAmount = promo ? subtotal * promo.discount : 0;
  const deliveryFee = (subtotal > 0 && deliveryType === "delivery" && !hasEarnedFreeDelivery) ? 1.99 : 0;
  const serviceFee = subtotal > 0 ? 0.50 : 0;
  const total = subtotal - discountAmount + deliveryFee + serviceFee;

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      {/* Container: Changed p-8 to p-6 */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-sans">Order summary</h2>

        {/* Progress Bar: Reduced mb-8 to mb-6 */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
              Free delivery progress
            </span>
            <span className="text-[10px] text-primary font-bold">
              {hasEarnedFreeDelivery ? "Free delivery earned! 🎉" : `$${amountAway.toFixed(2)} away!`}
            </span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-800 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Delivery Type: Reduced padding p-4 to p-3 */}
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
          Delivery Type
        </p>
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setDeliveryType("delivery")}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
              deliveryType === "delivery" 
              ? "border-primary bg-[#FFF0F3]" 
              : "border-gray-100 bg-white opacity-60"
            }`}
          >
            <span className="text-lg">🛵</span>
            <span className={`text-[11px] font-bold mt-1 ${deliveryType === "delivery" ? "text-primary" : "text-gray-400"}`}>
              Delivery
            </span>
          </button>

          <button 
            onClick={() => setDeliveryType("pickup")}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
              deliveryType === "pickup" 
              ? "border-primary bg-[#FFF0F3]" 
              : "border-gray-100 bg-white opacity-60"
            }`}
          >
            <span className="text-lg">🏃</span>
            <span className={`text-[11px] font-bold mt-1 ${deliveryType === "pickup" ? "text-primary" : "text-gray-400"}`}>
              Pick up
            </span>
          </button>
        </div>

        {/* Promo Code: Reduced height from h-12 to h-10 */}
        <div className="flex flex-row gap-2 mb-6">
          <input 
            className={`flex-1 bg-[#FDEFF2] rounded-xl px-3 h-10 text-xs text-gray-700 outline-none border-2 transition-colors ${
              error ? 'border-red-300' : 'border-transparent focus:border-primary/20'
            }`}
            placeholder="Promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <button 
            onClick={handleApplyPromo}
            className="bg-gray-900 px-4 rounded-xl text-white text-[11px] font-bold hover:bg-black transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Pricing Rows: Reduced gap from 5 to 3, pb-8 to pb-4 */}
        <div className="flex flex-col gap-3 border-b border-gray-50 pb-4 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9ea3ae] font-medium">Subtotal</span>
            <span className="font-bold text-[#1f1a17]">${subtotal.toFixed(2)}</span>
          </div>
          
          {promo && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#00c566] font-bold">Discount (30% Off)</span>
              <span className="font-bold text-[#00c566]">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9ea3ae] font-medium">Delivery fee</span>
            <span className={`font-bold ${hasEarnedFreeDelivery ? 'text-[#00c566]' : 'text-[#1f1a17]'}`}>
              {hasEarnedFreeDelivery ? "FREE" : `$${deliveryFee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9ea3ae] font-medium">Service fee</span>
            <span className="font-bold text-[#1f1a17]">${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        {/* Grand Total: Text-3xl to Text-2xl */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-[#1f1a17]">Total</span>
          <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
        </div>

        {/* Checkout Button: py-5 to py-4 */}
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={items.length === 0}
          className="w-full bg-primary py-4 rounded-[2rem] shadow-lg shadow-primary/30 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span className="text-white font-bold text-lg">Checkout</span>
        </button>
      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        total={total} 
      />
    </>
  );
}