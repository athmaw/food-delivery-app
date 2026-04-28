"use client";

import React from 'react';
import OrderItemsCard from './order-items-card';
import OrderSummaryCard from './order-summary-card';
import { useCart } from '@/hooks/use-cart';

const ExtraItemWidget = ({ icon, name, price }: { icon: string; name: string; price: string }) => {
  const { addItem } = useCart();

  const handleAddExtra = () => {
    addItem({
      name,
      price: parseFloat(price.replace("$", "")),
      restaurant: "Extras",
    });
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center min-w-[140px] shadow-sm hover:border-primary/30 transition-all group">
      <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</span>
      <p className="text-[11px] font-bold text-center text-gray-800 mb-1">{name}</p>
      <p className="text-[11px] text-primary font-black mb-4">{price}</p>
      <button 
        onClick={handleAddExtra}
        className="bg-[#FFF0F3] w-8 h-8 rounded-xl flex items-center justify-center text-primary font-bold hover:bg-primary hover:text-white transition-all"
      >
        +
      </button>
    </div>
  );
};

export default function CartContainer() {
  return (
    <div className="flex-1 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-6xl mx-auto w-full py-12 px-6">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Your Cart <span className="text-3xl">🛒</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            2 items from 2 restaurants
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-[2] w-full flex flex-col gap-10">
            <OrderItemsCard />
            
            <div>
              <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-6">
                Add something extra?
              </h3>
              <div className="flex flex-row overflow-x-auto pb-4 gap-4 no-scrollbar">
                <ExtraItemWidget icon="🥤" name="Coke Can" price="$1.50" />
                <ExtraItemWidget icon="🍟" name="Large Fries" price="$3.00" />
                <ExtraItemWidget icon="🍰" name="Choc Lava" price="$6.00" />
                <ExtraItemWidget icon="🧋" name="Bubble Tea" price="$4.50" />
                <ExtraItemWidget icon="🍦" name="Soft Serve" price="$2.50" />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-[400px] lg:sticky lg:top-8">
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}