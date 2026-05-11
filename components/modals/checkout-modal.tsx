"use client";

import React, { useState, useMemo } from "react";
import { db, auth } from "@/app/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/hooks/use-cart";
import { CheckCircle2, AlertCircle, X, Phone, MapPin } from "lucide-react";

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
  const [errorPopup, setErrorPopup] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Updated validation for PH context (09... or +63...)
  const isPhoneValid = useMemo(() => {
    if (!phone) return true;
    // Regex for: 09 followed by 9 digits OR +63 followed by 10 digits
    const phRegex = /^(09\d{9}|\+63\d{10})$/;
    return phRegex.test(phone.replace(/\s/g, ''));
  }, [phone]);

  const deliveryFee = total > 0 ? 2.5 : 0;
  const grandTotal = total + deliveryFee;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        setErrorPopup("Please log in to continue.");
        return;
      }
      if (!address.trim() || !phone.trim()) {
        setErrorPopup("Address and phone are required.");
        return;
      }
      if (!isPhoneValid) {
        setErrorPopup("Please enter a valid PH phone number (e.g., 09123456789).");
        return;
      }

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items,
        address,
        phone,
        paymentMethod,
        grandTotal,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      clearCart();
      setSuccessPopup(true);
    } catch (err) {
      setErrorPopup("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[380px] bg-white rounded-[2rem] p-5 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Checkout</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-gray-50/80 rounded-2xl p-4 mb-5 border border-gray-100 text-sm">
          <div className="space-y-1.5 max-h-24 overflow-y-auto mb-3 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-gray-600">
                <span className="truncate mr-2">{item.name} <span className="text-gray-400 font-medium">x{item.quantity}</span></span>
                <span className="font-semibold text-gray-800 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 tracking-wider pt-2 border-t border-gray-200/60">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all resize-none h-16"
            />
          </div>

          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${!isPhoneValid && phoneTouched ? 'text-red-400' : 'text-gray-400'}`} />
            <input
              type="tel"
              value={phone}
              onBlur={() => setPhoneTouched(true)}
              onChange={(e) => {
                // 1. Only allow numbers and + sign
                // 2. Limit to 11 characters (or 13 if they use +63)
                const cleaned = e.target.value.replace(/[^0-9+]/g, "");
                const maxLength = cleaned.startsWith('+') ? 13 : 11;
                setPhone(cleaned.slice(0, maxLength));
              }}
              placeholder="09XXXXXXXXX"
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-sm outline-none transition-all truncate ${
                !isPhoneValid && phoneTouched 
                ? "border-red-400 focus:ring-4 focus:ring-red-50" 
                : "border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              }`}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(["card", "cash"] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                paymentMethod === method
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-50 bg-gray-100/50 text-gray-400 hover:border-gray-200"
              }`}
            >
              {method === "card" ? "Credit Card" : "Cash"}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-2xl font-bold flex justify-between items-center px-6 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          <span className="text-sm">{loading ? "Processing..." : "Place Order"}</span>
          <span className="text-sm opacity-90">${grandTotal.toFixed(2)}</span>
        </button>
      </div>

      {(errorPopup || successPopup) && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-6 animate-in fade-in duration-200">
          <div className="bg-black/20 absolute inset-0 backdrop-blur-[2px]" />
          <div className="relative bg-white p-6 rounded-[2rem] w-full max-w-[280px] text-center shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${successPopup ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}>
              {successPopup ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{successPopup ? "Success!" : "Hold on"}</h3>
            <p className="text-xs text-gray-500 mb-4">{errorPopup || "Order placed successfully!"}</p>
            <button
              onClick={() => {
                setErrorPopup("");
                if (successPopup) {
                  setSuccessPopup(false);
                  onClose();
                }
              }}
              className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              {successPopup ? "Awesome" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}