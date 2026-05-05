"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  total: number;
  deliveryType: string;
};

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  total,
  deliveryType,
}: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!name || !address) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        name,
        address,
        items: cartItems,
        total,
        deliveryType,
        createdAt: Timestamp.now(),
      });

      alert("Order placed successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 mb-3 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <p className="mb-2 text-sm">Delivery: {deliveryType}</p>
        <p className="mb-4 text-sm font-bold">Total: ${total.toFixed(2)}</p>

        <button
          onClick={handleCheckout}
          className="w-full bg-green-500 text-white p-2 rounded mb-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}