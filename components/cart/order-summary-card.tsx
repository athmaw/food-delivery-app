"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import CheckoutModal from "../modals/checkout-modal";

export default function OrderSummaryCard() {
  const { items, promo, applyPromoCode } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  
  // Persistence: Track codes used across different sessions
  const [usedCodes, setUsedCodes] = useState<string[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("order_history_promos");
    if (saved) {
      try {
        setUsedCodes(JSON.parse(saved));
      } catch (e) {
        setUsedCodes([]);
      }
    }
  }, []);

  const FREE_DELIVERY_THRESHOLD = 50.0;

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const amountAway = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const hasEarnedFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const discountAmount = promo ? subtotal * promo.discount : 0;

  const deliveryFee =
    subtotal > 0 && deliveryType === "delivery" && !hasEarnedFreeDelivery
      ? 1.99
      : 0;

  const serviceFee = subtotal > 0 ? 0.5 : 0;

  const total = subtotal - discountAmount + deliveryFee + serviceFee;

  const handleApplyPromo = () => {
    setErrorMessage(null);
    const code = promoInput.trim().toUpperCase();

    if (!code) return;

    // 1. Check if a code is already active in the current cart
    if (promo) {
      setErrorMessage("A promo code is already applied to this order.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // 2. Check if this code has been used in a previous completed checkout
    if (usedCodes.includes(code)) {
      setErrorMessage("You have already used this promo code.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const success = applyPromoCode(code);
    if (!success) {
      setErrorMessage("Invalid or expired promo code.");
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setPromoInput("");
    }
  };

  const handleCheckoutClick = () => {
    // If there is an active promo, save it to history so it can't be used again
    if (promo) {
      const updatedHistory = [...usedCodes, promo.code.toUpperCase()];
      setUsedCodes(updatedHistory);
      localStorage.setItem("order_history_promos", JSON.stringify(updatedHistory));
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-sans">
          Order summary
        </h2>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
              Free delivery progress
            </span>
            <span className="text-[10px] text-primary font-bold">
              {hasEarnedFreeDelivery
                ? "Free delivery earned! 🎉"
                : `$${amountAway.toFixed(2)} away!`}
            </span>
          </div>

          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-800 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Delivery Type */}
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

        {/* Promo Code Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              className={`flex-1 bg-[#FDEFF2] rounded-xl px-3 h-10 text-xs text-gray-700 outline-none border-2 transition-colors ${
                errorMessage ? "border-red-400" : "border-transparent focus:border-primary/20"
              }`}
              placeholder={promo ? `Applied: ${promo.code}` : "Promo code"}
              value={promoInput}
              disabled={!!promo}
              onChange={(e) => setPromoInput(e.target.value)}
            />

            <button
              onClick={handleApplyPromo}
              disabled={!!promo}
              className="bg-gray-900 px-4 rounded-xl text-white text-[11px] font-bold hover:bg-black transition-colors disabled:bg-gray-300"
            >
              Apply
            </button>
          </div>
          
          {errorMessage && (
            <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 animate-pulse">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Summary Table */}
        <div className="flex flex-col gap-3 border-b border-gray-50 pb-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#9ea3ae]">Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>

          {promo && (
            <div className="flex justify-between text-sm">
              <span className="text-[#00c566] font-bold flex items-center gap-1">
                Discount ({promo.code})
              </span>
              <span className="text-[#00c566] font-bold">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-[#9ea3ae]">Delivery fee</span>
            <span className="font-bold">
              {hasEarnedFreeDelivery ? "FREE" : `$${deliveryFee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[#9ea3ae]">Service fee</span>
            <span className="font-bold">${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Display */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-black text-primary">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckoutClick}
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