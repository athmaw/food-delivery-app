"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import CheckoutModal from "@/components/cart/checkout-modal";

export default function OrderSummaryCard() {
  const { items, promo, applyPromoCode } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = promo ? subtotal * promo.discount : 0;
  const deliveryFee = (subtotal > 0 && deliveryType === "delivery") ? 1.99 : 0;
  const serviceFee = subtotal > 0 ? 0.5 : 0;
  const total = subtotal - discountAmount + deliveryFee + serviceFee;

  return (
    <>
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order summary</h2>

        {/* Delivery Type */}
        <div className="flex gap-3 mb-8">
          <button 
            onClick={() => setDeliveryType("delivery")}
            className={`flex-1 p-4 rounded-2xl border-2 ${
              deliveryType === "delivery" ? "border-primary bg-[#FFF0F3]" : "border-gray-100"
            }`}
          >
            Delivery
          </button>

          <button 
            onClick={() => setDeliveryType("pickup")}
            className={`flex-1 p-4 rounded-2xl border-2 ${
              deliveryType === "pickup" ? "border-primary bg-[#FFF0F3]" : "border-gray-100"
            }`}
          >
            Pickup
          </button>
        </div>

        {/* Promo */}
        <div className="flex gap-2 mb-6">
          <input
            className={`flex-1 p-2 border rounded ${error ? "border-red-500" : ""}`}
            placeholder="Promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <button
            onClick={() => {
              const success = applyPromoCode(promoInput);
              setError(!success);
            }}
            className="bg-black text-white px-4 rounded"
          >
            Apply
          </button>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
          <p>Service Fee: ${serviceFee.toFixed(2)}</p>
          {promo && <p className="text-green-500">Discount: -${discountAmount.toFixed(2)}</p>}
        </div>

        <h3 className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</h3>

        {/* Checkout Button */}
        <button
          onClick={() => setIsCheckoutOpen(true)}
          disabled={items.length === 0}
          className="w-full bg-primary text-white py-3 rounded disabled:opacity-50"
        >
          Checkout
        </button>
      </div>

      {/* MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        total={total}
        deliveryType={deliveryType}
      />
    </>
  );
}