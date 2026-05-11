"use client";

import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface OrderItem {
  id: string;
  name: string;
  restaurant?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  grandTotal: number;
  total: number;         // items subtotal (before fees) – same as itemsTotal
  deliveryFee?: number;  // saved from checkout
  address: string;
  phone?: string;
  paymentMethod: string;
  status: string;
  createdAt?: any;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

   // --- Correct maths ---
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = order.deliveryFee ?? 0;
  const finalTotal = order.grandTotal; // fallback if grandTotal isn't saved, using service fee of $0.50 as in checkout modal
  const serviceFee = 0.50;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", order.id), { status: newStatus });
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header: Booking ID and dynamic status pill */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Booking ID
            </p>
            <p className="text-sm font-mono font-bold text-gray-800">
              {order.id.slice(0, 16).toUpperCase()}
            </p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
              order.status === "collected"
                ? "bg-green-100 text-green-700"
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-[#F7E4EA] text-[#2A1E21]"
            }`}
          >
            {order.status === "out_for_delivery"
              ? "Out for delivery"
              : order.status}
          </span>
        </div>

        {/* Restaurant + date */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900">
            {order.items[0]?.restaurant || "Restaurant"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {order.createdAt?.toDate().toLocaleDateString()}{" "}
            {order.createdAt?.toDate().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Address & phone */}
        <div>
          {order.address && (
            <p className="text-sm text-gray-400">📍 {order.address}</p>
          )}
          {order.phone && (
            <p className="text-sm text-gray-400">📞 {order.phone}</p>
          )}
        </div>

        {/* Items list */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-sm font-medium text-gray-800">
                {item.quantity}x {item.name}
              </span>
              <span className="text-sm font-bold text-gray-700">
                ₱{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery fee</span>
            <span className="font-medium">
              {deliveryFee === 0 ? "Free" : `₱${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service fee</span>
            <span className="font-medium">₱{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-base border-t pt-2">
            <span>Payment</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">₱{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons for active orders */}
        {order.status !== "collected" && order.status !== "cancelled" && (
          <div className="flex gap-3 pt-2">
            {order.status === "arrived" && (
              <button
                onClick={() => handleStatusUpdate("collected")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Collected
              </button>
            )}
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}