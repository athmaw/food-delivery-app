"use client";

import React from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop: the blur makes it look premium like the Figma */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        {/* Top Decorative Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-[#FDEFF2] rounded-full flex items-center justify-center animate-bounce">
            <span className="text-5xl">🛍️</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Confirm Order</h2>
          <p className="text-gray-400 text-base leading-relaxed">
            You're about to place an order for <span className="text-primary font-black">${total.toFixed(2)}</span>.
          </p>
        </div>

        {/* Order Details Mini-Card */}
        <div className="bg-[#FAF9F6] rounded-3xl p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Time</span>
            <span className="text-sm font-bold text-gray-900">20 - 30 Mins</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment</span>
            <span className="text-sm font-bold text-gray-900">Apple Pay / Card</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              alert("Payment Successful!");
              onClose();
            }}
            className="w-full bg-primary py-5 rounded-2xl text-white font-bold text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Confirm & Pay
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors"
          >
            Not yet, go back
          </button>
        </div>
      </div>
    </div>
  );
}