"use client";

import React, { useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutModal({
  isOpen,
  onClose,
  total,
}: {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}) {
  const { items, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ POPUP STATES
  const [errorPopup, setErrorPopup] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = total > 0 ? 2.5 : 0;
  const grandTotal = total + deliveryFee;

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      // ❌ VALIDATION POPUP
      if (!user) {
        setErrorPopup("You must be logged in.");
        return;
      }

      if (!address.trim() || !phone.trim()) {
        setErrorPopup("Please enter your address and phone number.");
        return;
      }

      if (items.length === 0) {
        setErrorPopup("Your cart is empty.");
        return;
      }

      const orderData = {
        userId: user.uid,
        items,
        address,
        phone,
        paymentMethod,
        itemsTotal: total,
        deliveryFee,
        grandTotal,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();

      // ✅ SUCCESS POPUP
      setSuccessPopup(true);
    } catch (err) {
      console.error(err);
      setErrorPopup("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 space-y-4">

        <h2 className="text-xl font-bold">Checkout</h2>

        {/* ITEMS */}
        <div className="text-sm space-y-2 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* ADDRESS */}
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery address"
          className="w-full border rounded-xl p-2 text-sm"
        />

        {/* PHONE */}
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="w-full border rounded-xl p-2 text-sm"
        />

        {/* PAYMENT */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`p-2 border rounded ${
              paymentMethod === "card" ? "bg-black text-white" : ""
            }`}
          >
            Card
          </button>

          <button
            onClick={() => setPaymentMethod("cash")}
            className={`p-2 border rounded ${
              paymentMethod === "cash" ? "bg-black text-white" : ""
            }`}
          >
            Cash
          </button>
        </div>

        {/* TOTAL */}
        <div className="text-sm border-t pt-2">
          <div className="flex justify-between">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>

      {/* ❌ ERROR POPUP */}
      {errorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
          <div className="bg-black/60 absolute inset-0" />
          <div className="relative bg-white p-6 rounded-2xl w-80 text-center">
            <h3 className="font-bold text-red-500 mb-2">Error</h3>
            <p className="text-sm text-gray-600">{errorPopup}</p>

            <button
              onClick={() => setErrorPopup("")}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {successPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
          <div className="bg-black/60 absolute inset-0" />
          <div className="relative bg-white p-6 rounded-2xl w-80 text-center">
            <h3 className="font-bold text-green-600 mb-2">
              Order Placed!
            </h3>
            <p className="text-sm text-gray-600">
              Your order has been successfully placed.
            </p>

            <button
              onClick={() => {
                setSuccessPopup(false);
                onClose();
              }}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}