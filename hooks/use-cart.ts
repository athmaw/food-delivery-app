"use client";

import { useState, useEffect } from "react";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);

  const refresh = () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_cart");
      const savedPromo = localStorage.getItem("user_promo");
      setItems(data ? JSON.parse(data) : []);
      setPromo(savedPromo ? JSON.parse(savedPromo) : null);
    }
  };

  useEffect(() => {
    refresh();
    window.addEventListener("cartUpdated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("cartUpdated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const save = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem("user_cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    save(updated);
  };

  const removeItem = (id: string) => save(items.filter(i => i.id !== id));
  
  const addItem = (item: any) => {
    const existing = items.find((i) => i.name === item.name);
    if (existing) {
      updateQuantity(existing.id, 1);
    } else {
      save([...items, { ...item, id: Date.now().toString(), quantity: 1 }]);
    }
  };

  const applyPromoCode = (code: string) => {
    if (code.toUpperCase() === "FREESAMPLE") {
      const promoData = { code: "FREESAMPLE", discount: 0.3 }; // 30% off
      setPromo(promoData);
      localStorage.setItem("user_promo", JSON.stringify(promoData));
      return true;
    }
    return false;
  };

  const clearCart = () => {
    save([]);
    localStorage.removeItem("user_promo");
    setPromo(null);
  };

  return { items, promo, updateQuantity, removeItem, addItem, applyPromoCode, clearCart };
}