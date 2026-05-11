"use client";

import React, { useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutModal({
  isOpen,
  onClose,
  total, // This total already includes fees/discounts from OrderSummaryCard
}: {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}) {
  const { items, clearCart, promo } = useCart(); // Added promo to track used codes

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [errorPopup, setErrorPopup] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  if (!isOpen) return null;

  // FIX: Remove the double-addition of the delivery fee.
  // The 'total' prop passed in is already the final grand total.
  const grandTotal = total; 

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

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
        // We store the final amount as grandTotal for consistency with your other screens
        grandTotal: grandTotal, 
        promoCode: promo ? promo.code : null, // Save the code so it can't be reused
        status: "preparing",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900">Checkout</h2>

        <div className="text-sm space-y-2 max-h-40 overflow-y-auto border-b pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Details</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Complete delivery address"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
            rows={2}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                paymentMethod === "card" ? "border-black bg-black text-white" : "border-gray-100 text-gray-400"
              }`}
            >
              Card
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                paymentMethod === "cash" ? "border-black bg-black text-white" : "border-gray-100 text-gray-400"
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total to Pay</span>
            <span className="text-2xl font-black text-black">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-[2rem] font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>

      {/* ERROR POPUP */}
      {errorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <div className="bg-black/60 absolute inset-0" />
          <div className="relative bg-white p-8 rounded-[2rem] w-full max-w-xs text-center shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Wait a second</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{errorPopup}</p>
            <button
              onClick={() => setErrorPopup("")}
              className="mt-6 w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <div className="bg-black/60 absolute inset-0" />
          <div className="relative bg-white p-8 rounded-[2rem] w-full max-w-xs text-center shadow-2xl animate-in zoom-in duration-300">
            {/* <div className="text-5xl mb-4">🎉</div> */}
            <h3 className="font-bold text-gray-900 text-xl mb-2">Order Placed!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We've received your order and the kitchen is starting to cook!
            </p>
            <button
              onClick={() => {
                setSuccessPopup(false);
                onClose();
              }}
              className="mt-6 w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Track Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}